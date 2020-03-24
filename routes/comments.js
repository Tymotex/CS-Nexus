const express = require("express");
const router = express.Router({
    mergeParams: true
});
const passport = require("passport");
const moment = require("moment");
const Blog = require("../models/blog");
const Comment = require("../models/comment");
const User = require("../models/user");

router.get("/", function(req, res) {
    
});

router.get("/new", isLoggedIn, function(req, res) {
    Blog.findById({_id: req.params.blogID}, function(err, foundBlog) {
        if (err) {
            console.log(err);
        } else {
            res.render("comments/newcomment", {
                blog: foundBlog
            });
        }
    });  
});

router.post("/", isLoggedIn, function(req, res) {
    console.log(req.body.comment);
    Blog.findById({_id: req.params.blogID}, function(err, foundBlog) {
        if (err) {
            console.log(err);
        } else {
            Comment.create(req.body.comment, function(err, createdComment) {
                console.log("USERNAME !!!!!!!!!!!!!!!!!!!!" + req.user.username)

                createdComment.author._id = req.user._id
                createdComment.author.username = req.user.username
                createdComment.save()
                foundBlog.comments.push(createdComment);
                foundBlog.save();
                res.redirect("/blogs/" + foundBlog._id);  // The show blog route handles populating object IDs that we push into the comments array
            });
        }
    });
})

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        res.redirect("/login");
    }
}

module.exports = router;