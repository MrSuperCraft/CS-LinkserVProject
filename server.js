const express = require('express');
const app = express();
const path = require('path');

app.use(express.urlencoded({extended: false}));
app.use(express.static('public'));
app.use(express.static('resources'));
app.use(express.static('scripts'));

app.set("view engine" , "ejs");
app.set("views" , path.join(__dirname , "views"))

app.get('/' , (req, res) => {
    res.render("index")
});

app.get('/login' , (req, res) => {
    res.render("login")
});

app.get('/signup' , (req, res) => {
    res.render("signup")
});

app.get('/credits' , (req, res) => {
    res.render("credits")
});

app.get('/dropup' , (req, res) => {
    res.render("dropup")
});

app.listen(3000);