const express = require("express");
const router = express.Router();
const passport = require("passport");
const moment = require("moment");
const Blog = require("../models/blog");
const Comment = require("../models/comment");
const User = require("../models/user");

router.get("/", function(req, res) {
    console.log("Attempting to view landing page")
    res.render("home");
});

router.get("/register", function(req, res) {
    res.render("auth/register");
});

router.post("/register", function(req, res) {
    var newUser = new User ({
        username: req.body.username
    });

    User.register(newUser, req.body.password, function(err, user) {
        if (err) {
            console.log(err);
            return res.render("register");
        } else {
            // Log the user in after sign up
            passport.authenticate("local")(req, res, function() {
                res.redirect("/blogs");
            }) 
        }
    });
});

router.get("/login", function(req, res) {
    res.render("auth/login");
});

// Since the user supposedly doesn't need to sign up, directly try to authenticate their details
router.post("/login", passport.authenticate("local", {
    successRedirect: "/blogs",
    failureRedirect: "/login"
}), function(req, res) {
    
});

router.get("/logout", function(req, res) {
    req.logout();
    res.redirect("/blogs");
});

router.get("/secret", isLoggedIn, function(req, res) {
    res.render("secret");
});

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        res.redirect("/login");
    }
}

module.exports = router;