use employee_cms_demo; 

INSERT INTO roles (title, salary, department_id)
VALUES ("Mining Engineer", 100000, 2), ("Software Engineer", 70000, 2), 
("Sales Lead", 500000, 1), ("Salesperson", 150000, 1),
("Team Lead", 200000, 4), ("Lawyer", 100000, 4),
("Accountant", 75000, 3), ("CEO", 1000000, 5);

INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES ("Ryan", "Sean", 4, 1), ("Tom", "Richard", 6, 1),
("Lija", "John", 7, 1), ("James", "Robin", 8, 1);