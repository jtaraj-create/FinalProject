# Library Dashboard - PHP, MySQL, HTML, CSS and JavaScript

This is the finalized backend version of the Library Book Management System. Data is saved in MySQL, not in localStorage.

## Main Features

- Add new books
- View books from MySQL database
- Search books by title, author, or ID
- Filter books by category
- Edit book records
- Delete one book
- Clear all database records quickly
- Dashboard statistics: total, available, borrowed
- PHP REST-style API
- Automatic database/table creation from PHP
- Improved error messages if Apache/MySQL is not running
- New custom CSS design

## Technologies Used

- HTML5
- CSS3
- JavaScript
- PHP
- MySQL
- REST-style API

## Important Setup

Do not open the HTML file by double-clicking it. The PHP API only works through Apache.

Correct way:

1. Install and open XAMPP.
2. Start Apache.
3. Start MySQL.
4. Copy the full folder `jtaraj24_project_final` into:
   `C:/xampp/htdocs/`
5. Open this URL in the browser:
   `http://localhost/jtaraj24_project_final/index.html`

The project can create the database and table automatically. If you want sample records, import:

`database/library_db.sql`

through phpMyAdmin.

## Database Configuration

Open:

`config/database.php`

Default XAMPP settings are:

- host: localhost
- database: library_db
- username: root
- password: empty

If your MySQL has a password, update it there.

## API Endpoints

Main API file:

`api/books.php`

Examples:

- `GET api/books.php` - get all books
- `GET api/books.php?id=1` - get one book
- `GET api/books.php?search=clean&category=Programming` - search/filter books
- `GET api/books.php?action=stats` - dashboard statistics
- `GET api/books.php?action=categories` - category list
- `POST api/books.php` - add book
- `PUT api/books.php` - update book
- `DELETE api/books.php?id=1` - delete one book
- `DELETE api/books.php?action=clear` - delete all books

## Why the previous version showed “Loading books...” forever

That usually happens when JavaScript calls the PHP API, but PHP cannot return valid JSON. Common causes are:

- MySQL is not started.
- The database was not imported.
- The project was opened as a file instead of through localhost.
- The folder was not inside `htdocs`.
- The MySQL username/password was different.

This version shows a visible error message instead of staying stuck.
