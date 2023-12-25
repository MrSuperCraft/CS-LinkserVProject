-- Create a table
CREATE TABLE IF NOT EXISTS Users (
    ID INTEGER PRIMARY KEY,
    Username TEXT,
    Email TEXT,
    Password TEXT
);

-- Update a user

-- UPDATE Users
-- SET isAdmin = '1'
-- WHERE Email = 'admin@linkserv.com';

-- Delete a user
-- DELETE FROM Users WHERE Email="123@gmail.com";



-- View the table data
SELECT * FROM Users;

-- Create contact_submissions table
CREATE TABLE IF NOT EXISTS contact_submissions (
    ID INTEGER PRIMARY KEY AUTOINCREMENT,
    Name TEXT NOT NULL,
    Email TEXT NOT NULL,
    Message TEXT NOT NULL
);

SELECT * FROM contact_submissions;


