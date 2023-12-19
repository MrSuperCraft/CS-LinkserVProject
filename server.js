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
const dbPath = path.resolve(__dirname, 'sql', 'mydb.db');
const db = new sqlite3.Database(dbPath);

// Create table if not exists
const createTableSql = `
 CREATE TABLE IF NOT EXISTS Users (
    ID INTEGER PRIMARY KEY,
    Email TEXT COLLATE NOCASE,
    Password TEXT
 );
`;

db.run(createTableSql, (err) => {
    if (err) {
        console.error('Error creating table:', err.message);
    } else {
        console.log('Table created successfully');
    }
});

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

// Dummy user data (replace this with your actual user database)
const users = [
    { email: 'user@example.com', password: 'Password1234!' },
    // Add more user data as needed
];


function authenticateUser(user, password) {
    // Replace this with your authentication logic
    return user && user.password === password;
}

app.post('/authenticate', (req, res) => {
    const { email, password } = req.body;

    // Check if the user exists
    const user = users.find(u => u.email === email);

    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    // Authenticate user (add your authentication logic here)
    // For simplicity, let's assume you have a function authenticateUser(user, password)
    if (authenticateUser(user, password)) {
        res.status(200).json({ message: 'Login successful' });
    } else {
        res.status(401).json({ message: 'Invalid credentials' });
    }
});

// Handle user signup form submission
app.post('/signup', (req, res) => {
    const { email, password } = req.body;


        // Check if the email is already in use
        const existingUser = db.get('SELECT * FROM Users WHERE Email = ?', [email]);

        if (existingUser) {
            res.status(400).json({ message: 'Email is already in use' });
        } else {
            // Hash the password before storing it in the database
            const hashedPassword = bcrypt.hash(password, 10);

            // Insert user data into the Users table
            db.run('INSERT INTO Users (Email, Password) VALUES (?, ?)', [email, hashedPassword]);

            res.status(200).json({ message: 'Signup successful' });
            
            const emailPrefix = req.params.emailPrefix;
            res.render('dropup', { emailPrefix });
        }
    }
);

app.listen(3000);
