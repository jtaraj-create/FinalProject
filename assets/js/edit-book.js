async function loadBookForEdit() {
    const id = getIdFromUrl();
    if (!id) {
        showMessage('formMessage', 'No book ID was provided.', 'error');
        return;
    }

    try {
        const book = await apiRequest(`${API_URL}?id=${encodeURIComponent(id)}`);
        document.getElementById('bookId').value = book.id;
        document.getElementById('bookTitle').value = book.title;
        document.getElementById('bookAuthor').value = book.author;
        document.getElementById('bookCategory').value = book.category;
        document.getElementById('bookStatus').value = book.status;
    } catch (error) {
        showMessage('formMessage', error.message, 'error');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    loadBookForEdit();
    document.getElementById('editBookForm').addEventListener('submit', async event => {
        event.preventDefault();
        const book = {
            id: document.getElementById('bookId').value,
            title: document.getElementById('bookTitle').value.trim(),
            author: document.getElementById('bookAuthor').value.trim(),
            category: document.getElementById('bookCategory').value.trim(),
            status: document.getElementById('bookStatus').value
        };

        try {
            await apiRequest(API_URL, 'PUT', book);
            showMessage('formMessage', 'Book updated successfully. Redirecting...', 'success');
            setTimeout(() => window.location.href = 'index.html', 500);
        } catch (error) {
            showMessage('formMessage', error.message, 'error');
        }
    });
});
