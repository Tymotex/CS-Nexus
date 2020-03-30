// Packages:
const express = require("express"),
      passport = require("passport"),
      moment = require("moment");
// Models and middleware:
const Blog = require("../models/blog"),
      Comment = require("../models/comment"),
      User = require("../models/user"),
      authMiddleware = require("../middleware")

const router = express.Router();

// RESTful Routes: |  Index |  New  |  Create  |  Show  |  Edit  |  Update  |  Destroy  | 
//                 |   GET  |  GET  |   POST   |  GET   |  GET   |   PUT    |   DELETE  |
// ===== RESTful Blog Index (GET) =====
router.get("/", function(req, res) {
    console.log("Attempting to view all blogs");
    Blog.find({}, function(err, searchResults) {
        if (err) {
            console.log(err);
        } else {
            res.render("blogs/blogsIndex", {
                blogs: searchResults,
                moment: moment
            });
        }
    });
});

// ===== RESTful Blog New (GET) =====
// 'New' shows the form for creating a new blog
router.get("/new", authMiddleware.isLoggedIn, function(req, res) {
    res.render("blogs/blogsNew");
});

// ===== RESTful Blog Create (POST) ===== 
// Create a new blog document from submitted form data (accessed in req.body)
// thanks to 'body-parser' 
router.post("/", authMiddleware.isLoggedIn, function(req, res) {
    // 'express-sanitizer' filters out malicious raw code in the newly created blog
    req.body.blog.content = req.sanitize(req.body.blog.content);
    Blog.create({
        title: req.body.blog.title,
        author: {
            id: req.user._id,
            username: req.user.username
        },
        image: req.body.blog.image,
        content: req.body.blog.content
    }, function(err, newBlogPost) {
        if (err) {
            console.log(err);
        } else {
            console.log(newBlogPost);
        }
    });
    res.redirect("/blogs");
});

// ===== RESTful Blog Show (GET) ===== 
// Display details about one specific blog, identified by blogID
router.get("/:blogID", function(req, res) {
    // The populate() method lets you reference documents in other collections
    // This replaces specified paths in the Blog document with comment documents
    Blog.findById({_id: req.params.blogID}).populate("comments").exec(function(err, foundBlog) {
        if (err || !foundBlog) {
            req.flash("error", "Blog wasn't found!")
            res.redirect("back");
        } else {
            console.log(foundBlog);
            res.render("blogs/blogsView", {
                blog: foundBlog,
                moment: moment
            });
        }
    });
});

// ===== RESTful Blog Edit (GET) =====
// Show an edit form for a specific blog document identified by blogID
router.get("/:blogID/edit", authMiddleware.isLoggedIn, authMiddleware.checkBlogOwnership, function(req, res) {
    // The existing blog must be retrieved so that the edit form shows the
    // current data
    Blog.findById(req.params.blogID, function(err, foundBlog) {
        if (err || !foundBlog) {
            req.flash("error", "Blog could not be found");
            res.redirect("/blogs");
        } else {
            res.render("blogs/blogsEdit", {
                blog: foundBlog
            });
        }
    });
});

// ===== RESTful Blog Update (PUT) =====
// Update the blog document in the database with the submitted modifications 
router.put("/:blogID", authMiddleware.isLoggedIn, authMiddleware.checkBlogOwnership, function(req, res) {
    req.body.blog.content = req.sanitize(req.body.blog.content);
    // req.body.blog is an object containing the modified fields: title, image, content
    Blog.findByIdAndUpdate(req.params.blogID, req.body.blog, function(err, updatedBlog) {
        if (err) {
            console.log(err);
        } else {
            res.redirect("/blogs/" + req.params.blogID);
        }
    });
});

// ===== RESTful Blog Destroy (DELETE) =====
// Delete a specific blog document from the database, identified by blogID
router.delete("/:blogID", authMiddleware.isLoggedIn, authMiddleware.checkBlogOwnership, function(req, res) {
    Blog.findByIdAndRemove(req.params.blogID, function(err, removedBlog) {
        if (err) {
            console.log(err);
        } else {
            // Also delete all comments attached to the blog
            Comment.deleteMany({_id: {$in: removedBlog.comments}}, function(err, deletedComments) {
                if (err) {
                    console.log(err);
                }
                console.log("===== Deleted Comments Summary =====")
                console.log(deletedComments);
                res.redirect("/blogs");
            })
        }
    });
});

module.exports = router;