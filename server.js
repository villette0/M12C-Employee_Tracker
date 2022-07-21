const mysql = require('mysql2');
const inquirer = require("inquirer");
const cTable = require('console.table');


const db = mysql.createConnection(
    {
      host: 'localhost',
      user: 'root',
      password: 'puppy9',
      database: 'movies_db'
    },
    console.log(`Connected to the employees_db database.`)
  );

  const startMenu = () => {
    inquirer
        .prompt([
            {
                type: "list",
                name: 'initial_selection',
                message: "Choose from the following options:",
                choices: [
                    "View all departments",
                    "View all roles",
                    "View all employees",
                    "Add a department",
                    "Add a role",
                    "Add an employee",
                    "Update an employee role"
                ]
            }
        ])
        .then((answers) => {
            if (answers.initial_selection == "View all departments") {
                addManagertoArray();
            }