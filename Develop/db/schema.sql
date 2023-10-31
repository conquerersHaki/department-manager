-- creating database
DROP DATABASE IF EXISTS company_db;
CREATE DATABASE company_db;

-- using database to add tables
USE company_db;

--creating department table
CREATE TABLE department (
    id INT AUTO_INCREMENT PRIMARY KEY,
    department_name VARCHAR(30)
);

--creating role table
CREATE TABLE roles (
    id INT AUTO_INCREMENTPRIMARY KEY,
    title VARCHAR(30),
    salary DECIMAL,
    department_id INT
);

--creating employee table
CREATE TABLE employee (
    id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(30),
    last_name VARCHAR(30),
    role_id INT,
    manager_id INT
);