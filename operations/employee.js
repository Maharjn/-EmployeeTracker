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

async function updateRoles(){
  const db = await connect();

  const [empDetails] = await db.query('SELECT * FROM employee_cms_demo.employees');

  const employeeSelected = await inquirer
  .prompt([
    {
      name: 'emp_id',
      type: 'list',
      choices: empDetails.map(employees => ({name:employees.first_name + " " + employees.last_name, value: employees.id})),
      message: 'Whose role would you like to update? ',
    }
  ])

  const [rolesDetails] = await db.query('SELECT * FROM employee_cms_demo.roles');
  const roleSelected = await inquirer
  .prompt([
    {
      name: 'role_id',
      type: 'list',
      choices: rolesDetails.map(role => ({name:role.title, value: role.id})),
      message: 'What is their new role? ',
    }
  ])
 // const [updateQuery] = await db.query('UPDATE employee_cms_demo.employees SET role_id=(?) WHERE id = (?)',roleSelected.role_id,employeeSelected.emp_id);
 const [updateQuery] = await db.query('UPDATE employee_cms_demo.employees SET ? WHERE ?',
 [
   {
     role_id: roleSelected.role_id,
   },
   {
     id: employeeSelected.emp_id, 
   }
 ]);
 console.log (updateQuery);
}

async function addEmployee(){
  const db = await connect();

  const [rolesDetails] = await db.query('SELECT * FROM employee_cms_demo.roles');

  var [employeeDetails] = await db.query('Select * FROM employee_cms_demo.employees WHERE manager_id IS NULL');
  
  employeeDetails = employeeDetails.map(manager => ({name:manager.first_name + " " + manager.last_name, value: manager.id}));
  employeeDetails.push({name:"None"});
  const responses = await inquirer
      .prompt([
        {
          type: "input",
          message: "What is the employee's first name? ",
          name: "first_name"
        },
        {
          type: "input",
          message: "What is the employee's last name? ",
          name: "last_name"
        },
        {
          type: "list",
          message: "What is the employee's role? ",
          choices: rolesDetails.map(role => ({name:role.title, value: role.id})),
          name: "role_id"
        },
        {
          type: "list",
          message: "Who is the employee's manager? ",
          choices: employeeDetails,
          name: "manager_id"
        }
      ])
      if (responses.manager_id === "None") {
        responses.manager_id = null;
      }

      await db.query('INSERT INTO employee_cms_demo.employees SET ?',
      {
        first_name: responses.first_name,
        last_name: responses.last_name,
        role_id: responses.role_id,
        manager_id: responses.manager_id
      });

}

async function updateEmpManager(){
  const db = await connect();

  const [empDetails] = await db.query('SELECT * FROM employee_cms_demo.employees');

  const employeeSelected = await inquirer
  .prompt([
    {
      name: 'emp_id',
      type: 'list',
      choices: empDetails.map(employees => ({name:employees.first_name + " " + employees.last_name, value: employees.id})),
      message: "Which employee would you like to update?",
    }
  ])

  const [rolesDetails] = await db.query('SELECT * FROM employee_cms_demo.roles');
  const roleSelected = await inquirer
  .prompt([
    {
      name: 'mgr_id',
      type: 'list',
      choices: rolesDetails.map(role => ({name:role.title, value: role.id})),
      message: "Who is the employee's manager?",
    }
  ])
  
 // const [updateQuery] = await db.query('UPDATE employee_cms_demo.employees SET role_id=(?) WHERE id = (?)',roleSelected.role_id,employeeSelected.emp_id);
 const [updateQuery] = await db.query('UPDATE employee_cms_demo.employees SET ? WHERE ?',
 [
   {
     manager_id: employeeSelected.mgr_id,
   },
   {
     id: roleSelected.emp_id, 
   }
 ]);


 
}

async function viewAllEmp()
{
  const db = await connect();

  const [empDetails] = await db.query('SELECT * FROM employee_cms_demo.employees');

  return empDetails;
}

module.exports = {

  getEmployees,
  viewAllRoles,
  addRole,
  updateRoles,
  addEmployee
}