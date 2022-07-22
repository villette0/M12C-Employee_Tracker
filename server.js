const mysql = require("mysql2");
const inquirer = require("inquirer");
const cTable = require("console.table");

// Connect to database
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    database: "employees_db",
    // PW different on windows
    password: "puppy9",
    // needed for mac only
    port: "/tmp/mysql.sock",
});

const startMenu = () => {
    inquirer
        .prompt([
            {
                type: "list",
                name: "initial_selection",
                message: "Choose from the following options:",
                choices: [
                    "View all departments",
                    "View all roles",
                    "View all employees",
                    "Add a department",
                    "Add a role",
                    "Add an employee",
                    "Update an employee role",
                    "Quit",
                ],
            },
        ])
        .then((answers) => {
            if (answers.initial_selection == "View all departments") {
                viewDepts();
            }
            if (answers.initial_selection == "View all roles") {
                viewRoles();
            }
            if (answers.initial_selection == "View all employees") {
                viewEmployees();
            }
            if (answers.initial_selection == "Add a department") {
                promptDeptName();
            }
            if (answers.initial_selection == "Add a role") {
                promptRoleName();
            }
            if (answers.initial_selection == "Add an employee") {
                promptEmployeeName();
            }
            if (answers.initial_selection == "Update an employee role") {
                updateEmployeeRole();
            }
            if (answers.initial_selection == "Quit") {
                updateEmployeeRole();
            } else {
                return;
            }
        });
};

const viewDepts = () => {
    db.query(
        `SELECT departments.id, departments.department_name AS department
        FROM departments
        ORDER BY departments.id;
        `,
        function (err, results) {
            console.table(results);
            startMenu();
        }
    );
};

const viewRoles = () => {
    db.query(
        `SELECT roles.id, roles.title AS job_title, departments.department_name AS department, roles.salary
    FROM roles
    LEFT JOIN departments
    ON departments.id = roles.department_id
    ORDER BY roles.id;
    `,
        function (err, results) {
            console.table(results);
            startMenu();
        }
    );
};

const viewEmployees = () => {
    db.query(
        `SELECT employees.id, employees.first_name, employees.last_name, roles.title, departments.department_name AS department, roles.salary, CONCAT(managers.first_name, ' ',managers.last_name) AS manager
    FROM departments
    LEFT JOIN roles
    ON departments.id = roles.department_id
    LEFT JOIN employees
    ON roles.id = employees.role_id
    LEFT JOIN employees AS managers
    ON managers.id = employees.manager_id 
    ORDER BY employees.id;
    `,
        function (err, results) {
            console.table(results);
            startMenu();
        }
    );
};

const promptDeptName = () => {
    inquirer
        .prompt([
            {
                type: "input",
                name: "deptName",
                message: "What is the department's name?",
            },
        ])
        .then((answers) => {
            addDepartment(answers.deptName);

            console.log("You've added a department named " + answers.deptName + ".");
        });
};

const addDepartment = (deptName) => {
    db.query(
        `INSERT INTO departments (department_name)
    VALUES ("${deptName}");
    `,
        function (err, results) { }
    );

    db.query(
        `SELECT departments.id, departments.department_name AS department
    FROM departments
    ORDER BY departments.id;
    `,
        function (err, results) {
            console.table(results);
            startMenu();
        }
    );
};

const promptRoleName = () => {
    inquirer
        .prompt([
            {
                type: "input",
                name: "roleTitle",
                message: "What is the job role's title?",
            },
            {
                type: "input",
                name: "roleSalary",
                message: "What is the job role's salary?",
            },
            {
                type: "list",
                name: "roleDepartment",
                message: "What is the job role's department?",
                choices: ["Sales", "Engineering", "Finance", "Legal"],
            },
        ])
        .then((answers) => {
            var deptNum;
            if (answers.roleDepartment === "Sales") {
                deptNum = 1;
            }
            if (answers.roleDepartment === "Engineering") {
                deptNum = 2;
            }
            if (answers.roleDepartment === "Finance") {
                deptNum = 3;
            }
            if (answers.roleDepartment === "Legal") {
                deptNum = 4;
            }
            addRole(answers.roleTitle, answers.roleSalary, deptNum);

            console.log(
                "You've added an employee role titled " +
                answers.roleTitle +
                " whose salary is " +
                answers.roleSalary +
                " and department is " +
                answers.roleDepartment +
                "."
            );
        });
};

