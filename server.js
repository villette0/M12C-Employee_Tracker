const mysql = require('mysql2');
const inquirer = require("inquirer");


const db = mysql.createConnection(
    {
      host: 'localhost',
      user: 'root',
      password: 'Fghul34$',
      database: 'movies_db'
    },
    console.log(`Connected to the employees_db database.`)
  );

  const startMenu = () => {
    inquirer
        .prompt([
            {
                type: "list",
                name: 'employee_selection',
                message: "Choose what type of Employee you're adding from the list:",
                choices: [
                    "Manager",
                    "Engineer",
                    "Intern",
                    "Quit",
                ]
            }
        ])
        .then((answers) => {
            if (answers.employee_selection == "Manager") {
                addManagertoArray();
            }