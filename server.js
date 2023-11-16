// Importing necessities
const mysql = require("mysql2");
const inquirer = require("inquirer");
const consTable = require("console.table");

// Middleware
const PORT = process.env.PORT || 3001;

// Creating connection to database
const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "Netrunner!",
  database: "company_db",
});

connection.connect(function (err) {
  if (err) throw err;
  console.log("Connected as Id" + connection.threadId);
  initiateUserPrompt();
});

// Prompt for user input
const initiateUserPrompt = () => {
  inquirer
    .prompt([
      {
        type: "list",
        name: "choices",
        message: "What would you like to do?",
        choices: [
          "View all departments",
          "View all roles",
          "View all employees",
          "Add a department",
          "Add a role",
          "Add an employee",
          "Delete a department",
          "Delete a role",
          "Delete an employee",
        ],
      },
    ])
    .then((answers) => {
      const { choices } = answers;
      handleUserChoice(choices);
    });
};

// Handling user choices
const handleUserChoice = (userChoice) => {
  switch (userChoice) {
    case "View all departments":
      displayDepartments();
      break;
    case "View all roles":
      displayRoles();
      break;
    case "View all employees":
      displayEmployees();
      break;
    case "Add a department":
      addNewDepartment();
      break;
    case "Add a role":
      addNewRole();
      break;
    case "Add an employee":
      addNewEmployee();
      break;
    case "Delete a department":
      removeDepartment();
      break;
    case "Delete a role":
      removeRole();
      break;
    case "Delete an employee":
      removeEmployee();
      break;
    default:
      console.log("Invalid choice. Please try again.");
      initiateUserPrompt();
  }
};

// Show all departments
const displayDepartments = () => {
  console.log("All departments...\n");
  const sql = `SELECT department.id AS id, department.department_name AS department FROM department`;

  connection.query(sql, (err, rows) => {
    if (err) throw err;
    console.table(rows);
    initiateUserPrompt();
  });
};

// Show all roles
const displayRoles = () => {
  console.log("All roles...\n");
  const sql = `SELECT role.id, role.title, department.department_name AS department FROM role INNER JOIN department ON role.department_id = department.id`;

  connection.query(sql, (err, rows) => {
    if (err) throw err;
    console.table(rows);
    initiateUserPrompt();
  });
};

// Show all employees
const displayEmployees = () => {
  console.log("All employees...\n");
  const sql = `SELECT employee.id, employee.first_name, employee.last_name, role.title, department.department_name AS department, role.salary, CONCAT (manager.first_name, " ", manager.last_name) AS manager 
    FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id LEFT JOIN employee manager ON manager.id = employee.manager_id`;

  connection.query(sql, (err, rows) => {
    if (err) throw err;
    console.table(rows);
    initiateUserPrompt();
  });
};

// Add a department
const addNewDepartment = () => {
  inquirer
    .prompt([
      {
        type: "input",
        name: "addDepartment",
        message: "What department would you like to add?",
        validate: (addDepartment) => (addDepartment ? true : "Please enter the department"),
      },
    ])
    .then((answer) => {
      const sql = `INSERT INTO department (department_name) VALUES (?)`;
      connection.query(sql, answer.addDepartment, (err, result) => {
        if (err) throw err;
        console.log("Added " + answer.addDepartment + " to departments");
        displayDepartments();
      });
    });
};

// Add a role
const addNewRole = () => {
  inquirer
    .prompt([
      {
        type: "input",
        name: "addRole",
        message: "What role would you like to add?",
        validate: (addRole) => (addRole ? true : "Please enter a role"),
      },
      {
        type: "input",
        name: "salary",
        message: "What is the salary for this role?",
        validate: (addSalary) => (isNaN(addSalary) ? "Please enter a valid salary" : true),
      },
    ])
    .then((answer) => {
      const params = [answer.addRole, answer.salary];

      const roleSql = `SELECT department_name, id FROM department`;

      connection.query(roleSql, (err, data) => {
        if (err) throw err;
        const dept = data.map(({ department_name, id }) => ({ name: department_name, value: id }));

        inquirer
          .prompt([
            {
              type: "list",
              name: "dept",
              message: "What department is this role in?",
              choices: dept,
            },
          ])
          .then((deptChoice) => {
            const selectedDeptId = deptChoice.dept;
            params.push(selectedDeptId);
            const sql = `INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)`;
            connection.query(sql, params, (err, result) => {
              if (err) throw err;
              console.log("Added " + answer.addRole + " to roles");
              displayRoles();
            });
          });
      });
    });
};

