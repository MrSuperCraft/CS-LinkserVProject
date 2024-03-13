const express = require('express');
const session = require('express-session');
const app = express();
const path = require('path');
const multer = require('multer');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');

app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));
app.use(express.static('resources'));
app.use(express.static('presets'));
app.use('/scripts', express.static('scripts'));


app.use(express.json());


// SQLite database connection
const db = new sqlite3.Database('mydb.db');

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(session({
    secret: 'DQUTl2U6CMafs9CZgDB22XHTpObhYgLXk7AcwvQlV6yjd5DHZB7Izz93R4r9uRvIU1roVAOWicOw7Xslrk0fh6vKBiP9icLO40HR6W9QSWkGAmPOqMzq4Yj84eIpd40R7V', // Change this to a secure secret
    resave: false,
    saveUninitialized: true,
    cookie: {
        path: '/',
        secure: false, // Change to false if not using HTTPS
        httpOnly: true,
    }
}));



// Static routes

app.get('/', (req, res) => {
    // Pass the req object as a local variable
    res.render('index', { req });
});

app.get('/login', (req, res) => {
    // Check if the user is already authenticated
    if (req.session.username) {
        // If authenticated, redirect to the design page
        res.redirect(`/design/${encodeURIComponent(req.session.username)}`);
    } else {
        // If not authenticated, render the login page
        res.render("login");
    }
});


app.get('/logout', (req, res) => {
    // Destroy the session to log the user out
    req.session.destroy((err) => {
        if (err) {
            console.error('Error destroying session:', err);
            return res.status(500).send('Internal Server Error');
        }

        // Redirect the user to the home page or any desired page after logout
        res.redirect('/');
    });
});

app.get('/pages', (req, res) => {
    res.render("page-list");
})

app.get('/signup', (req, res) => {
    res.render("signup");
});

app.get('/credits', (req, res) => {
    res.render("credits");
});

app.get('/design', isAuthenticated, (req, res) => {
    const username = req.session.username;
    const userId = req.session.userId;


    // Render the page with the retrieved username
    res.render('dropup', { username, userId });
});


app.get('/design/:identifier', async (req, res) => {
    try {
        // Properly decode the identifier
        const decodedIdentifier = decodeURIComponent(req.params.identifier);
        console.log('Decoded Identifier:', decodedIdentifier);

        // Query the database to get the user based on the email or username
        const user = await getUserByEmailOrUsername(decodedIdentifier);
        const username = user.username;

        if (username) {
            // Retrieve social media buttons for the user
            const query = 'SELECT * FROM social_media_buttons WHERE user_id = (SELECT user_id FROM Users WHERE username = ?)';
            db.all(query, [username], (err, socialMediaButtons) => {
                if (err) {
                    return res.status(500).json({ error: err.message });
                }

                // Use the retrieved username and social media buttons for rendering the page
                res.render('dropup', { username: user.username, socialMediaButtons, userId: user.ID });
            });
        } else {
            // Handle the case when the user is not found
            console.log('User not found for identifier:', decodedIdentifier);
            res.render('dropup', { username: 'Guest' }); // You can set a default or handle it as needed
        }
    } catch (err) {
        console.error('Error fetching user:', err);
        res.status(500).render('500'); // Render an error page for server errors
    }
});


function isAuthenticated(req, res, next) {
    console.log('Session in isAuthenticated middleware:', req.session);

    // Check if the username is present in the session
    if (req.session.username) {
        console.log('User is authenticated:', req.session.username);
        return next(); // Proceed to the next middleware/route handler
    } else {
        // User is not authenticated, redirect to the 404 page
        console.log('User not authenticated. Redirecting to 404 page.');
        res.status(404).render('404'); // Assuming '404' is the name of your 404 page
    }
}

// Admin authentication middleware
function isAdminAuthenticated(req, res, next) {
    if (req.session.isAdmin) {
        // Admin is authenticated, proceed to the next middleware/route handler
        return next();
    } else {
        // Admin is not authenticated, log and redirect to the admin login page
        console.log('Admin not authenticated. Redirecting to admin login page after a delay.');
        setTimeout(() => {
            req.session.save(err => {
                if (err) {
                    console.error('Error saving session:', err);
                }
                res.redirect('/admin-login');
            });
        }, 1000); // 1 second delay
    }
}


