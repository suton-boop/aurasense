USE aurasense;
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE,
    password VARCHAR(255),
    role VARCHAR(20)
);
INSERT IGNORE INTO users (username, password, role) VALUES ('admin', 'admin123', 'admin');
