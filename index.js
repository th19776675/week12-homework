const mysql = require('mysql2');
const inquirer = require("inquirer");
require('dotenv').config();

// Connect to database
const db = mysql.createConnection(
  {
    host: 'localhost',
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  }
);

function init() {
  inquirer.prompt([
    {
      type: "list",
      name: "menu",
      message: "What would you like to do?",
      choices: [
        "View All Employees",
        "Add Employee",
        "Update Employee Role",
        "View All Roles",
        "Add Role",
        "View All Departments",
        "Add Department",
        "Quit",
      ],
      default: "View All Employees"
    }
  ]).then((response) => {
    switch (response.menu) {
      case "View All Employees":
        view(employee);
      break;
      case "Add Employee":
        add(employee);
      break;
      case "Update Employee Role":
        updateEmployeeRole()
      break;
      case "View All Roles":
        view(role);
      break;
      case "Add Role":
        add(role);
      break;
      case "View All Departments":
        view(department);
      break;
      case "Add Department":
        add(department);
      break;
      case "Quit":
      process.exit();
    }
  })
}

init();