app.post('/authenticate', async (req, res) => {
    const { identifier, password } = req.body;

    try {
        console.log('Attempting to authenticate user:', identifier);

        // Check if the user exists in the database
        const user = await getUserByEmailOrUsername(identifier);

        if (!user) {
            console.log('User not found');
            return res.status(404).json({ message: 'User not found' });
        }

        // Ensure the user object has a 'password' property
        if (!user.password) {
            console.log('User password not found');
            return res.status(500).json({ message: 'User password not found' });
        }

        // Compare the hashed password with the provided password
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (passwordMatch) {
            console.log('Login successful');

            // Save user information in the session
            req.session.username = user.username;

            // Fetch the user's ID from the database
            const userIdQuery = 'SELECT ID FROM Users WHERE Username = ?';
            db.get(userIdQuery, [user.username], (err, row) => {
                if (err) {
                    console.error('Error fetching user ID:', err);
                    return res.status(500).json({ success: false, message: 'Internal Server Error' });
                }

                // Check if the user has an ID
                if (row && row.ID) {
                    req.session.userId = row.ID;

                    req.session.save(err => {
                        if (err) {
                            console.error('Error saving session:', err);
                            return res.status(500).json({ success: false, message: 'Internal Server Error' });
                        }

                        console.log('Session saved successfully.');

                        // Redirect after the session is saved
                        const redirectRoute = user.isAdmin ? '/admin-panel' : `/design/${encodeURIComponent(user.username)}`;
                        return res.status(200).json({ success: true, message: 'Login successful', redirect: redirectRoute });
                    });
                } else {
                    console.error('User ID not found in the database.');
                    return res.status(500).json({ success: false, message: 'Internal Server Error' });
                }
            });
        } else {
            console.log('Invalid credentials');
            console.log('Entered password:', password);
            console.log('Stored hashed password:', user.password);
            res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
    } catch (err) {
        console.error('Error during authentication:', err.message);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});

// Handle user signup form submission
app.post('/signup', async (req, res) => {
    const { email, username, password } = req.body;

    try {
        // Check if the email or username is already in use for regular users
        const existingUser = await getUserByEmailOrUsername(email, username);

        if (existingUser.email !== null || existingUser.username !== null) {
            console.log('Email or username is already in use.');
            // Send a JSON response with an error message
            return res.status(400).json({ success: false, message: 'Email or username is already in use.' });
        } else {
            // Hash the password
            const hashedPassword = await bcrypt.hash(password, 10);

            // Get the current date in mm/dd/yyyy format
            const membershipDate = new Date().toLocaleDateString('en-US', {
                month: '2-digit',
                day: '2-digit',
                year: 'numeric',
            });

            // Insert data into the 'Users' table for a regular user with Membership date
            db.run('INSERT INTO Users (Email, Username, Password, Membership) VALUES (?, ?, ?, ?)', [
                email,
                username,
                hashedPassword,
                membershipDate,
            ]);

            console.log('User registered successfully');

            // Save user information in the session
            req.session.username = username;

            // Send a JSON response indicating successful signup
            return res.status(200).json({ success: true, redirect: `/design/${encodeURIComponent(username)}` });
        }
    } catch (err) {
        console.error(err.message);
        // Send a JSON response with an error message
        res.status(500).json({ success: false, message: 'Internal Server Error. Please try again later.' });
    }
});



// Add this route to handle fetching the user ID
app.get('/get-user-id', isAuthenticated, (req, res) => {
    const userId = req.session.userId; // Assuming user ID is stored in the session
    res.json({ userId });
});

// Add this route to handle fetching the username
app.post('/get-username', async (req, res) => {
    const { identifier } = req.body;

    try {
        // Query the database to get the username based on the email or username
        const user = await getUserByEmailOrUsername(identifier);

        if (user) {
            res.status(200).json({ username: user.username, userId: user.id });
        } else {
            // If user not found, you can set a default or handle it as needed
            res.status(404).json({ username: 'Guest', userId: null });
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Middleware to authenticate the user and set user information in the session
app.use(async (req, res, next) => {
    // Check if the username is present in the session
    if (req.session.username) {
        try {
            // Query the database to get the user ID based on the username
            const user = await getUserByUsername(req.session.username);

            // Check if the user is found and has an ID
            if (user && user.id) {
                // Set the user ID in the session
                req.session.userId = user.id;
            }
        } catch (err) {
            console.error('Error fetching user ID:', err);
        }
    }

    // Continue to the next middleware/route handler
    next();
});



// Middleware to check if the username exists in the database
app.use('/design', isAuthenticated);

// Your existing route handling for /design
app.get('/design', (req, res) => {
    res.render('dropup');
});


// Logout route
app.get('/logout', (req, res) => {
    // Destroy the session to log the user out
    req.session.destroy();
    res.redirect('/');
});

// Function to get user by email or username
async function getUserByEmailOrUsername(identifier) {
    return new Promise((resolve, reject) => {
        const query = 'SELECT Email, Username, Password FROM Users WHERE Email = ? OR Username = ?';
        console.log('SQL Query:', query);
        db.get(query, [identifier, identifier], (err, row) => {
            if (err) {
                reject(err);
            } else {
                console.log('Retrieved user row:', row);

                // Ensure the user object has 'email', 'username', and 'password' properties
                const user = {
                    email: row ? row.Email : null,
                    username: row ? row.Username : null,
                    password: row ? row.Password : null,
                };

                resolve(user);
            }
        });
    });
}

// Admin login page
app.post('/admin-authenticate', async (req, res) => {
    const { username, password } = req.body;

    try {
        // Check if the user exists in the database
        const user = await getUserByUsername(username);

        if (!user) {
            console.log('User not found');
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if the user is an admin
        if (user.isAdmin && user.isAdmin === 1) {
            // Ensure the user object has a 'password' property
            if (!user.password) {
                console.log('User password not found');
                return res.status(500).json({ message: 'User password not found' });
            }

            // Compare the hashed password with the provided password
            const passwordMatch = await bcrypt.compare(password, user.password);

            if (passwordMatch) {
                console.log('Admin login successful');

                // Save admin information in the session
                req.session.isAdmin = true;
                req.session.username = user.username;

                // Redirect the admin to the admin panel
                res.redirect('/admin-panel');
                return;
            } else {
                console.log('Invalid credentials');
                console.log('Entered password:', password);
                console.log('Stored hashed password:', user.password);
                res.status(401).json({ success: false, message: 'Invalid credentials' });
            }
        } else {
            console.log('Not an admin');
            return res.status(403).json({ message: 'Not an admin' });
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});


// Function to get user by username
async function getUserByUsername(username) {
    return new Promise((resolve, reject) => {
        const query = 'SELECT Email, Username, Password, isAdmin FROM Users WHERE Username = ?';

        console.log('SQL Query:', query);

        db.get(query, [username], (err, row) => {
            if (err) {
                reject(err);
            } else {
                console.log('Retrieved user row:', row);

                // Ensure the user object has 'email', 'username', 'password', and 'isAdmin' properties
                const user = {
                    email: row ? row.Email : null,
                    username: row ? row.Username : null,
                    password: row ? row.Password : null,
                    isAdmin: row ? row.isAdmin : null,
                };

                resolve(user);
            }
        });
    });
}


app.get('/admin-login', (req, res) => {
    res.render('admin-login');
});

app.get('/admin-panel', isAdminAuthenticated, (req, res) => {
    res.render('admin-panel');
});

// Assuming you have a route for the users section
app.get('/admin-panel/users', isAdminAuthenticated, async (req, res) => {
    try {
        // Fetch users data from the database
        const users = await getAllUsers();

        // Render the admin-panel template with the users data
        res.render('admin-panel', { users: users }); // Pass the "users" variable here
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/api/getUserData', isAdminAuthenticated, async (req, res) => {
    try {
        const username = req.session.username;
        // Fetch user data based on the username
        const userData = await getUserData(username);

        res.json(userData);
    } catch (err) {
        console.error('Error fetching user data:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Function to get user data from the database
async function getUserData(username) {
    return new Promise((resolve, reject) => {
        const query = 'SELECT * FROM Users WHERE Username = ?';

        db.get(query, [username], (err, row) => {
            if (err) {
                reject(err);
            } else {
                resolve(row);
            }
        });
    });
}

app.get('/api/users', async (req, res) => {
    try {
        const usersPerPage = req.query.count || 10; // Default number of users per page
        const page = req.query.page || 1; // Default page number is 1

        const offset = (page - 1) * usersPerPage;

        const users = await getUsersLimited(usersPerPage, offset);
        const totalCount = await getTotalUserCount(); // Implement this function to get the total number of users

        res.status(200).json({ users, totalCount });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Function to get limited users from the database with admin priority
async function getUsersLimited(usersPerPage, offset) {
    return new Promise((resolve, reject) => {
        const count = parseInt(usersPerPage, 10); // Ensure usersPerPage is a valid number
        if (isNaN(count) || count <= 0) {
            reject(new Error('Invalid usersPerPage value'));
            return;
        }

        const start = parseInt(offset, 10) || 0; // Default offset to 0 if not provided
        if (isNaN(start) || start < 0) {
            reject(new Error('Invalid offset value'));
            return;
        }

        db.all(`SELECT ID, Email, Username, isAdmin FROM Users ORDER BY isAdmin DESC, ID LIMIT ?, ?`, [start, count], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                const users = rows.map(row => ({
                    id: row.ID,
                    email: row.Email,
                    username: row.Username,
                    isAdmin: row.isAdmin,
                }));

                resolve(users);
            }
        });
    });
}

async function getTotalUserCount() {
    return new Promise((resolve, reject) => {
        // Execute a query to count the total number of users
        db.get('SELECT COUNT(*) AS total FROM Users', (err, row) => {
            if (err) {
                reject(err);
            } else {
                resolve(row.total);
            }
        });
    });
}

// Assuming you have a route for the contact submissions section
app.get('/api/contact-submissions', isAdminAuthenticated, async (req, res) => {
    try {
        // Fetch contact submissions data from the database
        const contactSubmissions = await getAllContactSubmissions();

        // Return a JSON response
        res.json(contactSubmissions);
    } catch (error) {
        console.error('Error fetching contact submissions:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Function to get all contact submissions from the database
async function getAllContactSubmissions() {
    return new Promise((resolve, reject) => {
        // Replace this query with your actual query to get contact submissions from the database
        db.all('SELECT * FROM contact_submissions', (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
}

// Function to get settings from the database
function getSettings() {
    return new Promise((resolve, reject) => {
        db.get('SELECT * FROM settings LIMIT 1', (err, row) => {
            if (err) {
                reject(err);
            } else {
                resolve(row);
            }
        });
    });
}

// Function to save a single setting
function saveSetting({ setting_name, setting_value }) {
    return new Promise((resolve, reject) => {
        db.run('INSERT INTO settings (setting_name, setting_value) VALUES (?, ?)', [setting_name, setting_value], (err) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
}

// Function to update a single setting
function updateSetting({ setting_name, setting_value }) {
    return new Promise((resolve, reject) => {
        db.run('UPDATE settings SET setting_value = ? WHERE setting_name = ?', [setting_value, setting_name], (err) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
}

// Route to save settings
app.post('/api/save-settings', async (req, res) => {
    // Extract settings from the request body
    const settings = req.body;

    try {
        // Ensure settings is an array
        if (!Array.isArray(settings)) {
            return res.status(400).json({ message: 'Invalid settings format' });
        }

        // Iterate through settings and save or update each one
        for (const setting of settings) {
            const existingSetting = await getSettings();

            if (existingSetting) {
                await updateSetting(setting);
            } else {
                await saveSetting(setting);
            }
        }

        // Respond with a success message
        res.status(200).json({ message: 'Settings saved successfully' });
    } catch (error) {
        console.error('Error saving settings:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Define your SQL table schema for contact submissions
const createTableQuery = `
  CREATE TABLE IF NOT EXISTS contact_submissions (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    topic TEXT NOT NULL,
    message TEXT NOT NULL
  )
`;

db.run(createTableQuery, (err) => {
    if (err) {
        console.error('Error creating table:', err);
    }
});


app.use(express.json());

app.post('/api/submit-contact', (req, res) => {
    const { name, email, topic, message } = req.body;

    const insertQuery = `
    INSERT INTO contact_submissions (name, email, topic, message)
    VALUES (?, ?, ?, ?)
  `;

    db.run(insertQuery, [name, email, topic, message], function (err) {
        if (err) {
            console.error('Error inserting contact submission:', err);
            res.status(500).send('Error submitting contact form');
        } else {
            console.log('Contact submission successful');
            res.status(200).send('Contact form submitted successfully');
        }
    });
});


app.get('/api/completed-tasks', async (req, res) => {
    try {
        // Assuming you have a 'status' column in your 'contact_submissions' table
        const completedTasks = await getTasksByStatus('Completed');
        res.json(completedTasks);
    } catch (error) {
        console.error('Error fetching completed tasks:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Function to get tasks by status from the database
async function getTasksByStatus(status) {
    return new Promise((resolve, reject) => {
        // Replace this query with your actual query to get tasks by status from the database
        db.all('SELECT * FROM contact_submissions WHERE status = ?', [status], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
}

app.get('/api/in-progress-tasks', async (req, res) => {
    try {
        // Fetch in-progress tasks from the database based on status
        const inProgressTasks = await getTasksByStatus('Pending');
        res.json(inProgressTasks);
    } catch (error) {
        console.error('Error fetching in-progress tasks:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Function to get tasks by status from the database
async function getTasksByStatus(status) {
    return new Promise((resolve, reject) => {
        // Replace this query with your actual query to get tasks by status from the database
        db.all('SELECT * FROM contact_submissions WHERE status = ?', [status], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
}

// Update the status of a submission
app.post('/api/update-task-status', async (req, res) => {
    const { taskId, newStatus } = req.body;

    try {
        // Replace this query with your actual query to update the status in the database
        await updateTaskStatus(taskId, newStatus);

        res.status(200).json({ message: 'Task status updated successfully' });
    } catch (error) {
        console.error('Error updating task status:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Function to update the status of a task in the database
async function updateTaskStatus(taskId, newStatus) {
    return new Promise((resolve, reject) => {
        // Replace this query with your actual query to update the status in the database
        db.run('UPDATE contact_submissions SET status = ? WHERE id = ?', [newStatus, taskId], (err) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
}

// Route for deleting a task then refreshing the view of the tasks
app.delete('/api/delete-task/:taskId', async (req, res) => {
    const taskId = req.params.taskId;

    try {
        // Assuming you have a table named 'contact_submissions' with an 'id' column as the primary key
        const result = await deleteTaskById(taskId);

        if (result) {
            // Task deleted successfully
            res.status(200).json({ message: 'Task deleted successfully' });
        } else {
            // Task not found or deletion failed
            res.status(404).json({ error: 'Task not found' });
        }
    } catch (error) {
        console.error('Error deleting task:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Function to delete a task by its ID
async function deleteTaskById(taskId) {
    return new Promise((resolve, reject) => {
        // Replace 'contact_submissions' with the actual name of your table
        const deleteQuery = 'DELETE FROM contact_submissions WHERE id = ?';

        db.run(deleteQuery, [taskId], function (err) {
            if (err) {
                console.error('Error deleting task from the database:', err);
                reject(err);
            } else {
                // Check if any rows were affected (task deleted)
                const rowsAffected = this.changes;
                resolve(rowsAffected > 0);
            }
        });
    });
}

// Admin actions on the user



app.delete('/api/users/:id', isAdminAuthenticated, async (req, res) => {
    const userId = req.params.id;

    try {
        // Delete the user from the database
        const query = 'DELETE FROM Users WHERE ID = ?';
        db.run(query, [userId], function (err) {
            if (err) {
                console.error(err.message);
                return res.status(500).json({ message: 'Internal Server Error' });
            }

            // Check if a user was actually deleted
            if (this.changes === 0) {
                return res.status(404).json({ message: 'User not found' });
            }

            res.json({ message: 'User deleted successfully' });
        });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});


// API endpoint to fetch user details by ID
app.get('/api/userModify/:userId', isAdminAuthenticated, (req, res) => {
    const userId = req.params.userId;

    // Replace the following with your database query to get user details
    // This is a placeholder; adjust it based on your actual database structure and queries
    const query = 'SELECT * FROM Users WHERE ID = ?';
    db.get(query, [userId], (err, row) => {
        if (err) {
            console.error('Error fetching user details:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        if (!row) {
            console.error('User not found:', userId);
            return res.status(404).json({ message: 'User not found' });
        }

        // Assuming your user details include fields like 'username', 'email', 'password', and 'userid'
        const userDetails = {
            username: row.Username,
            email: row.Email,
            password: row.Password,  // Note: Sending the password to the client is not recommended; this is just an example
            userid: row.ID,
        };

        res.json(userDetails);
    });
});


// Update user details endpoint
app.put('/api/users/:userId', async (req, res) => {
    const userId = req.params.userId;
    const { username, email, password } = req.body;

    // Construct the SET clause of the SQL query based on provided values
    let setClause = '';
    const values = [];

    if (username) {
        setClause += 'username = ?, ';
        values.push(username);
    }

    if (email && isValidEmail(email)) {
        setClause += 'email = ?, ';
        values.push(email);
    }

    if (password) {
        // Check if the password is a non-empty string
        if (typeof password === 'string' && password.trim().length > 0) {
            // Hash the new password using await
            const hashedPassword = await bcrypt.hash(password, 10);
            setClause += 'password = ?, ';
            values.push(hashedPassword);
        }
    }

    // Trim the trailing comma and space from setClause
    setClause = setClause.replace(/,\s*$/, '');

    // Update the user details in the database
    db.run(
        `UPDATE users SET ${setClause} WHERE ID = ?`,
        [...values, userId],
        async (err) => {
            if (err) {
                console.error('Error updating user details:', err.message);
                res.status(500).send({ error: 'Internal Server Error' });
            } else {
                // Retrieve the updated user details from the database
                db.get(
                    'SELECT * FROM users WHERE ID = ?',
                    [userId],
                    (err, row) => {
                        if (err) {
                            console.error('Error fetching updated user details:', err.message);
                            res.status(500).send({ error: 'Internal Server Error' });
                        } else {
                            console.log('User details updated successfully.');
                            res.json(row); // Respond with the updated user details
                        }
                    }
                );
            }
        }
    );
});


// Function to check if an email is valid
function isValidEmail(email) {
    // For simplicity, a basic regex pattern is used
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
}







// API for File Mgmt


// Multer storage setup
const storage = multer.memoryStorage(); // Store files in memory
const upload = multer({ storage: storage });

app.post('/file-upload', upload.single('file'), async (req, res) => {
    try {
        const { originalname, buffer, mimetype } = req.file;

        // Get user ID from the session or any other method you use for authentication
        const userId = req.session.userId;

        // Store file metadata in the database, associating it with the user's ID
        const result = await insertFileMetadata(originalname, buffer, mimetype, userId);

        res.json({ message: 'File uploaded successfully', fileId: result.id });
    } catch (err) {
        console.error('Error uploading file:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Function to insert file metadata into the database
function insertFileMetadata(filename, buffer, mimetype, userId) {
    return new Promise((resolve, reject) => {
        const query = 'INSERT INTO files (filename, data, mimetype, user_id) VALUES (?, ?, ?, ?)';

        db.run(query, [filename, buffer, mimetype, userId], function (err) {
            if (err) {
                reject(err);
            } else {
                resolve({ id: this.lastID });
            }
        });
    });
}

// Endpoint to handle file requests
app.get('/file/:filename', async (req, res) => {
    const filename = req.params.filename;

    try {
        // Fetch file data from the database based on the filename
        db.get('SELECT data, mimetype FROM files WHERE filename = ?', [filename], (err, row) => {
            if (err) {
                console.error('Error fetching file data:', err);
                return res.status(500).send('Internal Server Error');
            }

            if (!row) {
                console.error('File not found:', filename);
                return res.status(404).send('File not found');
            }

            // Set the appropriate content type based on the mimetype
            res.setHeader('Content-Type', row.mimetype);

            // Send the file data
            res.send(row.data);
        });
    } catch (error) {
        console.error('Unexpected error:', error);
        res.status(500).send('Internal Server Error');
    }
});















// Managing saves for social media buttons


// POST endpoint to save a social media button for a user
app.post('/api/socialMedia', (req, res) => {
    console.log('Received request:', req.body);
    const { button_id, user_id, platform, url, color1, color2, direction } = req.body;
    const insertQuery = 'INSERT INTO social_media_buttons (button_id, user_id, platform, url, color1, color2, direction) VALUES (?, ?, ?, ?, ?, ?, ?)';

    db.run(insertQuery, [button_id, user_id, platform, url, color1, color2, direction], function (err) {
        if (err) {
            console.error('Error saving to database:', err.message);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        // Send a success response if the operation is completed without errors
        res.json({ success: true });
    });
});
// GET endpoint to retrieve all social media buttons for a user
app.get('/api/socialMedia/:user_id', (req, res) => {
    const user_id = req.params.user_id;
    const query = 'SELECT * FROM social_media_buttons WHERE user_id = ?';
    db.all(query, [user_id], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});

// PUT endpoint to update a social media button
app.put('/api/socialMedia/:userId/:buttonId', (req, res) => {
    const { userId, buttonId } = req.params;
    const { platform, url, color1, color2, direction } = req.body;

    // Use a transaction to perform both DELETE and INSERT atomically
    db.run('BEGIN TRANSACTION', (beginErr) => {
        if (beginErr) {
            console.error('Error beginning transaction:', beginErr);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }

        // DELETE the old button's data
        db.run(
            'DELETE FROM social_media_buttons WHERE user_id = ? AND button_id = ?',
            [userId, buttonId],
            (deleteErr) => {
                if (deleteErr) {
                    console.error('Error deleting old button data:', deleteErr);
                    res.status(500).json({ error: 'Internal Server Error' });
                    return;
                }

                // INSERT the new button's data
                db.run(
                    'INSERT INTO social_media_buttons (user_id, button_id, platform, url, color1, color2, direction) VALUES (?, ?, ?, ?, ?, ?, ?)',
                    [userId, buttonId, platform, url, color1, color2, direction],
                    (insertErr) => {
                        if (insertErr) {
                            console.error('Error inserting new button data:', insertErr);
                            res.status(500).json({ error: 'Internal Server Error' });
                            return;
                        }

                        // Commit the transaction
                        db.run('COMMIT', (commitErr) => {
                            if (commitErr) {
                                console.error('Error committing transaction:', commitErr);
                                res.status(500).json({ error: 'Internal Server Error' });
                                return;
                            }

                            res.json({ message: 'Button updated successfully' });
                        });
                    }
                );
            }
        );
    });
});





// DELETE endpoint to delete a social media button
app.delete('/api/socialMedia/:button_id', async (req, res) => {
    const button_id = req.params.button_id;

    console.log('Attempting to delete button with ID:', button_id);

    const checkQuery = 'SELECT * FROM social_media_buttons WHERE button_id = ?';
    const deleteQuery = 'DELETE FROM social_media_buttons WHERE button_id = ?';

    try {
        // Check if the button with the given ID exists
        const existingButton = await new Promise((resolve, reject) => {
            db.get(checkQuery, [button_id], (err, row) => {
                if (err) {
                    console.error('Error checking button existence:', err.message);
                    return reject(err);
                }

                resolve(row);
            });
        });

        if (!existingButton) {
            // If the button doesn't exist, respond with a bad request status
            return res.status(400).json({ error: 'Button not found' });
        }

        // Delete the button from the database
        await new Promise((resolve, reject) => {
            db.run(deleteQuery, [button_id], function (err) {
                if (err) {
                    console.error('Error deleting from the database:', err.message);
                    return reject(err);
                }

                console.log('Button deleted from the database.');
                resolve();
            });
        });

        // If deletion is successful, respond with a success status
        res.status(200).json({ message: 'Button deleted successfully' });
    } catch (error) {
        console.error('Error during deletion:', error);
        res.status(500).json({ error: 'Failed to delete the button' });
    }
});




/*
*
*
*
* 
*
*
*
*
*/



// User info modal management

// Endpoint to save or update user information
app.post('/api/UserInfo/Change', (req, res) => {
    const { userId, pageInfo } = req.body;

    // Check if the user already has an info section
    const checkQuery = 'SELECT COUNT(*) as count FROM user_text_info WHERE user_id = ?';
    db.get(checkQuery, [userId], (err, row) => {
        if (err) {
            console.error('Error checking data:', err);
            res.status(500).json({ message: 'Internal Server Error' });
        } else {
            const count = row ? row.count : 0;

            if (count > 0) {
                // User already has an info section, update it
                const updateQuery = 'UPDATE user_text_info SET page_info = ? WHERE user_id = ?';
                db.run(updateQuery, [pageInfo, userId], (updateErr) => {
                    if (updateErr) {
                        console.error('Error updating data:', updateErr);
                        res.status(500).json({ message: 'Internal Server Error' });
                    } else {
                        res.status(200).json({ message: 'Data updated successfully!' });
                    }
                });
            } else {
                // User doesn't have an info section, insert new data
                const insertQuery = 'INSERT INTO user_text_info (user_id, page_info) VALUES (?, ?)';
                db.run(insertQuery, [userId, pageInfo], (insertErr) => {
                    if (insertErr) {
                        console.error('Error inserting data:', insertErr);
                        res.status(500).json({ message: 'Internal Server Error' });
                    } else {
                        res.status(200).json({ message: 'Data saved successfully!' });
                    }
                });
            }
        }
    });
});

// Endpoint to retrieve user information
app.get('/api/UserInfo/:userId', (req, res) => {
    const userId = req.params.userId;

    const query = 'SELECT page_info FROM user_text_info WHERE user_id = ?';
    db.get(query, [userId], (err, row) => {
        if (err) {
            console.error('Error fetching data:', err);
            res.status(500).json({ message: 'Internal Server Error' });
        } else {
            const pageInfo = row ? row.page_info : null;
            res.status(200).json({ pageInfo });
        }
    });
});




/*
*
*
*
*
*
*
*
*
*
*
*
*
*
*
*/


// Management for profile pictures


// Create 'pfp' table if not exists
db.run(`
    CREATE TABLE IF NOT EXISTS pfp (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        imageData BLOB NOT NULL,
        FOREIGN KEY (user_id) REFERENCES Users(ID)
    );
`);


// Set up the route for file upload
app.post('/api/pfp/upload', upload.single('imageData'), async (req, res) => {
    const userId = req.body.userId;
    const imageDataBuffer = req.file.buffer;

    try {
        // Check if the user already has a profile picture
        const existingUser = await getProfilePicture(userId);

        if (existingUser) {
            // User already exists, update the imageData
            db.run(
                'UPDATE pfp SET imageData = ? WHERE user_id = ?',
                [imageDataBuffer, userId],
                function (error) {
                    if (error) {
                        console.error('Error updating profile picture:', error);
                        res.status(500).json({ error: 'Internal Server Error', details: error.message });
                    } else {
                        console.log('Update successful');
                        res.json({ success: true });
                    }
                }
            );
        } else {
            // User doesn't exist, insert new profile picture
            db.run(
                'INSERT INTO pfp (user_id, imageData) VALUES (?, ?)',
                [userId, imageDataBuffer],
                function (error) {
                    if (error) {
                        console.error('Error uploading profile picture:', error);
                        res.status(500).json({ error: 'Internal Server Error', details: error.message });
                    } else {
                        console.log('Upload successful');
                        res.json({ success: true });
                    }
                }
            );
        }
    } catch (error) {
        console.error('Unexpected error during file upload:', error);
        res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
});



// In your server code
app.get('/api/pfp/:userId', async (req, res) => {
    const userId = req.params.userId;

    try {
        const result = await getProfilePicture(userId);

        if (result) {
            // Set the content type to image/jpeg (adjust based on your image type)
            res.contentType('image/jpeg');

            // Send the binary data as a response
            res.send(result.imageData);
        } else {
            res.status(404).json({ error: 'Profile picture not found' });
        }
    } catch (error) {
        console.error('Error fetching profile picture:', error);

        // Log the error details
        console.error(error);

        res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
});

// Function to get profile picture data from the database
async function getProfilePicture(userId) {
    return new Promise((resolve, reject) => {
        db.get('SELECT imageData FROM pfp WHERE user_id = ?', [userId], (err, row) => {
            if (err) {
                reject(err);
            } else {
                resolve(row);
            }
        });
    });
}




// Profile stats

app.get('/api/user/:userId', (req, res) => {
    const userId = req.params.userId;

    db.get('SELECT Email, Username, Membership FROM Users WHERE id = ?', [userId], (err, row) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }

        if (!row) {
            res.status(404).json({ error: 'User not found' });
            return;
        }

        res.json(row);
    });
});




// API Route to get user data for dynamic rendering of cards


// Define route to fetch user data
// API Route to get user data for dynamic rendering of cards


// In your server code
app.get('/api/pfp/all', async (req, res) => {
    try {
        const results = await getAllProfilePictures();

        if (results.length > 0) {
            // Set the content type to image/jpeg (adjust based on your image type)
            res.contentType('image/jpeg');

            // Send the binary data as a response
            res.send(results);
        } else {
            res.status(404).json({ error: 'Profile pictures not found' });
        }
    } catch (error) {
        console.error('Error fetching profile pictures:', error);

        // Log the error details
        console.error(error);

        res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
});

// Function to get all profile pictures data from the database
async function getAllProfilePictures() {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT Users.ID as userId, Users.Username, pfp.imageData 
            FROM Users 
            LEFT JOIN pfp ON Users.ID = pfp.user_id
        `;

        db.all(query, [], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
}

















// Now, you can handle other 404 cases or define your regular routes below this middleware
app.use((req, res) => {
    res.status(404).render('404'); // Assuming '404' is the name of your 404 page
});

// Close the database connection when the application exits
process.on('exit', () => {
    db.close();
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
    console.log('http://localhost:3000');
});


