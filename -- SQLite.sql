-- Create a table
CREATE TABLE IF NOT EXISTS Users (
    ID INTEGER PRIMARY KEY,
    Username TEXT,
    Email TEXT,
    Password TEXT
);

-- Update a user

-- UPDATE contact_submissions
-- SET status = 'Completed'
-- WHERE Email = "james.anderson@example.com";

-- Delete a user
-- DELETE FROM Users WHERE Email="123@gmail.com";



CREATE TABLE IF NOT EXISTS settings (
    setting_name TEXT,
    setting_value TEXT
);


-- set status: UPDATE contact_submissions SET status = 'Pending';




-- View the table data
SELECT * FROM Users;
SELECT * FROM contact_submissions;
SELECT * FROM settings;