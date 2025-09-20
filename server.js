require('dotenv').config();
const jwt = require('jsonwebtoken');
const express = require('express');
const cookieParser = require('cookie-parser');
const db = require("better-sqlite3")("ourApp.db");
db.pragma('journal_mode = WAL');
//database setup here.
const createTable = db.transaction(()=>{
    db.prepare(`
        CREATE TABLE IF NOT EXISTS users(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username NOT NULL UNIQUE,
        password NOT NULL
        )
        `).run();

})

createTable();
//database setup ends here.




const app = express();

app.set("view engine","ejs");
app.use(express.urlencoded({extended:false}));
app.use(express.static('public'));
app.use(cookieParser());
//middle ware to handle errors
app.use(function(req, res, next){

    //try to decode incoming cookie.
    try{
        const decoded = jwt.verify(req.cookies.ourSimpleApp, process.env.JWTSECRET);
        res.locals.user = decoded;
    }catch(err){
        req.user = true;
    }
    res.locals.errors = [];

    console.log(req.user);
    next();
});

app.get('/', (req, res)=>{
    if(req,user){
        return res.render("dashboard");
    }
    res.render('homepage');
});

app.get('/login', (req, res)=>{
    res.render('login')
});

app.get('/logout', (req, res)=>{
    res.clearCookie("ourSimpleApp");
    res.redirect("/");
});

app.post('/register', (req, res)=>{
    const errors = [];
    const username = req.body.username.trim();
    const password = req.body.password.trim();
    if(typeof username !== 'string') username = '';
    if(typeof password !== 'string') password = '';
    
    if(!username) errors.push("Username is required");
    if(username && username.length < 4) errors.push("Username must be at least 4 characters long");
    if(username && username.length > 10) errors.push("Username must not exceed 10 characters");
    if(username && !username.match(/^[a-zA-Z0-9]+$/)) errors.push("Username must contain only alphanumeric characters");

    if(!password) errors.push("Password is required");
    if(password && password.length < 10) errors.push("Password must be at least 10 characters long");
    if(password && password.length > 30) errors.push("Password must not exceed 30 characters");
    if(errors.length){
        return res.render('homepage', {errors});
    }

    //save user to database.
    const ourStatement = db.prepare("INSERT INTO users (username, password) VALUES (?, ?)");
    const result = ourStatement.run(username, password);
    const lookUpStatement = db.prepare("SELECT * FROM users WHERE ROWID = ?");
    const ourUser = lookUpStatement.get(result.lastInsertRowid);
    //Log the user in by giving them a cookie or a session.
    const ourTokenValue = jwt.sign({
        exp:Math.floor(Date.now()/1000) + 60*60*24, //1 day
        skyColor:"blue",
        userId:ourUser.id,
        username:ourUser.username
    },process.env.JWTSECRET);


    res.cookie("ourSimpleApp",ourTokenValue,{
        httpOnly:true,
        secure:true,
        sameSite:"strict",
        maxAge:1000*60*60*24 //24 hours
    });
    res.send("thankyou!");
});

app.listen(3000);