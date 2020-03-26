const express = require("express"),
      passport = require("passport"),
      moment = require("moment");
// Models and middleware:
const Blog = require("../models/blog"),
      Comment = require("../models/comment"),
      User = require("../models/user"),
      authMiddleware = require("../middleware");

const router = express.Router();

// RESTful Routes: |  Index |  New  |  Create  |  Show  |  Edit  |  Update  |  Destroy  | 
//                 |   GET  |  GET  |   POST   |  GET   |  GET   |   PUT    |   DELETE  |
// ===== RESTful Index (GET) =====
// Show the main landing page
router.get("/", function(req, res) {
    res.render("landing");
});

// ===== Authentication - Registration (GET) =====
// Render the registration form
router.get("/register", function(req, res) {
    res.render("auth/register");
});

// ===== Authentication - Registration (POST) =====
// Submit registration data to be stored in the database
router.post("/register", function(req, res) {
    var newUser = new User ({
        username: req.body.username
    });
    // register() is a convenience method that comes from 'passport-local-mongoose'
    User.register(newUser, req.body.password, function(err, user) {
        if (err) {
            console.log(err);
            return res.render("register");
        } else {
            // Logging the user in after they sign up
            // authenticate() comes from 'passport-local-mongoose'
            passport.authenticate("local")(req, res, function() {
                res.redirect("/blogs");
            }) 
        }
    });
});

// ===== Authentication - Login (GET) =====
// Render the login form
router.get("/login", function(req, res) {
    res.render("auth/login");
});

// ===== Authentication - Login (POST) =====
// Try to authenticate the submitted login credentials
router.post("/login", passport.authenticate("local", {
    successRedirect: "/blogs",
    failureRedirect: "/login"
}), function(req, res) {
    // TODO: is this callback necessary? Remove?   
});

// ===== Authentication - Logout (GET) =====
router.get("/logout", function(req, res) {
    // 'passport' exposes a logout() method attached to req
    // Calling logout() cleanses req.user
    req.logout();
    res.redirect("/blogs");
});

// ===== Authentication - Test (GET) =====
// TODO: Remove this. This route is for sanity-checking the authentication system
router.get("/secret", authMiddleware.isLoggedIn, function(req, res) {
    res.render("<h1>Secret</h1>");
});

module.exports = router;