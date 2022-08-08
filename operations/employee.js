const inquirer = require('inquirer');
const { connect } = require("../db/connection");

async function getEmployees(){

  // use join statement to grab role and manager name
  const db = await connect();

  const [empDetails] = await db.query(`SELECT e.id, e.first_name, e.last_name, roles.title, departments.name AS department, salary, IFNULL(concat(m.first_name, ' ', m.last_name), 'N/A') AS manager
  FROM employee_cms_demo.employees e
  LEFT JOIN employee_cms_demo.employees m
  ON m.id = e.manager_id
  JOIN employee_cms_demo.roles
  ON e.role_id = roles.id
  JOIN employee_cms_demo.departments
  ON roles.department_id = departments.id`);
    
  console.log (empDetails);
return empDetails;


}

async function viewAllRoles(){
  const db = await connect();

  const [roles] = await db.query(`SELECT id AS "Role ID", title AS Role, salary AS Salary, department_id AS "Department ID" FROM employee_cms_demo.roles`);
  
  return roles;
}

async function addRole(){
  
  const departments = await getDepartments();
  const responses = await inquirer
  .prompt([
    {
      name: 'title',
      type: 'input',
      message: 'What is the new role? ',
    },
    {
      name: 'salary',
      type: 'number',
      message: "What is the role's salary? ",
    },
    {
      name: 'department',
      type: 'list',
      choices: departments.map(department => department.name),
      message: 'What department is the role in? '
    }
  ])
  
  departments.forEach(department => {
    if (department.name === responses.department) {
      responses.department = department.id;
    }
  });
  const db = await connect();

  
     await db.query('INSERT INTO employee_cms_demo.roles SET ?',
    {
      title: responses.title,
      salary: responses.salary,
      department_id: responses.department,
    },
    (err) => {
      if (err) throw err;
      console.log('New role added successfully!\n')
      start();
  });

}

async function getDepartments()  {
  const db = await connect();

  const [departments] = await db.query('SELECT * FROM departments');
  
  return departments;
}
async function getIDDetails()  {
  const db = await connect();

  const count = await db.query('SELECT COUNT(*) FROM employee_cms_demo.roles');
  
  return count;
}
module.exports = {

  getEmployees,
  viewAllRoles,
  addRole
}