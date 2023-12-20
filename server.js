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

app.get('/design/:emailPrefix', (req, res) => {
    const emailPrefix = req.params.emailPrefix;
    res.render('dropup', { emailPrefix });
});

app.post('/authenticate', async (req, res) => {
    const { email, password } = req.body;

    try {
        console.log('Attempting to authenticate user:', email);

        // Check if the user exists in the database
        const user = await getUserByEmail(email);

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
            res.status(200).json({ success: true, message: 'Login successful' });
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
    const { email, password } = req.body;

    try {
        // Check if the email is already in use
        const existingUser = await getUserByEmail(email);

        if (existingUser.email !== null) {
            console.log('Email is already in use');
            res.status(400).json({ message: 'Email is already in use' });
        } else {
            // Hash the password
            const hashedPassword = await bcrypt.hash(password, 10);

            // Insert data into the 'Users' table
            await db.run('INSERT INTO Users (Email, password) VALUES (?, ?)', [email, hashedPassword]);

            console.log(`User registered successfully`);

            // Redirect the user to the '/design/:emailPrefix' route
            const emailPrefix = email.split('@')[0];
            res.redirect(`/design/${emailPrefix}`);
            return;  // Ensure no further code execution after the redirect
        }
    } catch (err) {
        console.error(err.message);
        // Handle errors appropriately
        res.status(500).json({ message: 'Internal Server Error' });
    }

    // If there's an error or the email is already in use, redirect to an error or signup page
    res.redirect('/signup');  // Update the route accordingly
});

// Function to get user by email
function getUserByEmail(email) {
    return new Promise((resolve, reject) => {
        db.get('SELECT Email, Password FROM Users WHERE Email = ?', [email], (err, row) => {
            if (err) {
                reject(err);
            } else {
                console.log('Retrieved user row:', row);

                // Ensure the user object has a 'password' property
                const user = {
                    email: row ? row.Email : null,
                    password: row ? row.Password : null,
                };

                resolve(user);
            }
        });
    });
}


// Close the database connection when the application exits
process.on('exit', () => {
    db.close();
});


app.listen(3000);

