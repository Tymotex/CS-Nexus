const express = require("express"),
      passport = require("passport"),
      moment = require("moment"),
      async = require("async"),
      crypto = require("crypto"),
      nodemailer = require("nodemailer");
// Models and middleware:
const Blog = require("../models/blog"),
      Comment = require("../models/comment"),
      User = require("../models/user"),
      authMiddleware = require("../middleware");

const router = express.Router();


// ===== Home Page =====
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
    User.count().exec(function(err, userCount) {
        console.log(userCount);
        // Check if the email already exists in the database:
        User.find({email: req.body.email}, function(err, foundUser) {
            if (foundUser.length > 0) {
                console.log("User with that email already exists (" + req.body.email + ")");
                console.log(foundUser)
                req.flash("error", "A user with that email is already registered");
                res.redirect("/register");
            } else {
                var newUser = new User ({
                    email: req.body.email,
                    username: req.body.username,
                    isAdmin: userCount < 1 ? true : false 
                });
                console.log(newUser.isAdmin);
                // register() is a convenience method that comes from 'passport-local-mongoose'
                User.register(newUser, req.body.password, function(err, user) {
        
                    if (err) {
                        req.flash("error", err.message);
                        res.redirect("/register");
                    } else {
                        // Logging the user in after they sign up
                        // authenticate() comes from 'passport-local-mongoose'
                        passport.authenticate("local")(req, res, function() {
                            req.flash("success", "Welcome " + newUser.username + "! You have successfully registered");
                            res.redirect("/blogs");
                        }) 
                    }
                });
            }
        });
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
    failureRedirect: "/login",
    failureFlash: "Invalid username or password",
    successFlash: "You logged in successfully"
}));

// ===== Authentication - Logout (GET) =====
router.get("/logout", function(req, res) {
    // 'passport' exposes a logout() method attached to req
    // Calling logout() cleanses req.user
    req.logout();
    req.flash("success", "Logged out successfully");
    res.redirect("/blogs");
});

// ===== Authentication - Test (GET) =====
// TODO: Remove this. This route is for sanity-checking the authentication system
router.get("/secret", authMiddleware.isLoggedIn, function(req, res) {
    res.send("<h1>Secret</h1>");
});

// ===== Authentication - Forgot Password (POST) =====
// Show the form for setting the new password
router.get("/reset/:token", function(req, res) {
    User.findOne({
            resetPasswordToken: req.params.token,
            resetPasswordExpires: {$gt: Date.now()}
        }, 
        function(err, foundUser) {
            if (!foundUser) {
                req.flash("error", "Password reset token is invalid or it has expired.");
                return res.redirect("/reset");
            }
            res.render("auth/resetpassword", {
                token: req.params.token
            });
        }
    );
});

// Take the new password and make modifications in the database
router.post("/reset/:token", function(req, res) {
    async.waterfall([
        function(done) {
            User.findOne({
                resetPasswordToken: req.params.token,
                resetPasswordExpires: {$gt: Date.now()}
            }, 
            function(err, foundUser) {
                if (!foundUser) {
                    req.flash("error", "Password reset token is invalid or it has expired.");
                    return res.redirect("back");
                }
                if (req.body.password === req.body.confirmPassword) {
                    // Passport-local-mongoose plugin gives us the convenience method setPassword
                    foundUser.setPassword(req.body.password, function(err) {
                        foundUser.resetPasswordToken = undefined;
                        foundUser.resetPasswordExpires = undefined;
                        foundUser.save(function(err) {
                            req.logIn(foundUser, function(err) {
                                try {
                                    done(err, foundUser);
                                } catch (err) {
                                    console.log(err);
                                }
                            })
                        });
                    });
                } else {
                    req.flash("error", "Passwords do not match.");
                    res.redirect("back");
                }
            });
        },
        function(user, done) {
            var smtpTransport = nodemailer.createTransport({
                service: "Gmail",
                auth: {
                    user: "timzhang3@gmail.com",
                    // We can expose GMAILPASSWORD by typing on the command line: export GMAILPASSWORD=mypassword 
                    pass: process.env.GMAILPASSWORD
                }
            });
            var mailOptions = {
                to: user.email,
                from: "timzhang3@gmail.com",
                subject: "Your password has been changed",
                text: "This is a confirmation that your password has been successfully changed"
            }
            smtpTransport.sendMail(mailOptions, function(err) {
                console.log("Mail sent!");
                req.flash("success", "New password successfully set");
                done(err, "done");
            });
        }
    ],
    function(err) {
        // Redirect to blogs
        res.redirect("/blogs");
    });
});

