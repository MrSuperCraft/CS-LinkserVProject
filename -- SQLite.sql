-- Create a table
CREATE TABLE IF NOT EXISTS Users (
    ID INTEGER PRIMARY KEY,
    Username TEXT,
    Email TEXT,
    Password TEXT
);

-- Update a user

-- UPDATE Users
-- SET Username = 'user'
-- WHERE Email = 'user@example.com';

-- Delete a user
-- DELETE FROM Users WHERE Email="123@gmail.com";


-- View the table data
SELECT * FROM Users;