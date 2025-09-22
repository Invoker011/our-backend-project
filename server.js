require('dotenv').config();
const jwt = require('jsonwebtoken');
const marked = require('marked');
const sanitizeHTML = require('sanitize-html');
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
    db.prepare(`
        CREATE TABLE IF NOT EXISTS posts(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        createdDate TEXT,
        title STRING NOT NULL,
        body STRING NOT NULL,
        authorId INTEGER NOT NULL,
        FOREIGN KEY(authorId) REFERENCES users(id)
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
    res.locals.filteruserHTML = function(content){
        return sanitizeHTML(marked.parse(content),{
            allowedTags:["p", "br", "ul", "ol", "li", "strong", "bold", "i", "em", "h1", "h2", "h3", "h4", "h5", "h6"],
            allowedAttributes:{}
        })
    }
    res.locals.errors = [];
    //try to decode incoming cookie.
    try{
        const decoded = jwt.verify(req.cookies.ourSimpleApp, process.env.JWTSECRET);
        res.locals.user = decoded;
    }catch(err){
        req.user = false;
    }
    res.locals.user = req.user;

    console.log(req.user);
    next();
});

app.get('/', (req, res)=>{
    if(req,user){
        const postsStatement = db.prepare("SELECT * FROM posts WHERE authorId = ? order by createdDate DESC");
        const posts = postsStatement.all(req.user.userId);
        return res.render("dashboard",{posts});
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

app.post('/login', (req, res)=>{
    let errors = [];
    const username = req.body.username.trim();
    const password = req.body.password;
    if(typeof username !== 'string') username = '';
    if(typeof password !== 'string') password = '';

    if(username == "") errors =["Invalid username or password."];
    if(password == "") errors = ["Invalid username or password."];

    if(errors.length){
        return res.render('login', {errors});
    }

    const userinQuestionStatement = db.prepare("SELECT * FROM users WHERE username = ?");
    const userinQuestion = userinQuestionStatement.get(username);

    if(!userinQuestion){
        errors = ["Invalid username or password."];
        return res.render('login', {errors});
    }

    const matchOrNot = bcrypt.compareSync(password, userinQuestion.password);
    if(!matchOrNot){
        errors = ["Invalid username or password."];
        return res.render('login', {errors});
    }

    //give them a cookie or a session.
    const ourTokenValue = jwt.sign({
        exp:Math.floor(Date.now()/1000) + 60*60*24, //1 day
        skyColor:"blue",
        userId:userinQuestion.id,
        username:userinQuestion.username
    },process.env.JWTSECRET);


    res.cookie("ourSimpleApp",ourTokenValue,{
        httpOnly:true,
        secure:true,
        sameSite:"strict",
        maxAge:1000*60*60*24 //24 hours
    });
    res.redirect('/');
    //redirect to homepage.
});

function mustbeLoggedIn(req,res,next){
    if(req.user){
        return next();
    }
    res.redirect('/');
    next();
}

app.get('/create-post', mustbeLoggedIn, (req, res)=>{
    res.render('create-post');
});

function sharedPostValidation(req){
    const errors = [];

    if(typeof req.body.title !== 'string') req.body.title = '';
    if(typeof req.body.body !== 'string') req.body.body = '';

    //trim-santize or strip out html tags.
    req.body.title = sanitizeHTML(req.body.title.trim(),{allowedTags:[], allowedAttributes:{}});
    req.body.body = sanitizeHTML(req.body.body.trim(),{allowedTags:[], allowedAttributes:{}});

    if(!req.body.title) errors.push("You must provide a title");
    if(!req.body.body) errors.push("You must provide post content");
}

app.get("/edit-post/:id",mustbeLoggedIn,(req,res)=>{
    // try to look up the post in the database.
    const statement = db.prepare('SELECT * FROM posts WHERE id = ?');
    const post = statement.get(req.params.id);

    if(!post){
        return res.redirect('/');
    }
    //if you are not he author redirect to homepage.
    if(post.authorId != req.user.userId){
        return res.redirect('/');
    } 
    //else render the edit-post screen.
    res.render("edit-post", {post});
});
app.post("/edit-post/:id",mustbeLoggedIn, (req,res)=>{
    const statement = db.prepare('SELECT * FROM posts WHERE id = ?');
    const post = statement.get(req.params.id);

    if(!post){
        return res.redirect('/');
    }
    //if you are not he author redirect to homepage.
    if(post.authorId != req.user.userId){
        return res.redirect('/');
    } 

    const errors = sharedPostValidation(req);
    if(errors.length){
        return res.render("edit-post", {errors});
    }

    const updateStatement = db.prepare("UPDATE posts SET title = ?, body = ? WHERE id = ?"); 
    updateStatement.run(req.body.title, req.body.body, req.params.id);

    res.redirect(`/post/${req.params.id}`);

});

app.post("/delete-post/:id",mustbeLoggedIn,(req,res)=>{
    const statement = db.prepare('SELECT * FROM posts WHERE id = ?');
    const post = statement.get(req.params.id);

    if(!post){
        return res.redirect('/');
    }
    //if you are not he author redirect to homepage.
    if(post.authorId != req.user.userId){
        return res.redirect('/');
    } 
    const deleteStatement = db.prepare("DELETE FROM posts WHERE id = ?");
    deleteStatement.run(req.params.id);
    res.redirect("/");
});
app.get('/post/:id', (req, res)=>{
    const statement = db.prepare('SETECT posts.*, users.username FROM posts INNER JOIN posts.authorid = users.id WHERE posts.id = ?');
    const post = statement.get(req.params.id);
    const isAuthor = post.authorId == req.user.userId;  
    if(!post){
        return res.redirect('/');
    }
    res.render('single-post', {post, isAuthor});

});

app.post('/create-post',mustbeLoggedIn, (req, res)=>{
    const errorrs = sharedPostValidation(req);

    if(errors.length){
        return res.render('create-post',{errors});
    }
    //save it to database.
    const ourStatement = db.prepare("INSERT INTO posts (title, body, authorId, createdDate) VALUES (?,?,?,?)");
    const result = ourStatement.run(req.body.title, req.body.body, req.user.userId, new Date().toISOString());

    const getPostStatement = db.prepare("SELECT * FROM posts WHERE id = ?");
    const realPost = getPostStatement.get(result.lastInsertRowid);

    res.redirect(`/post/${realPost.id}`);
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
    //validate username is unique.
    const usernameStatement = db.prepare("SELECT * FROM users WHERE username = ?");
    const existingUser = usernameStatement.get(username);

    if(existingUser) errors.push("Username is already taken");

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