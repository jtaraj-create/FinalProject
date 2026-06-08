let searchTimer = null;

async function loadStats() {
    const stats = await apiRequest(`${API_URL}?action=stats`);
    document.getElementById('totalBooks').textContent = stats.total;
    document.getElementById('availableBooks').textContent = stats.available;
    document.getElementById('borrowedBooks').textContent = stats.borrowed;
}

async function loadCategories() {
    const categories = await apiRequest(`${API_URL}?action=categories`);
    const select = document.getElementById('categoryFilter');
    const current = select.value || 'All';
    select.innerHTML = '<option value="All">All categories</option>';
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        select.appendChild(option);
    });
    select.value = [...select.options].some(o => o.value === current) ? current : 'All';
}

async function loadBooks() {
    const body = document.getElementById('tableBody');
    body.innerHTML = '<tr><td colspan="5" class="empty">Loading books...</td></tr>';

    try {
        const search = encodeURIComponent(document.getElementById('searchInput').value.trim());
        const category = encodeURIComponent(document.getElementById('categoryFilter').value || 'All');
        const books = await apiRequest(`${API_URL}?search=${search}&category=${category}`);
        renderBooks(books);
        await loadStats();
        await loadCategories();
    } catch (error) {
        body.innerHTML = `<tr><td colspan="5" class="empty">${escapeHTML(error.message)}</td></tr>`;
    }
}

function renderBooks(books) {
    const body = document.getElementById('tableBody');
    if (!books.length) {
        body.innerHTML = '<tr><td colspan="5" class="empty">No books found in the database.</td></tr>';
        return;
    }

    body.innerHTML = books.map(book => `
        <tr>
            <td><strong>${escapeHTML(book.title)}</strong><br><small>#${escapeHTML(book.id)}</small></td>
            <td>${escapeHTML(book.author)}</td>
            <td>${escapeHTML(book.category)}</td>
            <td>${statusBadge(book.status)}</td>
            <td>
                <div class="row-actions">
                    <a class="btn btn-warning" href="edit-book.html?id=${book.id}">Edit</a>
                    <a class="btn btn-danger" href="delete-book.html?id=${book.id}">Delete</a>
                </div>
            </td>
        </tr>
    `).join('');
}

async function clearAllBooks() {
    if (!confirm('Delete all books from the MySQL database?')) return;
    try {
        await apiRequest(`${API_URL}?action=clear`, 'DELETE');
        await loadBooks();
    } catch (error) {
        alert(error.message);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    loadBooks();
    document.getElementById('searchInput').addEventListener('input', () => {
        clearTimeout(searchTimer);
        searchTimer = setTimeout(loadBooks, 250);
    });
    document.getElementById('categoryFilter').addEventListener('change', loadBooks);
    document.getElementById('clearAllBtn').addEventListener('click', clearAllBooks);
});
