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
                promptDeptName();
            }
            if (answers.initial_selection == "Add a role") {
                promptRoleName();
            }
            if (answers.initial_selection == "Add an employee") {
                promptEmployeeName();
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

const promptDeptName = () => {
    inquirer
    .prompt([
        {
            type: "input",
            name: "deptname",
            message: "What is the department's name?",
        },
    ])
    .then((answers) => {
        addDepartment(answers.deptname);
    })
}

const addDepartment = (deptname) => {
    db.query(
    `USE employees_db
    INSERT INTO departments (department_name)
    VALUES ("${deptname}");
    `,
        function (err, results) {
            console.table(results);
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
            type: "input",
            name: "roleDepartment",
            message: "What is the job role's department?",
        }
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
    })
}

const addRole = (roleTitle, roleSalary, roleDepartment) => {
    db.query(
    `USE employees_db
    INSERT INTO roles (title)
    VALUES ("${roleTitle}");
    INSERT INTO roles (salary)
    VALUES ("${roleSalary}");
    INSERT INTO roles (department_id)
    VALUES ("${roleDepartment}");
    `,
        function (err, results) {
            console.table(results);
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
            type: "input",
            name: "employeeRole",
            message: "What is the employee's job role?",
        },
        {
            type: "input",
            name: "employeeManager",
            message: "Who is the employee's manager?",
        }
    ])
    .then((answers) => {
        addEmployee(answers.employeeFirstName, answers.employeeLastName, answers.employeeRole, answers.employeeManager);
    })
}

const addEmployee = (employeeFirstName, employeeLastName, employeeRole, employeeManager) => {
    db.query(
    `USE employees_db
    INSERT INTO employees (first_name)
    VALUES ("${employeeFirstName}");
    INSERT INTO employees (last_name)
    VALUES ("${employeeLastName}");
    INSERT INTO employees (role_id)
    VALUES ("${employeeRole}");
    INSERT INTO employees (manager_id)
    VALUES ("${employeeManager}");
    
    `,
        function (err, results) {
            console.table(results);
        }
    );
};

startMenu();
