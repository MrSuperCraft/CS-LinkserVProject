const express = require('express');
const session = require('express-session');
const app = express();
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');

app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));
app.use(express.static('resources'));
app.use(express.static('scripts'));
app.use(express.static('presets'));
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



app.get('/signup', (req, res) => {
    res.render("signup");
});

app.get('/credits', (req, res) => {
    res.render("credits");
});

app.use('/design', isAuthenticated);

app.get('/design', (req, res) => {
    console.log('Session in /design route:', req.session);
    res.render('dropup', { username: req.session.username });
});

// Your existing route handling for /design
app.get('/design/:username', (req, res) => {
    const { username } = req.params;
    res.render('dropup', { username });
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

            // Check if the user is an admin and set the isAdmin property in the session
            if (user.isAdmin === 1) {
                req.session.isAdmin = true;
            }

            req.session.save(err => {
                if (err) {
                    console.error('Error saving session:', err);
                    return res.status(500).json({ success: false, message: 'Internal Server Error' });
                }

                console.log('Session saved successfully.');

                // Redirect after the session is saved
                return res.status(200).json({ success: true, message: 'Login successful', username: user.username });
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
            console.log('Email or username is already in use');
            return res.status(400).json({ message: 'Email or username is already in use' });
        } else {
            // Hash the password
            const hashedPassword = await bcrypt.hash(password, 10);

            // Insert data into the 'Users' table for regular user
            await db.run('INSERT INTO Users (Email, Username, Password) VALUES (?, ?, ?)', [email, username, hashedPassword]);

            console.log(`User registered successfully`);

            // Save user information in the session
            req.session.username = username;

            // Redirect the user to the design page
            return res.redirect(`/design/${encodeURIComponent(username)}`);
        }
    } catch (err) {
        console.error(err.message);
        // Handle errors appropriately
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Add this route to handle fetching the username
app.post('/get-username', async (req, res) => {
    const { identifier } = req.body;

    try {
        // Query the database to get the username based on the email or username
        const user = await getUserByEmailOrUsername(identifier);

        if (user) {
            res.status(200).json({ username: user.username });
        } else {
            // If user not found, you can set a default or handle it as needed
            res.status(404).json({ username: 'Guest' });
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Middleware to check if the username exists in the database
app.use('/design', isAuthenticated);

// Your existing route handling for /design
app.get('/design', (req, res) => {
    res.render('dropup', { username: req.session.username });
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
        db.get('SELECT Email, Username, Password FROM Users WHERE Email = ? OR Username = ?', [identifier, identifier], (err, row) => {
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

async function getUserByUsername(username) {
    return new Promise((resolve, reject) => {
        db.get('SELECT Email, Username, Password, isAdmin FROM Users WHERE Username = ?', [username], (err, row) => {
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
        if (user.isAdmin !== 1) {
            console.log('Not an admin');
            return res.status(403).json({ message: 'Not an admin' });
        }

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
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});

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

app.get('/api/users', async (req, res) => {
    try {
        // Query the database to get all users
        const users = await getAllUsers();

        res.status(200).json(users);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Function to get all users from the database
async function getAllUsers() {
    return new Promise((resolve, reject) => {
        db.all('SELECT ID, Email, Username FROM Users', (err, rows) => {
            if (err) {
                reject(err);
            } else {
                const users = rows.map(row => ({
                    id: row.ID,
                    email: row.Email,
                    username: row.Username,
                }));

                resolve(users);
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

// Add the 404 route at the end of your routes
app.use((req, res) => {
    res.status(404).render('404'); // Assuming '404' is the name of your 404 page
});

// Close the database connection when the application exits
process.on('exit', () => {
    db.close();
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});


