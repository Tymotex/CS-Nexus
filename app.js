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
      app = express();

const commentRoutes = require("./routes/comments"),
      blogRoutes = require("./routes/blogs"),
      indexRoutes = require("./routes/index"),
      plantRoutes = require("./routes/hydroponix");

seedDB();

app.use(bodyParser.urlencoded({extended: true}));
mongoose.connect("mongodb://localhost:27017/Blog", {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false});
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(methodOverride("_method"));
app.use(expressSanitizer());



// Passport config

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

app.use(function(req, res, next) {
    res.locals.currentUser = req.user;  // Makes req.user available as the 'currentUser' variable inside ejs templates!!! No need to pass them in
    next();  // Our middleware needs to call next() in order to progress to the next function in the middleware stack
});

app.use("/", indexRoutes);
app.use("/blogs", blogRoutes)
app.use("/blogs/:blogID/comments", commentRoutes);

// Alternative:
/*app.use("/", indexRoutes);
app.use("/blogs", blogRoutes)
app.use("/blogs/:blogID/comments", commentRoutes);
*/

app.use("/hydroponix", plantRoutes);

app.listen(3000, function() {
    console.log("Listening on port 3000");
});
