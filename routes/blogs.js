const express = require("express");
const router = express.Router();
const passport = require("passport");
const moment = require("moment");
const Blog = require("../models/blog");
const Comment = require("../models/comment");
const User = require("../models/user");

// Index
router.get("/", function(req, res) {
    console.log("Attempting to view all blogs");
    Blog.find({}, function(err, searchResults) {
        if (err) {
            console.log(err);
        } else {
            res.render("blogs/blogs", {
                blogs: searchResults,
                moment: moment
            });
        }
    });
});

// Create
router.post("/", isLoggedIn, function(req, res) {
    req.body.blog.content = req.sanitize(req.body.blog.content);
    Blog.create({
        title: req.body.blog.title,
        author: req.body.blog.author,
        image: req.body.blog.image,
        content: req.body.blog.content
    }, function(err, newBlogPost) {
        if (err) {
            console.log(err);
        } else {
            console.log(newBlogPost);
        }
    });
    res.redirect("/");
});

// New
router.get("/new", isLoggedIn, function(req, res) {
    console.log("Attempting to fill in new blog");
    res.render("blogs/newblog");
});

// Show
router.get("/:blogID", function(req, res) {
    Blog.findById({_id: req.params.blogID}).populate("comments").exec(function(err, foundBlog) {
        if (err) {
            res.send("Error");
        } else {
            console.log(foundBlog);
            res.render("blogs/viewblog", {
                blog: foundBlog,
                moment: moment
            });
        }
    });
});

// Edit
router.get("/:blogID/edit", function(req, res) {
    Blog.findById({_id: req.params.blogID}, function(err, foundBlog) {
        if (err) {
            res.send("Error");
        } else {
            res.render("blogs/editblog", {
                blog: foundBlog
            });
        }
    });
});

// Update
router.put("/:blogID", function(req, res) {
    req.body.blog.content = req.sanitize(req.body.blog.content);
    Blog.findOneAndUpdate({_id: req.params.blogID}, req.body.blog, function(err, updatedBlog) {
        if (err) {
            console.log(err);
        } else {
            res.redirect("/blogs/" + req.params.blogID);
        }
    });
});

// Delete
router.delete("/:blogID", function(req, res) {
    console.log("Deleted");
    Blog.deleteOne({_id: req.params.blogID}, function(err) {
        if (err) {
            console.log(err);
        }
    });
    res.redirect("/blogs");
});

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        res.redirect("/login");
    }
}

module.exports = router;