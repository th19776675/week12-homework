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

function view(tableName) {
  let sql = ""
  if (tableName === "role") {
    sql = "SELECT role.id, role.title, role.salary, department.name FROM role INNER JOIN department ON role.department_id = department.id" 
  } else if (tableName === "employee") {
    sql = "SELECT employees.id, employees.first_name, employees.last_name, role.title, role.salary, department.name AS department, employee.first_name AS manager_first_name, employee.last_name AS manager_last_name FROM employee AS employees INNER JOIN role ON employees.role_id = role.id INNER JOIN department ON role.department_id = department.id LEFT JOIN employee ON employees.manager_id = employee.id;"
  } else {
    sql = "SELECT * FROM department"
  }
  db.query(sql, (err, rows) => {
    if (err) {
      console.log("Error");
      return;
    }
    console.log("\n")
    console.table(rows)
  })
  init();
}

function add(tableName) {
  if (tableName === "employee"){
    const sql = "SELECT role.title, role.id FROM role"
    db.query(sql, (err, rows) => {
      if (err) {
        console.log("Error");
        return;
      }
      addA(tableName, rows)
    })
  } else if (tableName === "role"){
    const sql = "SELECT * FROM department"
    db.query(sql, (err,rows) => {
      if (err) {
        console.log("Error");
        return;
      }
      addA(tableName, rows)
    })
  } else {
    addA(tableName)
  }

}

function addA(tableName, arrA) {
  if (tableName === "employee"){
    const sql = "SELECT employee.first_name, employee.last_name, employee.id FROM employee"
    db.query(sql, (err, rows) => {
      if (err) {
        console.log("Error");
        return;
      }
      let empArr = []
      rows.forEach((emp) => {
        let empObj = {
          name: `${emp.first_name} ${emp.last_name}`,
          id: emp.id
        }
        empArr.push(empObj)
      })
      addB(tableName, arrA, empArr)
    })
  } else if (tableName === "role") {
     addB(tableName, arrA, [])
  } else {
    addB(tableName, [], [])
  }
}



function getEmpSQl(empObj, rolesArr, empArr) {
  const roleId = rolesArr.filter((role) => role.title === empObj.role)[0].id
  let managerId;
  if (empObj.managerChoice === false) {
    managerId = "NULL"
  } else {
    managerId = empArr.filter((emp) => emp.name === `${empObj.manager}`)[0].id
  }  
  const sql =  `INSERT INTO employee (first_name, last_name, role_id, manager_id) 
    VALUES ("${empObj.firstName}", "${empObj.lastName}", ${roleId}, ${managerId});`
  return sql;
}

function getRoleSql(roleObj, depArr) {
  const depId = depArr.filter((dep) => dep.name === roleObj.department)[0].id
  console.log(depArr)
  console.log(roleObj)
  console.log(depId)
  const sql = `INSERT INTO role (title, salary, department_id)
    VALUES ("${roleObj.title}", ${Number(roleObj.salary)}, ${depId});`
  return sql;
}

function getDepSql(depObj) {
  return `INSERT INTO department (name) VALUES ("${depObj.depName}");`
}

function addB(tableName, arrA, arrB) {
  inquirer.prompt([
    {
      type: "input",
      name: "firstName",
      message: "What is the employee's first name?",
      when: tableName === "employee"
    },
    {
      type: "input",
      name: "lastName",
      message: "What is the employee's last name?",
      when: tableName === "employee"
    },
    {
      type: "list",
      name: "role",
      message: "What is the employee's role?",
      choices: arrA.map((role) => role.title),
      when: tableName === "employee"
    },
    {
      type: "confirm",
      name: "managerChoice",
      message: "Do they have a manager?",
      when: tableName === "employee"
    },
    {
      type: "list",
      name: "manager",
      message: "Who is the employee's manager?",
      choices: arrB.map((emp) => emp.name),
      when: (answers) => answers.managerChoice === true
    },
    {
      type: "input",
      name: "title",
      message: "What is the title of this role?",
      when: tableName === "role"
    },
    {
      type: "input",
      name: "salary",
      message: "What is the salary of this role?",
      when: tableName === "role"
    },
    {
      type: "list",
      name: "department",
      message: "What department does this role belong to?",
      choices: arrA.map((dep) => dep.name),
      when: tableName === "role"
    },
    {
      type: "input",
      name: "depName",
      message: "What is the name of this department?",
      when: tableName === "department"
    }
  ]).then((response) => {
    if (tableName === "employee") {
      db.query(getEmpSQl(response, arrA, arrB), (err, rows) => {
        if (err) {
          console.log("Error");
          return;
        }
        console.log("Successfully added an employee!")
        init()
      })
    } else if (tableName === "role") {
      db.query(getRoleSql(response, arrA), (err, rows) => {
        if (err) {
          console.log("Error");
          return;
        }
        console.log("Successfully added a role!")
        init()
      }) 
    } else {
      db.query(getDepSql(response), (err,rows) => {
        if (err) {
          console.log("Error");
          return;
        }
        console.log("Successfully added a department!")
        init()
      })
    }
  })
}

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
        view("employee");
      break;
      case "Add Employee":
        add("employee");
      break;
      case "Update Employee Role":
        updateEmployeeRole()
      break;
      case "View All Roles":
        view("role");
      break;
      case "Add Role":
        add("role");
      break;
      case "View All Departments":
        view("department");
      break;
      case "Add Department":
        add("department");
      break;
      case "Quit":
      process.exit();
    }
  })
}

init();