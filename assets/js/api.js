const API_URL = 'api/books.php';

function escapeHTML(value) {
    return String(value ?? '')
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#039;');
}

async function apiRequest(url, method = 'GET', data = null) {
    const options = { method, headers: { 'Content-Type': 'application/json' } };
    if (data !== null) options.body = JSON.stringify(data);

    let response;
    try {
        response = await fetch(url, options);
    } catch (error) {
        throw new Error('Cannot connect to the PHP API. Open the project using http://localhost/... not by double-clicking the HTML file.');
    }

    const text = await response.text();
    let result;
    try {
        result = JSON.parse(text);
    } catch (error) {
        throw new Error('The API did not return JSON. Check that Apache and MySQL are running and that the folder is inside htdocs.');
    }

    if (!response.ok || !result.success) {
        throw new Error(result.message || 'Request failed.');
    }

    return result.data;
}

function showMessage(id, text, type = 'error') {
    const element = document.getElementById(id);
    if (!element) return;
    element.className = `message ${type}`;
    element.textContent = text;
}

function statusBadge(status) {
    const safeStatus = escapeHTML(status);
    const css = status === 'Available' ? 'badge-available' : 'badge-borrowed';
    return `<span class="badge ${css}">${safeStatus}</span>`;
}

function getIdFromUrl() {
    return new URLSearchParams(window.location.search).get('id');
}
