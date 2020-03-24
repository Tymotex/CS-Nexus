const express = require("express"),
      mongoose = require("mongoose"),
      bodyParser = require("body-parser"),
      moment = require("moment"),
      methodOverride = require("method-override"),
      expressSanitizer = require("express-sanitizer"),
      passport = require("passport"),
      LocalStrategy = require("passport-local"),
      passportLocalMongoose = require("passport-local-mongoose"),
      Blog = require("./models/blog"),
      Comment = require("./models/comment"),
      User = require("./models/user"),
      seedDB = require("./seeds"),
      app = express(),
      multer = require("multer");

const commentRoutes = require("./routes/commentRoutes"),
      blogRoutes = require("./routes/blogRoutes"),
      indexRoutes = require("./routes/indexRoutes"),
      hydroponixRoutes = require("./routes/hydroponixRoutes");

// Populating the database with sample data
seedDB();

// ===== App Configuration =====
app.use(bodyParser.urlencoded({extended: true}));
mongoose.connect("mongodb://localhost:27017/Blog", {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false});
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(methodOverride("_method"));
app.use(expressSanitizer());
app.use(multer({dest: "./public/uploads/"}).single("photo"));

// Passport Configuration:
app.use(require("express-session")({
    secret: "Tim's secret sentence",   // Used to encode and decode information from a session
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));   // Comes with passportLocalMongoose
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Middleware Functions:
// Makes req.user available as the 'currentUser' variable inside ejs templates
app.use(function(req, res, next) {
    res.locals.currentUser = req.user;  
    // This middleware function calls next() in order to progress to the next function in the middleware stack
    next();  
});

// ===== Routes =====
app.use("/", indexRoutes);
app.use("/blogs", blogRoutes)
app.use("/blogs/:blogID/comments", commentRoutes);
app.use("/hydroponix", hydroponixRoutes);

// ===== Server Startup =====
app.listen(3000, function() {
    console.log("Express server listening on port 3000!");
});
