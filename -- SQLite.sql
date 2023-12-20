-- Create a table
CREATE TABLE IF NOT EXISTS Users (
    ID INTEGER PRIMARY KEY,
    Email TEXT,
    Password TEXT
);


-- Delete a user
-- DELETE FROM Users WHERE Email="MrSuperCraft@gmail.com";


-- View the table data
SELECT * FROM Users;