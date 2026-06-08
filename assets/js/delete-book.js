let selectedBookId = null;

async function loadBookForDelete() {
    selectedBookId = getIdFromUrl();
    if (!selectedBookId) {
        showMessage('formMessage', 'No book ID was provided.', 'error');
        return;
    }

    try {
        const book = await apiRequest(`${API_URL}?id=${encodeURIComponent(selectedBookId)}`);
        document.getElementById('bookInfo').innerHTML = `
            <p><strong>Title:</strong> ${escapeHTML(book.title)}</p>
            <p><strong>ID:</strong> #${escapeHTML(book.id)}</p>
            <p><strong>Author:</strong> ${escapeHTML(book.author)}</p>
            <p><strong>Category:</strong> ${escapeHTML(book.category)}</p>
            <p><strong>Status:</strong> ${statusBadge(book.status)}</p>
        `;
    } catch (error) {
        showMessage('formMessage', error.message, 'error');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    loadBookForDelete();
    document.getElementById('deleteBtn').addEventListener('click', async () => {
        if (!selectedBookId) return;
        try {
            await apiRequest(`${API_URL}?id=${encodeURIComponent(selectedBookId)}`, 'DELETE');
            showMessage('formMessage', 'Book deleted successfully. Redirecting...', 'success');
            setTimeout(() => window.location.href = 'index.html', 500);
        } catch (error) {
            showMessage('formMessage', error.message, 'error');
        }
    });
});
