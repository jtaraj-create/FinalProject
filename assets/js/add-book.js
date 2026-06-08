document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('addBookForm').addEventListener('submit', async event => {
        event.preventDefault();
        const book = {
            title: document.getElementById('bookTitle').value.trim(),
            author: document.getElementById('bookAuthor').value.trim(),
            category: document.getElementById('bookCategory').value.trim(),
            status: document.getElementById('bookStatus').value
        };

        try {
            await apiRequest(API_URL, 'POST', book);
            showMessage('formMessage', 'Book saved successfully. Redirecting...', 'success');
            setTimeout(() => window.location.href = 'index.html', 500);
        } catch (error) {
            showMessage('formMessage', error.message, 'error');
        }
    });
});
