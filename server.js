const mysql = require('mysql2');
const inquirer = require('inquirer');
const cTable = require('console.table');

// Connect to database
const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        database: 'employees_db',
        // PW different on windows
        password: 'puppy9',
        // needed for mac only
        port: '/tmp/mysql.sock',
    },
);

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
                addDepartment();
            }
            if (answers.initial_selection == "Add a role") {
                addRole();
            }
            if (answers.initial_selection == "Add an employee") {
                addEmployee();
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
        }
    );
};

const addDepartment = () => {
    db.query(
    `USE employees_db
    INSERT INTO departments (department_name)
    VALUES ("${}");
    `,
        function (err, results) {
            console.table(results);
        }
    );
};


startMenu();
