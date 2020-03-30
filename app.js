const express = require("express"),
      mongoose = require("mongoose"),
      bodyParser = require("body-parser"),
      moment = require("moment"),
      methodOverride = require("method-override"),
      expressSanitizer = require("express-sanitizer"),
      passport = require("passport"),
      LocalStrategy = require("passport-local"),
      passportLocalMongoose = require("passport-local-mongoose"),
      flash = require("connect-flash")
      seedDB = require("./seeds"),
      multer = require("multer");

const commentRoutes = require("./routes/commentRoutes"),
      blogRoutes = require("./routes/blogRoutes"),
      indexRoutes = require("./routes/indexRoutes"),
      hydroponixRoutes = require("./routes/hydroponixRoutes");

const Blog = require("./models/blog"),
      Comment = require("./models/comment"),
      User = require("./models/user");

const app = express();

// Populating the database with sample data
seedDB();

// ===== App Configuration =====
app.use(bodyParser.urlencoded({extended: true}));
mongoose.connect("mongodb://localhost:27017/Blog", {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false});
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
    secret: "Tim's secret sentence",   
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));   // Comes with passportLocalMongoose
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

// ===== Routes =====
app.use("/", indexRoutes);
app.use("/blogs", blogRoutes);
app.use("/blogs/:blogID/comments", commentRoutes);
app.use("/hydroponix", hydroponixRoutes);

// ===== Server Startup =====
app.listen(3000, function() {
    console.log("Express server listening on port 3000!");
});
