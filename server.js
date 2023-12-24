const express = require('express');
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
// Specify the path to your database file

// Open a database connection (or create if not exists)
const db = new sqlite3.Database('mydb.db');


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));


// Static routes

app.get('/', (req, res) => {
    res.render("index")
});

app.get('/login', (req, res) => {
    res.render("login")
});

app.get('/signup', (req, res) => {
    res.render("signup")
});

app.get('/credits', (req, res) => {
    res.render("credits")
});

app.get('/design', (req, res) => {
    res.render("dropup")
});

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
            // Redirect the user to the '/design/:username' route
            res.status(200).json({ success: true, message: 'Login successful', username: user.username });
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

// Handle user signup form submission
app.post('/signup', async (req, res) => {
    const { email, username, password } = req.body;

    try {
        // Check if the email or username is already in use
        const existingUser = await getUserByEmailOrUsername(email, username);

        if (existingUser.email !== null || existingUser.username !== null) {
            console.log('Email or username is already in use');
            res.status(400).json({ message: 'Email or username is already in use' });
        } else {
            // Hash the password
            const hashedPassword = await bcrypt.hash(password, 10);

            // Insert data into the 'Users' table
            await db.run('INSERT INTO Users (Email, Username, Password) VALUES (?, ?, ?)', [email, username, hashedPassword]);

            console.log(`User registered successfully`);

            // Redirect the user to the '/design/:username' route
            res.redirect(`/design/${encodeURIComponent(username)}`);
            return;  // Ensure no further code execution after the redirect
        }
    } catch (err) {
        console.error(err.message);
        // Handle errors appropriately
        res.status(500).json({ message: 'Internal Server Error' });
    }

    // If there's an error or the email/username is already in use, redirect to an error or signup page
    res.redirect('/signup');  // Update the route accordingly
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


function getUserByEmailOrUsername(identifier) {
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

// Middleware to check if the username exists in the database
app.use('/design/:username', async (req, res, next) => {
    const username = req.params.username;

    // Check if the username exists in your SQL database
    const userExists = await checkUserExists(username);

    if (!userExists) {
        // If the user doesn't exist, redirect to the 404 page
        res.status(404).render('404'); // Update this based on your actual 404 page template
    } else {
        // If the user exists, continue to the next middleware or route handler
        next();
    }
});

// Your existing route handling for /design/:username
app.get('/design/:username', (req, res) => {
    const username = req.params.username;
    res.render('dropup', { username });
});

// Function to check if a user exists in the database
async function checkUserExists(username) {
    return new Promise((resolve, reject) => {
        db.get('SELECT * FROM Users WHERE Username = ?', [username], (err, row) => {
            if (err) {
                reject(err);
            } else {
                resolve(!!row); // Return true if row exists, false otherwise
            }
        });
    });
}




// Close the database connection when the application exits
process.on('exit', () => {
    db.close();
});


app.listen(3000);

