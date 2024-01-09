-- Create a table
CREATE TABLE IF NOT EXISTS Users (
    ID INTEGER PRIMARY KEY,
    Username TEXT,
    Email TEXT,
    Password TEXT,
    isAdmin BOOLEAN
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


CREATE TABLE IF NOT EXISTS contact_submissions (
    user_name TEXT,
    Email TEXT,
    Topic TEXT,
    Title TEXT,
    Message TEXT,
);


-- set status: UPDATE contact_submissions SET status = 'Pending';

-- INSERT INTO Users (Email, Password, Username, isAdmin)
-- VALUES
-- ('123@gmail.com', '$2a$10$0NtO.PpvJXqJ0gbKl/zIDOCSj37u2YnMZ97CzBQltA5Uox6PLcGK.', 'MrSuperCraft', 1),
-- ('admin@linkserv.com' , '$2a$10$0NtO.PpvJXqJ0gbKl/zIDOCSj37u2YnMZ97CzBQltA5Uox6PLcGK.', 'Admin', 1);
--   ('user3@example.com', '$2b$10$YourHashedPassword3', 'user3', 0),
--   ('user4@example.com', '$2b$10$YourHashedPassword4', 'user4', 0),
--   ('user5@example.com', '$2b$10$YourHashedPassword5', 'user5', 0),
--   ('user6@example.com', '$2b$10$YourHashedPassword6', 'user6', 0),
--   ('user7@example.com', '$2b$10$YourHashedPassword7', 'user7', 0),
--   ('user8@example.com', '$2b$10$YourHashedPassword8', 'user8', 0),
--   ('user9@example.com', '$2b$10$YourHashedPassword9', 'user9', 0),
--   ('user10@example.com', '$2b$10$YourHashedPassword10', 'user10', 0),
--   ('user11@example.com', '$2b$10$YourHashedPassword11', 'user11', 0),
--   ('user12@example.com', '$2b$10$YourHashedPassword12', 'user12', 0),
--   ('user13@example.com', '$2b$10$YourHashedPassword13', 'user13', 0),
--   ('user14@example.com', '$2b$10$YourHashedPassword14', 'user14', 0),
--   ('user15@example.com', '$2b$10$YourHashedPassword15', 'user15', 0),
--   ('user16@example.com', '$2b$10$YourHashedPassword16', 'user16', 0),
--   ('user17@example.com', '$2b$10$YourHashedPassword17', 'user17', 0),
--   ('user18@example.com', '$2b$10$YourHashedPassword18', 'user18', 0),
--   ('user19@example.com', '$2b$10$YourHashedPassword19', 'user19', 0),
--   ('user20@example.com', '$2b$10$YourHashedPassword20', 'user20', 0),
--   ('user21@example.com', '$2b$10$YourHashedPassword21', 'user21', 0),
--   ('user22@example.com', '$2b$10$YourHashedPassword22', 'user22', 0),
--   ('user23@example.com', '$2b$10$YourHashedPassword23', 'user23', 0),
--   ('user24@example.com', '$2b$10$YourHashedPassword24', 'user24', 0),
--   ('user25@example.com', '$2b$10$YourHashedPassword25', 'user25', 0),
--   ('user26@example.com', '$2b$10$YourHashedPassword26', 'user26', 0),
--   ('user27@example.com', '$2b$10$YourHashedPassword27', 'user27', 0),
--   ('user28@example.com', '$2b$10$YourHashedPassword28', 'user28', 0),
--   ('user29@example.com', '$2b$10$YourHashedPassword29', 'user29', 0),
--   ('user30@example.com', '$2b$10$YourHashedPassword30', 'user30', 0);






-- View the table data
SELECT * FROM Users;
SELECT * FROM contact_submissions;
SELECT * FROM settings;
SELECT * FROM files;