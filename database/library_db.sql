CREATE DATABASE IF NOT EXISTS library_db CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE library_db;

DROP TABLE IF EXISTS books;

CREATE TABLE books (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL,
    category VARCHAR(120) NOT NULL,
    status ENUM('Available','Borrowed') NOT NULL DEFAULT 'Available',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO books (title, author, category, status) VALUES
('The Great Gatsby', 'F. Scott Fitzgerald', 'Classic', 'Available'),
('To Kill a Mockingbird', 'Harper Lee', 'Fiction', 'Borrowed'),
('Clean Code', 'Robert C. Martin', 'Programming', 'Available'),
('Introduction to Web Technologies', 'Course Material', 'Education', 'Available');