const addRole = (roleTitle, roleSalary, roleDepartment) => {
    db.query(
        `INSERT INTO roles (title, salary, department_id)
    VALUES ("${roleTitle}", ${roleSalary}, ${roleDepartment});
    `,
        function (err, results) { }
    );

    db.query(
        `SELECT roles.id, roles.title AS job_title, departments.department_name AS department, roles.salary
    FROM roles
    LEFT JOIN departments
    ON departments.id = roles.department_id
    ORDER BY roles.id;
    `,
        function (err, results) {
            console.table(results);
            startMenu();
        }
    );
};

const promptEmployeeName = () => {
    inquirer
        .prompt([
            {
                type: "input",
                name: "employeeFirstName",
                message: "What is the employee's first name?",
            },
            {
                type: "input",
                name: "employeeLastName",
                message: "What is the employee's last name?",
            },
            {
                type: "list",
                name: "employeeRole",
                message: "What is the employee's job role?",
                choices: [
                    "Sales Lead",
                    "Salesperson",
                    "Lead Engineer",
                    "Software Engineer",
                    "Account Manager",
                    "Accountant",
                    "Lawyer",
                    "Legal Team Lead",
                ],
            },
            {
                type: "list",
                name: "employeeManager",
                message: "Who is the employee's manager?",
                choices: [
                    "John Doe",
                    "Mike Chan",
                    "Ashley Rodriguez",
                    "Kevin Tupik",
                    "Kunal Singh",
                    "Malia Brown",
                    "Sarah Lourd",
                    "Tom Allen",
                ],
            },
        ])
        .then((answers) => {
            // Employee role options converted to integer
            var roleNum;
            var managerNum;

            if (answers.employeeRole === "Sales Lead") {
                roleNum = 1;
            }
            if (answers.employeeRole === "Salesperson") {
                roleNum = 2;
            }
            if (answers.employeeRole === "Lead Engineer") {
                roleNum = 3;
            }
            if (answers.employeeRole === "Software Engineer") {
                roleNum = 4;
            }
            if (answers.employeeRole === "Account Manager") {
                roleNum = 5;
            }
            if (answers.employeeRole === "Accountant") {
                roleNum = 6;
            }
            if (answers.employeeRole === "Lawyer") {
                roleNum = 7;
            }
            if (answers.employeeRole === "Legal Team Lead") {
                roleNum = 8;
            }

            // Manager name options converted to integer
            if (answers.employeeManager === "John Doe") {
                managerNum = 1;
            }
            if (answers.employeeManager === "Mike Chan") {
                managerNum = 2;
            }
            if (answers.employeeManager === "Ashley Rodriguez") {
                managerNum = 3;
            }
            if (answers.employeeManager === "Kevin Tupik") {
                managerNum = 4;
            }
            if (answers.employeeManager === "Kunal Singh") {
                managerNum = 5;
            }
            if (answers.employeeManager === "Malia Brown") {
                managerNum = 6;
            }
            if (answers.employeeManager === "Sarah Lourd") {
                managerNum = 7;
            }
            if (answers.employeeManager === "Tom Allen") {
                managerNum = 8;
            }
            addEmployee(
                answers.employeeFirstName,
                answers.employeeLastName,
                roleNum,
                managerNum
            );

            console.log(
                "You've added an employee named " +
                answers.employeeFirstName +
                " " +
                answers.employeeLastName +
                " whose job is " +
                answers.employeeRole +
                " and manager is " +
                answers.employeeManager +
                "."
            );
        });
};

const addEmployee = (
    employeeFirstName,
    employeeLastName,
    employeeRole,
    employeeManager
) => {
    db.query(
        `INSERT INTO employees (first_name, last_name, role_id, manager_id) 
    VALUES ("${employeeFirstName}", "${employeeLastName}", ${employeeRole}, ${employeeManager});
    `,
        function (err, results) { }
    );

    db.query(
        `SELECT employees.id, employees.first_name, employees.last_name, roles.title, departments.department_name AS department, roles.salary, CONCAT(managers.first_name, ' ',managers.last_name) AS manager
    FROM departments
    LEFT JOIN roles
    ON departments.id = roles.department_id
    LEFT JOIN employees
    ON roles.id = employees.role_id
    LEFT JOIN employees AS managers
    ON managers.id = employees.manager_id 
    ORDER BY employees.id;
    `,
        function (err, results) {
            console.table(results);
            startMenu();
        }
    );
};

startMenu();
