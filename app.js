const express = require("express"),
      mongoose = require("mongoose"),
      bodyParser = require("body-parser"),
      moment = require("moment"),
      methodOverride = require("method-override"),
      expressSanitizer = require("express-sanitizer"),
      passport = require("passport"),
      LocalStrategy = require("passport-local"),
      passportLocalMongoose = require("passport-local-mongoose"),
      GoogleStrategy = require("passport-google-oauth20"),
      flash = require("connect-flash")
      util = require("./util"),
      multer = require("multer");
require("dotenv").config();

const commentRoutes = require("./routes/commentRoutes"),
      blogRoutes = require("./routes/blogRoutes"),
      indexRoutes = require("./routes/indexRoutes"),
      hydroponixRoutes = require("./routes/hydroponixRoutes");

const Blog = require("./models/blog"),
      Comment = require("./models/comment"),
      User = require("./models/user");

const app = express();

// Populating the database with sample data
// util.seedDB();
// Wiping the documents from the database:
// util.wipeUsers();

// ===== App Configuration and Setup =====

const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://tim:1989@cs-nexus-cluster.mxask.mongodb.net/csnexus?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
// client.connect(err => {
//     const collection = client.db("test").collection("devices");
//     // perform actions on the collection object
//     client.close();   
// });

// databaseURI = process.env.DB_CONN
mongoose.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false});
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static("public"));
// Method-override lets us make PUT or DELETE requests instead of POST requests for forms. 
// Eg. The blogEdit page has this form tag: <form action="/blogs/<%= blog._id %>?_method=PUT" method="POST"></form>
app.use(methodOverride("_method"));
app.use(expressSanitizer());
app.use(multer({dest: "./public/uploads/"}).single("photo"));
app.use(flash())

// Passport Configuration:
app.use(require("express-session")({
    // The secret message is used to encode and decode information from a session
    secret: "test",   // TODO: Needs to be in .env
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));   // LocalStrategy comes with passportLocalMongoose
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// My Middleware:
app.use(function(req, res, next) {
    // Making different flash messages accessible in all templates
    res.locals.errorMessage = req.flash("error"); 
    res.locals.successMessage = req.flash("success"); 
    // Makes req.user available as the 'currentUser' variable inside all ejs templates
    // res.locals is an object that contains response local variables that are availble
    // to the rendered views
    res.locals.currentUser = req.user;  
    // Calling next() in order to progress to the next function in the middleware stack
    next();  
});

app.use("/scripts", express.static(__dirname + "/node_modules/"))


// ===== Routes =====
app.use("/", indexRoutes);
app.use("/blogs", blogRoutes);
app.use("/blogs/:blogID/comments", commentRoutes);
app.use("/hydroponix", hydroponixRoutes);

// ===== Server Startup =====
app.listen(3000, function() {
    console.log(" > Express server listening on port 3000");
});
