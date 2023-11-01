//importing necessities
const mysql = require('mysql2');

const inquirer = require('inquirer');
 
const consTable = require('console.table');

//connecting to db
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Netrunner!',
    database: 'company_db'
});

//prompt for user input
const userPrompt = () => {
    inquirer.prompt ([
        {
            type: 'list',
            name: 'options',
            message: 'What would you like to do?',
            choices: ['View all departments', 
            'View all roles', 
            'View all employees', 
            'Add a department', 
            'Add a role', 
            'Add an employee', 
            'Update an employee role',
            'Update an employee manager',
            "View employees by department",
            'Delete a department',
            'Delete a role',
            'Delete an employee',
            'View department budgets',
            'No Action']
        }
    ]).then((answers) => {
        const {options} = answers;

        if (options === 'View all departments') {
            showDepartments();
        }
        if (options === 'View all roles') {
            showRoles();
        }
        if (options === 'View all employees') {
            showEmployees();
        }
        if (choices === 'Add a department') {
            addDepartment();
        }
        if (choices === 'Add a role') {
            addAbortListener();
        }
        if (choices === 'Add an employee') {
            addEmployee();
        }
        if (choices === 'Delete a department') {
            deleteDepartment();
        }
        if (choices === 'Delete a role') {
            deleteRole();
        }
        if (choices === 'Delete an employee') {
            deleteEmployee();
        };
    });
};


//show all departments
showDepartments = () => {
    console.log('All departments...\n');
    const sql  = `SELECT department.id AS id, department.name AS department FROM department`;

    connection.promise().query(sql, (err, rows) => {
        if (err) throw err;
        console.table(rows);
        userPrompt();
    });
};


//show all roles
showRoles = () => {
    console.log('All roles...\n');
    const sql = `SELECT role.id, role.title, department.name AS department FROM role INNER JOIN department ON role.department_id = department.id`;

    connection.promise().query(sql, (err, rows) => {
        if (err) throw err;
        console.table(rows);
        userPrompt;
    });
};


//show all employees
showEmployees = () => {
    console.log('All employees...\n');
    const sql = `SELECT employee.id, empoyee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT (manager.first_name, " ", manager.last_name) AS manager 
    FROM employee LEFT JOIN role On employee.role_)id = role.id LEFT JOIN department ON role.department ON role.department_id = department.id LEFT JOIN employee manager ON employee.manager_id = manager.id`;

    connection.promise().query(sql, (err, rows) => {
        if (err) throw err;
        console.table(rows);
        userPrompt();
    });
};


//add a department
addDepartment = () => {
    inquirer.prompt([
        {
            type: 'input',
            name: 'addDepartment',
            message: 'What department would you like you add?',
            validate: addDepartment => {
                if (addDepartment) {
                    return true;
                } else {
                    console.log('Please enter the department');
                    return false;
                }
            }
        }
    ]).then(answer => {
        const sql = `INSERT INTO department (name)
                    VALUES (?)`;
        connection.query(sql, answer.addDepartment, (err, result) => {
            if (err) throw err;
            console.log('Added ' + answer.addDepartment + " to departments");

            showDepartments();
        });
    });
};


//adding a role
addRole = () => {
    inquirer.prompt([
        {
            type: 'input',
            name: 'addRole',
            message: "What role would you like to add?",
            validate: addRole => {
                if (addRole) {
                    return true;
                } else {
                    console.log('Please enter a role');
                    return false;
                }
            }
        },
        {
            type: 'input',
            name: 'salary',
            message: 'What is the salary for this role?',
            validate: addSalary => {
                if (isNaN(addSalary)) {
                    return true;
                } else {
                    console.log('Please enter a salary');
                    return false;
                }
            }
        }
    ]).then (answer => {
        const params = [answer.role, answer.salary];

        const roleSql = `SELECT name, id FROM department`;

        connection.promise().query(roleSql, (err, data) => {
            if (err) throw err;
            const dept = data.map (({name, id}) => ({ name: name, value: id }));

            inquirer.prompt([
                {
                    type: 'list',
                    name: 'dept',
                    message: 'What department is this role in?',
                    choices: dept
                }
            ]).then(deptChoice => {
                const dept = deptChoice.dept;
                params.push(dept);
                const sql = `INSERT INTO role (title, salart, department_id)
                            VALUES (?, ?, ?)`;
                connection.query(sql, params, (err, result) => {
                    if (err) throw err;
                    console.log('Added' + answer.role + " to roles");
                    showRoles;
                });
            });
        });
    });
};