// ===== Authentication - Forgot Password (GET) =====
router.get("/reset", function(req, res) {
    res.render("auth/forgotpassword");
});

// ===== Authentication - Forgot Password (POST) =====
router.post("/reset", function(req, res) {
    // async.waterfall takes in a list of functions
    async.waterfall([
        function(done) {
            crypto.randomBytes(20, function(err, buf) {
                var token = buf.toString("hex");
                console.log("Generated reset token: " + token);
                done(err, token);
            });
        },
        function(token, done) {
            User.findOne({email: req.body.email}, function(err, foundUser) {
                if (!foundUser) {
                    req.flash("error", "No user with that email exists");
                    return res.redirect("/reset");
                }
                // Set the reset password token and its expiry for the found user
                foundUser.resetPasswordToken = token;
                foundUser.resetPasswordExpires = Date.now() + 3600000;
                // Save the updated user's fields
                foundUser.save(function(err) {
                    done(err, token, foundUser);
                });
            });
        },
        function(token, user, done) {
            var smtpTransport = nodemailer.createTransport({
                service: "Gmail",
                auth: {
                    user: "timzhang3@gmail.com",
                    // We can expose GMAILPASSWORD by typing on the command line: export GMAILPASSWORD=mypassword 
                    pass: process.env.GMAILPASSWORD
                }
            });
            var mailOptions = {
                to: user.email,
                from: "timzhang3@gmail.com",
                subject: "Timz.dev Password Reset",
                text: "Please use the following link to reset your password: " + "https://timz.dev/reset/" + token
                    + '\n' + "If you did not request this password reset, please ignore this email."
            }
            smtpTransport.sendMail(mailOptions, function(err) {
                if (err) {
                    console.log("========================");
                    console.log(err)
                    console.log("========================");
                } else {
                    console.log("Mail sent!");
                    req.flash("success", "An email has been sent to " + req.body.email);
                    done(err, "done");
                }
            })
        }
    ], function (err) {
        if (err) {
            console.log(err);
        } 
        console.log("Completed the password reset emailing. Redirecting");
        res.redirect("/blogs");
    })
});


function sendMail(targetEmail, subject, content, flashMessage) {
    var smtpTransport = nodemailer.createTransport({
        service: "Gmail",
        auth: {
            user: "timzhang3@gmail.com",
            // We can expose GMAILPASSWORD by typing on the command line: export GMAILPASSWORD=mypassword 
            pass: process.env.GMAILPASSWORD
        }
    });
    var mailOptions = {
        to: targetEmail,
        from: "timzhang3@gmail.com",
        subject: subject,
        text: content
    }
    smtpTransport.sendMail(mailOptions, function(err) {
        console.log("Mail sent!");
        req.flash("success", flashMessage);
        done(err, "done");
    });
}

// ===== External Sign In/Register Options =====

router.get("/auth/register/facebook", function(req, res) {
    res.send("Trying to authenticate with Facebook");
});

router.get("/auth/register/google", passport.authenticate("google", {
    scope: ["profile"]
}));

// ===== Privacy Policy =====
router.get("/privacypolicy", function(req, res) {
    res.render("privacy-policy/privacy-policy")
})

module.exports = router;