// Add an employee
const addNewEmployee = () => {
  inquirer
    .prompt([
      {
        type: "input",
        name: "firstName",
        message: "What is the first name of the employee?",
        validate: (addFName) => (addFName ? true : "Please add a name"),
      },
      {
        type: "input",
        name: "lastName",
        message: "And what is their last name?",
        validate: (addLName) => (addLName ? true : "Please enter a last name"),
      },
    ])
    .then((answer) => {
      const params = [answer.firstName, answer.lastName];

      const roleSql = `SELECT role.id, role.title FROM role`;

      connection.query(roleSql, (err, data) => {
        if (err) throw err;

        const roles = data.map(({ id, title }) => ({ name: title, value: id }));

        inquirer
          .prompt([
            {
              type: "list",
              name: "role",
              message: "What is the role of this employee?",
              choices: roles,
            },
          ])
          .then((roleChoice) => {
            const selectedRoleId = roleChoice.role;
            params.push(selectedRoleId);

            const managerSql = `SELECT * FROM employee`;

            connection.query(managerSql, (err, data) => {
              if (err) throw err;

              const managers = data.map(({ id, first_name, last_name }) => ({
                name: first_name + " " + last_name,
                value: id,
              }));

              inquirer
                .prompt([
                  {
                    type: "list",
                    name: "manager",
                    message: "Who is their manager?",
                    choices: managers,
                  },
                ])
                .then((managerChoice) => {
                  const selectedManagerId = managerChoice.manager;
                  params.push(selectedManagerId);

                  const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`;

                  connection.query(sql, params, (err, result) => {
                    if (err) throw err;
                    console.log("Employee added to the company database");
                    displayEmployees();
                  });
                });
            });
          });
      });
    });
};

// Delete a department
const removeDepartment = () => {
  const deptSql = `SELECT * FROM department`;

  connection.query(deptSql, (err, data) => {
    if (err) throw err;

    const dept = data.map(({ department_name, id }) => ({ name: department_name, value: id }));

    inquirer
      .prompt([
        {
          type: "list",
          name: "dept",
          message: "What department would you like to delete?",
          choices: dept,
        },
      ])
      .then((deptChoice) => {
        const selectedDeptId = deptChoice.dept;
        const sql = `DELETE FROM department WHERE id = ?`;

        connection.query(sql, selectedDeptId, (err, result) => {
          if (err) throw err;
          console.log("Department deleted");
          displayDepartments();
        });
      });
  });
};

// Delete a role
const removeRole = () => {
  const roleSql = `SELECT * FROM role`;

  connection.query(roleSql, (err, data) => {
    if (err) throw err;

    const role = data.map(({ title, id }) => ({ name: title, value: id }));

    inquirer
      .prompt([
        {
          type: "list",
          name: "role",
          message: "What role would you like to delete?",
          choices: role,
        },
      ])
      .then((roleChoice) => {
        const selectedRoleId = roleChoice.role;
        const sql = `DELETE FROM role WHERE id = ?`;

        connection.query(sql, selectedRoleId, (err, result) => {
          if (err) throw err;
          console.log("Role deleted");
          displayRoles();
        });
      });
  });
};

// Delete an employee
const removeEmployee = () => {
  const empSql = `SELECT * FROM employee`;

  connection.query(empSql, (err, data) => {
    if (err) throw err;

    const employee = data.map(({ id, first_name, last_name }) => ({
      name: first_name + " " + last_name,
      value: id,
    }));

    inquirer
      .prompt([
        {
          type: "list",
          name: "employee",
          message: "What employee would you like to delete?",
          choices: employee,
        },
      ])
      .then((employeeChoice) => {
        const selectedEmployeeId = employeeChoice.employee;
        const sql = `DELETE FROM employee WHERE id = ?`;

        connection.query(sql, selectedEmployeeId, (err, result) => {
          if (err) throw err;
          console.log("Employee deleted");
          displayEmployees();
        });
      });
  });
};