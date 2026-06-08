<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

require_once __DIR__ . '/../config/database.php';

$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? '';
$input = json_decode(file_get_contents('php://input'), true) ?? [];

function sendResponse($success, $message, $data = null, $code = 200) {
    http_response_code($code);
    echo json_encode([
        'success' => $success,
        'message' => $message,
        'data' => $data
    ]);
    exit;
}

function cleanText($value) {
    return trim((string)($value ?? ''));
}

try {
    if ($method === 'GET' && $action === 'stats') {
        $total = (int)$pdo->query("SELECT COUNT(*) FROM books")->fetchColumn();
        $available = (int)$pdo->query("SELECT COUNT(*) FROM books WHERE status='Available'")->fetchColumn();
        $borrowed = (int)$pdo->query("SELECT COUNT(*) FROM books WHERE status='Borrowed'")->fetchColumn();
        sendResponse(true, 'Statistics loaded.', [
            'total' => $total,
            'available' => $available,
            'borrowed' => $borrowed
        ]);
    }

    if ($method === 'GET' && $action === 'categories') {
        $stmt = $pdo->query("SELECT DISTINCT category FROM books WHERE category <> '' ORDER BY category ASC");
        sendResponse(true, 'Categories loaded.', $stmt->fetchAll(PDO::FETCH_COLUMN));
    }

    if ($method === 'GET') {
        if (isset($_GET['id'])) {
            $stmt = $pdo->prepare('SELECT * FROM books WHERE id = ?');
            $stmt->execute([(int)$_GET['id']]);
            $book = $stmt->fetch();
            if (!$book) sendResponse(false, 'Book not found.', null, 404);
            sendResponse(true, 'Book loaded.', $book);
        }

        $search = cleanText($_GET['search'] ?? '');
        $category = cleanText($_GET['category'] ?? 'All');

        $sql = 'SELECT * FROM books WHERE 1=1';
        $params = [];

        if ($search !== '') {
            $sql .= ' AND (title LIKE :search OR author LIKE :search OR CAST(id AS CHAR) LIKE :search)';
            $params[':search'] = '%' . $search . '%';
        }

        if ($category !== '' && $category !== 'All') {
            $sql .= ' AND category = :category';
            $params[':category'] = $category;
        }

        $sql .= ' ORDER BY id DESC';
        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);
        sendResponse(true, 'Books loaded.', $stmt->fetchAll());
    }

    if ($method === 'POST') {
        $title = cleanText($input['title'] ?? '');
        $author = cleanText($input['author'] ?? '');
        $category = cleanText($input['category'] ?? '');
        $status = cleanText($input['status'] ?? 'Available');

        if ($title === '' || $author === '' || $category === '') {
            sendResponse(false, 'Title, author and category are required.', null, 422);
        }
        if (!in_array($status, ['Available', 'Borrowed'], true)) {
            sendResponse(false, 'Invalid book status.', null, 422);
        }

        $stmt = $pdo->prepare('INSERT INTO books (title, author, category, status) VALUES (?, ?, ?, ?)');
        $stmt->execute([$title, $author, $category, $status]);
        sendResponse(true, 'Book added successfully.', ['id' => (int)$pdo->lastInsertId()], 201);
    }

    if ($method === 'PUT') {
        $id = (int)($input['id'] ?? 0);
        $title = cleanText($input['title'] ?? '');
        $author = cleanText($input['author'] ?? '');
        $category = cleanText($input['category'] ?? '');
        $status = cleanText($input['status'] ?? 'Available');

        if ($id <= 0) sendResponse(false, 'Invalid book ID.', null, 422);
        if ($title === '' || $author === '' || $category === '') {
            sendResponse(false, 'Title, author and category are required.', null, 422);
        }
        if (!in_array($status, ['Available', 'Borrowed'], true)) {
            sendResponse(false, 'Invalid book status.', null, 422);
        }

        $stmt = $pdo->prepare('UPDATE books SET title=?, author=?, category=?, status=? WHERE id=?');
        $stmt->execute([$title, $author, $category, $status, $id]);
        if ($stmt->rowCount() === 0) {
            // Still valid if data was unchanged, so check if book exists
            $check = $pdo->prepare('SELECT id FROM books WHERE id=?');
            $check->execute([$id]);
            if (!$check->fetch()) sendResponse(false, 'Book not found.', null, 404);
        }
        sendResponse(true, 'Book updated successfully.');
    }

    if ($method === 'DELETE') {
        if ($action === 'clear') {
            $pdo->exec('DELETE FROM books');
            $pdo->exec('ALTER TABLE books AUTO_INCREMENT = 1');
            sendResponse(true, 'All books deleted successfully.');
        }

        $id = (int)($_GET['id'] ?? 0);
        if ($id <= 0) sendResponse(false, 'Invalid book ID.', null, 422);

        $stmt = $pdo->prepare('DELETE FROM books WHERE id=?');
        $stmt->execute([$id]);
        if ($stmt->rowCount() === 0) sendResponse(false, 'Book not found.', null, 404);
        sendResponse(true, 'Book deleted successfully.');
    }

    sendResponse(false, 'Unsupported request method.', null, 405);

} catch (PDOException $e) {
    sendResponse(false, 'Database error: ' . $e->getMessage(), null, 500);
}
?>
