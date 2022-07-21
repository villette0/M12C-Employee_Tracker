INSERT INTO departments (department_name)
VALUES ("Sales"),
       ("Engineering"),
       ("Finance"),
       ("Legal");

INSERT INTO roles (title, salary, department_id)
VALUES ("Sales Lead", 100000, 1),
       ("Salesperson", 80000, 1),
       ("Lead Engineer", 150000, 2),
       ("Software Engineer", 120000, 2),
       ("Account Manager", 160000, 3),
       ("Accountant", 125000, 3),
       ("Lawyer", 250000, 4),
       ("Legal Team Lead", 190000, 4);

INSERT INTO employees (first_name, last_name, role_id)
VALUES ("John", "Doe", 1),
       ("Mike", "Chan", 2),
       ("Ashley", "Rodriguez", 3),
       ("Kevin", "Tupik", 4),
       ("Kunal", "Singh", 5),
       ("Malia", "Brown", 6),
       ("Sarah", "Lourd", 7),
       ("Tom", "Allen", 8);