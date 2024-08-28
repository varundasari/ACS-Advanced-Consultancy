CREATE DATABASE node_login;
USE node_login;


CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) UNIQUE,
    role ENUM('admin', 'user') DEFAULT 'user'
);

CREATE TABLE IF NOT EXISTS campaigns (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    business VARCHAR(255),
    approved TINYINT(1) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


INSERT INTO users (username, password, email, role) VALUES
('admin12', '$2b$10$CwTycUXWue0Thq9StjUM0uJhTjRHzM.z0oB6N7T/QvjaEk5An8lBu', 'admin@example.com', 'admin');

INSERT INTO campaigns (title, description, business, approved) VALUES
('Health Awareness Campaign', 'This campaign aims to raise awareness about the importance of health and wellness in our community. We focus on promoting healthy lifestyles and preventive measures.', 'Health Organization', 0);



INSERT INTO campaigns (title, description, business, approved) VALUES
('hello world', 'This campaign aims to raise awareness about the importance of health and wellness in our community. We focus on promoting healthy lifestyles and preventive measures.', 'Health Organization', 0);

INSERT INTO users (username, password, email, role) 
VALUES ('admin_user1', 'hashed_password', 'admin12@example.com', 'admin');

INSERT INTO users (username, email, password, role) 
VALUES ('admin_user2', 'admin123@example.com', '$2a$12$C2iujWQYFzokV96wE/TBi.wVZcBMkCqcisF0BBQZU7449QbQRKCUi', 'admin');