//add an employee
addEmployee = () => {
    inquirer.prompt([
        {
            type: 'input',
            name: 'firstName',
            message: 'What is the first name of the employee?',
            validate: addFName => {
                if (addFName) {
                    return true;
                } else {
                    console.log('please add a name');
                    return false;
                }
            }
        },
        {
            type: 'input',
            name: 'lastName',
            message: 'And what is their last name?',
            validate: addLName => {
                if (addLName) {
                    return true;
                } else {
                    console.log('Please enter a last name');
                    return false;
                }
            }
        }
    ]).then(answer => {
        const params = [answer.firstName, answer.lastName]
        const roleSql = `SELECT role.id, role.title FROM role`;

        conncection.promise().query(roleSql, (err, data) => {
            if (err) throw err;

            const roles = data.map(({id, title}) => ({ name: title, value: id}));

            inquirer.prompt([
                {
                    type: 'list',
                    name: 'role',
                    message: 'What is the role of this employee?',
                    choices: roles
                }
            ]).then(roleChoice => {
                const role = rolechoice.role;
                params.push(role);

                const managerSql = `SELECT * FROM employee`;

                connection.promise().query(managerSql, (err, data) => {
                    if (err) throw err;

                    const manager = data.map(({id, first_name, last_name}) => ({ name: first_name + " " + last_name, value: id}));

                    inquirer.prompt([
                        {
                            type: 'list',
                            name: 'manager',
                            message: "Who is their manager?",
                            choices: managers
                        }
                    ]).then(managerChoice => {
                        const manager = managerChoice.manager;
                        params.push(manager);

                        const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id)
                                    VALUES (?, ?, ?, ?)`;

                        connection.query(sql, params, (err, result) => {
                            if (err) throw err;
                            console.log('Employee added to the company database')

                            showEmployees();
                        });
                    });
                });
            });
        });
    });
};


//delete department
deleteDepartment = () => {
    const deptSql = `SELECT * FROM department`;

    connection.promise().query(deptSql, (err, data) => {
        if (err) throw err;

        const dept = data.map(({name, id}) => ({name: name, value: id}));

        inquirer.prompt([
            {
                type: 'list',
                name: 'dept',
                message: 'What department would you like to delete?',
                choices: dept
            }
        ]).then(deptChoice => {
            const dept = deptChoice.dept;
            const sql = `DELETE FROM department WHERE id = ?`;

            connection.query(sql, dept, (err, result) => {
                if (err) throw err;
                console.log('Department deleted');

                showDepartments();
            });
        });
    });
};


//delete role
deleteRole = () => {
    const roleSql = `SELECT * FROM role`;

    connection.promise().query(roleSql, (err, data) => {
        if (err) throw err;

        const role = data.map(({title, id}) => ({name: title, value: id}));

        inquirer.prompt([
            {
                type: 'list',
                name: 'role',
                message: 'What role would you like to delete?',
                choices: dept
            }
        ]).then(roleChoice => {
            const role = roleChoice.role;
            const sql = `DELETE FROM role WHERE id = ?`;

            connection.query(sql, role, (err, result) => {
                if (err) throw err;
                console.log('Role deleted');

                showRoles();
            });
        });
    });
};


//delete employees
deleteEmployee = () => {
    const empSql = `SELECT * FROM employee`;

    connection.promise().query(empSql, (err, data) => {
        if (err) throw err;

        const employee = data.map(({id, first_name, last_name}) => ({name: first_name + " " + last_name, value: id}));

        inquirer.prompt([
            {
                type: 'list',
                name: 'employee',
                message: 'What employee would you like to delete?',
                choices: employee
            }
        ]).then(employeeChoice => {
            const employee = employeechoice.name;
            const sql = `DELETE FROM employee WHERE id = ?`;

            connection.query(sql, employee, (err, result) => {
                if (err) throw err;
                console.log('Employee deleted');

                showEmployees();
            });
        });
    });
};