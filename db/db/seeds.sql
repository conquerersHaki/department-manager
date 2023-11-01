INSERT INTO department (name)
VALUES 
    ("IT"),
    ("Customer Service"),
    ("Sales");

INSERT INTO role (title, salary, department_id)
VALUES 
    ("Junior Devloper", 50,000, 1),
    ("Sales Manager", 300,000, 3),
    ("Customer Assistant", 25,000, 2);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES 
    ("Michael", "Scott", 2, 57),
    ("Pamela", "Beesly", 3, 1);