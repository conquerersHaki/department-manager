INSERT INTO department (department_name)
VALUES 
    ("IT"),
    ("Customer Service"),
    ("Sales");

INSERT INTO role (title, salary, department_id)
VALUES 
    ("Junior Devloper", 50000, 1),
    ("Sales Manager", 300000, 3),
    ("Customer Assistant", 25000, 2);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES 
    ("Michael", "Scott", 2, null),
    ("Pamela", "Beesly", 3, 1);