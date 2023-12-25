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
    res.render("index");
});

app.get('/login', (req, res) => {
    req.session.destroy();
    res.render("login");
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
        // User is not authenticated, redirect to the login page
        console.log('User not authenticated. Redirecting to login.');
        res.redirect('/login');
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

// Close the database connection when the application exits
process.on('exit', () => {
    db.close();
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
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
app.get('/admin-panel/contact-submissions', isAdminAuthenticated, async (req, res) => {
    try {
        // Fetch contact submissions data from the database
        const contactSubmissions = await getAllContactSubmissions();

        // Render the admin-panel template with the contact submissions data
        res.render('admin-panel', { contactSubmissions: contactSubmissions }); // Pass the "contactSubmissions" variable here
    } catch (error) {
        console.error('Error fetching contact submissions:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Function to get all contact submissions from the database
async function getAllContactSubmissions() {
    return new Promise((resolve, reject) => {
        // Replace this query with your actual query to get contact submissions from the database
        db.all('SELECT * FROM ContactSubmissions', (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
}



