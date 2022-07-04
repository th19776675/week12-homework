INSERT INTO department (name) 
VALUES  ("Finance"),
        ("Engineering"),
        ("Legal"),
        ("Sales");

INSERT INTO role (title, salary, department_id) 
VALUES  ("Finance Manager", 150000, 1),
        ("Engineering Manager", 160000, 2),
        ("Legal Manager", 120000, 3),
        ("Sales Manager", 140000, 4),
        ("Finance Assistant", 80000, 1),
        ("Engineering Assistant", 90000, 2),
        ("Legal Assistant", 100000, 3),
        ("Sales Assistant", 75000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES  ("Thinh", "Ho", 1, 3),
        ("Anna", "Quech", 2, 1),
        ("Jake", "Smith", 3, 6),
        ("Jemer", "Redd", 3, 6),
        ("Matt", "Ante", 2, 6),
        ("Albert", "Zizic", 3, 2),
        ("John", "Thana", 4, 1);

        

