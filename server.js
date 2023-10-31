//requiring mysql and other necessities 
const express = require("express");
const inquirer = require('inquirer');
const cTable = require('console.table');

const mysql = require("mysql2");

//middleware
const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//connecting to database
const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: 'Netrunner!',
        databse: 'company_db'
    },
    console.log(`Connected to the company_db database`)
);

var company_db = function () {
    inquirer.prompt([{
        type: 'list',
        name: 'prompt',
        message: 'What would you like to do?',
        choices: ['View all departments', 'View all roles', 'View all employees', 'Add a department', 'Add a role', 'Add an employee', 'Update an employee role']
    }]).then((answers) => {
        if (answers.prompt === 'View all departments') {
            db.query(`SELECT * from department`, (err, result) => {
                if (err) throw err;
                console.log("All departments: ");
                console.table(result);
                company_db();
            });
     } else if (answers.prompt === 'View all roles') {
            db.query(`SELECT * FROM roles`, (err, result) => {
                if (err) throw err;
                console.log("All roles: ");
                console.table(result);
                company_db();
            });
        } else if (answers.prompt === 'View all employees') {
            db.query(`SELECT * FROM employee`, (err, result) => {
                if (err) throw err;
                console.log("All employees: ");
                console.table(result);
                company_db();
            });
        } else if (answers.prompt === 'Add a department') {
            inquirer.prompt([{
                type: 'input',
                name: 'department',
                message: 'What would you like to name this department?',
                validate: departmentInput => {
                    if (departmentInput) {
                        return true;
                    } else {
                        console.log('Please name the department');
                        return false;
                    }
                }
            }]).then((answers) => {
                db.query(`INSERT INTO department (department_name) VALUES (?)`, [answers.department], (err, result) => {
                    if (err) throw err;
                    console.log(`Added ${answers.department} to your company database`)
                    company_db();
                });
            })
        } else if (answers.prompt === 'Add a role') {
            db.query(`SELECT * FROM department`, (err, result) => {
                if (err) throw err;

                inquirer.prompt([
                    {
                    type: 'input',
                    name: 'role',
                    message: 'What would you like to name this role?',
                    validate: roleInput => {
                        if (roleInput) {
                            return true;
                        } else {
                            console.log('Please name the role');
                            return false;
                        }
                    }
                },
                {
                type: 'input',
                name: 'salary',
                message: 'What is the salary for this role?',
                validate: salaryInput => {
                    if (salaryInput) {
                        return true;
                    } else {
                        console.log('Please enter a salary');
                        return false;
                    }
                }
            },
            {
                type: 'list',
                name: 'department',
                message: 'To which department does this role belong to?',
                choices: () => {
                    var array = [];
                    for (var i = 0; i < result.length; i++) {
                        array.push(result[i].name);
                    }
                    return array;
                }
            }
            ]).then((answers) => {
                for (var i = 0; i < result.length; i++) {
                    if (result[i].name === answers.department) {
                        var department = result[i];
                    }
                }

                db.query(`INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)`, [answers.role, answers.salary, department.id], (err, result) => {
                    if (err) throw err;
                    console.log(`Added ${answers.role} to the company database`)
                    company_db();
                });
            })
        });
    } else if (answers.prompt === 'Add an employee') {
        db.query(`SELECT * FROM employee, role`, (err, result) => {
            if (err) throw err;

            inquirer.prompt([
                {
                    type: 'input',
                    name: 'firstName',
                    message: 'Please enter the first name of the employee',
                    validate: firstNameInput => {
                        if (firstNameInput) {
                            return true;
                        } else {
                            console.log('Please enter a first name');
                            return false;
                        }
                        }
                    },
                    {
                    type: 'input',
                    name: 'lastName',
                    message: 'What is the last name of the employee?',
                    validate: lastNameInput => {
                        if (lastNameInput) {
                            return true;
                        } else {
                            console.log('Please enter the last name of the employee');
                            return false;
                        }
                    }
                    },
                    {
                    type: 'list',
                    name: 'role',
                    message: 'What is the role of this employee?',
                    choices: () => {
                        var array = [];
                        for (var i = 0; i < result.length; i++) {
                            array.push(result[i].title);
                        }
                        var newArray = [...new Set(array)];
                        return newArray;
                    }
                    },
                    {
                        type: 'input',
                        name: 'manager',
                        message: 'Who is the manager of this employee?',
                        validate: managerInput => {
                            if (managerInput) {
                                return true;
                            } else {
                                console.log('Please indicate a manager');
                                return false;
                            }
                        }
                    }
                ]).then((answers) => {
                    for (var i = 0; i < result.length; i++) {
                        if(result[i].title === answers.role) {
                            var role = result[i];
                        }
                    }

                    db.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`, [answers.firstName, answers.lastName, role.id, answers.manager.id], (err, result) => {
                        if (err) throw err;
                        console.log(`Added ${answers.firstName} ${answers.lastName} to the company database.`);
                        company_db();
                    });
                })
                });
            } else if (answers.prompt === 'Update an employee role') {
                db.query(`SELECT * FROM employee, role`, (err, result) => {
                    if (err) throw err;

                    inquirer.prompt([
                        {
                            type: 'list',
                            name: 'employee',
                            message: 'Which employee would you like to update the role of?',
                            choices: () => {
                                var array = [];
                                for (var i = 0; i < result.length; i++) {
                                    array.push(result[i].last_name);
                                }
                                var employeeArray = [...new Set(array)];
                                return employeeArray;
                            }
                        },
                        {
                            type: 'list',
                            name: 'role',
                            message: 'What is the new role?',
                            choices: () => {
                                var array = [];
                                for (var i = 0; i < result.length; i++) {
                                    array.push(result[i].title);
                                }
                                var newArray = [...new Set(array)];
                                return newArray;
                            }
                        }
                    ]).then((answers) => {
                        for(var i = 0; i < result.length; i++) {
                            if (result[i].last_name === answers.employee) {
                                var name = result[i];
                            }
                        }
                        for (var i = 0; i < result.length; i++) {
                            if (result[i].title === answers.role) {
                                var role = result[i];
                            }
                        }

                        db.query(`UPDATE employee SET ? WHERE ?`, [{role_id: role}, {last_name: name}], (err, result) => {
                            if (err) throw err;
                            console.log(`Upodated ${answers.employee} role to the company database`)
                            company_db();
                        });
                    })
                });
            };
        });
            
//create a department
app.post("/api/new-department", ({ body }, res) => {
    const sql = `INSERT INTO department (department_name)
    VALUES (?)`;
    const params = [body.department_name];

    db.query(sql, params, (err, result) => {
        if (err) {
            res.status(400).json({error: err.message});
            return;
        }
        res.json({
            message: 'success',
            data: body
        });
    });
});


//create roles
app.post("/api/new-roles", ({ body }, res) => {
    const sql = `INSERT INTO department (roles_name)
    VALUES (?)`;
    const params = [body.roles_name];

    db.query(sql, params, (err, result) => {
        if (err) {
            res.status(400).json({error: err.message});
            return;
        }
        res.json({
            message: 'success',
            data: body
        });
    });
});


//create an employee
app.post("/api/new-employee", ({ body }, res) => {
    const sql = `INSERT INTO department (employee_name)
    VALUES (?)`;
    const params = [body.employee_name];

    db.query(sql, params, (err, result) => {
        if (err) {
            res.status(400).json({error: err.message});
            return;
        }
        res.json({
            message: 'success',
            data: body
        });
    });
});


//read all departments
app.get('/api/department', (req, res) => {
    const sql = `SELECT id, department_name AS title FROM department`;

    db.query(sql, (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message});
            return;
        }
        res.json({
            mesage: 'success',
            data: rows
        });
    });
});


//read all roles
app.get('/api/roles', (req, res) => {
    const sql = `SELECT id, department_name AS title FROM department`;

    db.query(sql, (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message});
            return;
        }
        res.json({
            mesage: 'success',
            data: rows
        });
    });
});


//read all employees
app.get('/api/department', (req, res) => {
    const sql = `SELECT id, department_name AS title FROM department`;

    db.query(sql, (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message});
            return;
        }
        res.json({
            mesage: 'success',
            data: rows
        });
    });
});

//delete a department
app.delete('/api/department/:id', (req, res) => {
    const sql = `DELETE FROM department WHERE id = ?`;
    const params = [req.params.id];

    db.query(sql, params, (err, result) => {
        if (err) {
            res.statusMessage(400).json({ error: res.message });
        } else {
            res.json({
                message: 'deleted',
                changes: result.affectedRows,
                id: req.params.id
            });
        }
    });
});


//delete role
app.delete('/api/roles/:id', (req, res) => {
    const sql = `DELETE FROM roles WHERE id = ?`;
    const params = [req.params.id];

    db.query(sql, params, (err, result) => {
        if (err) {
            res.statusMessage(400).json({ error: res.message });
        } else {
            res.json({
                message: 'deleted',
                changes: result.affectedRows,
                id: req.params.id
            });
        }
    });
});


//delete employee
app.delete('/api/employee/:id', (req, res) => {
    const sql = `DELETE FROM employee WHERE id = ?`;
    const params = [req.params.id];

    db.query(sql, params, (err, result) => {
        if (err) {
            res.statusMessage(400).json({ error: res.message });
        } else {
            res.json({
                message: 'deleted',
                changes: result.affectedRows,
                id: req.params.id
            });
        }
    });
});
};

//default response for any other request
app.use((req, res) => {
    res.status(404).end();
});


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});