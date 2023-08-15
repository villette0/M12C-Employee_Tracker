const mysql = require("mysql2");
const inquirer = require("inquirer");
const cTable = require("console.table");
// commit test

// Connect to database
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    database: "employees_db",
    // PW different on windows
    password: "Fghul34$",
    // needed for mac only
    // port: "/tmp/mysql.sock",
});

var departmentsArray = [];
var deptIdsArray = [];
var rolesArray = [];
var rolesIdsArray = [];
var employeesArray = [];
var employeeIdsArray = [];

const startMenu = () => {
    //Grab the data from the sql tables so we can put it in arrays to use later (as their choices and then writing it to the tables)
    getDepts();
    getRoles();
    getemployees();
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
                promptNewEmployeeRole();
            }
            if (answers.initial_selection == "Quit") {
                console.log("Thank you for using this application.");
            }
        });
};

const getDepts = () => {
    db.query("SELECT id, department_name FROM departments", function (err,res) {
        res.forEach((item) => {
            departmentsArray.push(item.department_name);
        });
        res.forEach((item) => {
            var obj = {
                id: item.id,
                departmentName: item.department_name,
            };
            deptIdsArray.push(obj);
        });
    });
}

const getRoles = () => {
    db.query("SELECT id, title FROM roles", function (err, res) {
        res.forEach((item) => {
            if (rolesArray.indexOf(item.title) === -1) {
                rolesArray.push(item.title);
            }
        });
        res.forEach((item) => {
            var obj = {
                id: item.id,
                role: item.title,
            };
            rolesIdsArray.push(obj);
        });
    });
}

const getemployees = () => {
    db.query(
        "SELECT id, first_name, last_name FROM employees",
        function (err, res) {
            res.forEach((item) => {
                var fullName = `${item.first_name} ${item.last_name}`;
                employeesArray.push(fullName);
            });
            res.forEach((item) => {
                var fullName = `${item.first_name} ${item.last_name}`
                var obj = {
                    id: item.id,
                    totalName: fullName

                    //firstName: item.first_name,
                    //lastName: item.last_name,
                };
                employeeIdsArray.push(obj);
            });
        }
    );
}

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

//To add a department, functions promptDeptName and addDepartment to ask input questions and write to table
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

//To add a role, functions promptRoleName and addRole to ask input questions and write to table
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
                choices: departmentsArray
            },
        ])
        .then((answers) => {
            var deptNum;
            deptIdsArray.forEach((item) => {
                if (answers.roleDepartment === item.departmentName) {
                    deptNum = item.id;
                }
            });

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

//To add an employee, functions promptEmployeeName and addEmployee to ask input questions and write to table
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
                choices: rolesArray
            },
            {
                type: "list",
                name: "employeeManager",
                message: "Who is the employee's manager?",
                choices: employeesArray
            },
        ])
        .then((answers) => {
            // Employee role options converted to integer
            var roleNum;
            rolesIdsArray.forEach((item) => {
                if (answers.employeeRole === item.role) {
                    roleNum = item.id;
                }
            });

            // Manager name options converted to integer
            var managerNum;
            employeeIdsArray.forEach((item) => {
                if (answers.employeeManager === item.totalName) {
                    managerNum = item.id;
                }
            });

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

//To update an employee job role, functions promptNewEmployeeRole and updateEmployeeRole to ask input questions and write to table
const promptNewEmployeeRole = () => {
    inquirer
        .prompt([
            {
                type: "list",
                name: "employeeName",
                message: "Who is the employee?",
                choices: employeesArray
            },
            {
                type: "list",
                name: "employeeRole",
                message: "What is the employee's new job role?",
                choices: rolesArray
            }
        ])
        .then((answers) => {
            // Employee role options converted to integer.
            //We have to convert the full name to an id number because the table doesn't have a full name. Just a first name and then last name cololmn.
            //We have to convert the employee role name to a number because the table uses a number not a name. 
            var employeeId;
            employeeIdsArray.forEach((item) => {
            if (answers.employeeName === item.totalName) {
                employeeId = item.id;
            }
            });

            var roleNum;
            rolesIdsArray.forEach((item) => {
            if (answers.employeeRole === item.role) {
                roleNum = item.id;
            }
            });


            updateEmployeeRole(
                employeeId,
                roleNum
            );

            console.log(
                "You've updated the job role of " +
                answers.employeeName +
                " to " +
                answers.employeeRole +
                "."
            );

        })
}

const updateEmployeeRole = (employeeId, roleNum) => {
    db.query(
        `UPDATE employees
        SET role_id = ${roleNum}
        WHERE id = "${employeeId}";
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
}

startMenu();
