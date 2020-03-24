const express = require("express"),
      passport = require("passport"),
      moment = require("moment"),
      Blog = require("../models/blog"),
      Comment = require("../models/comment"),
      User = require("../models/user");

const router = express.Router({
    mergeParams: true
});

// ===== Middleware Helper Functions =====
// Note that route handlers app.get, app.post, etc. can be given multiple callback functions
// that behave like middleware to handle a request

// Checks if a user is authenticated
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        res.redirect("/login");
    }
}

// RESTful Routes: |  Index |  New  |  Create  |  Show  |  Edit  |  Update  |  Destroy  | 
//                 |   GET  |  GET  |   POST   |  GET   |  GET   |   PUT    |   DELETE  |
// ===== RESTful Comment New (GET) =====
router.get("/new", isLoggedIn, function(req, res) {
    Blog.findById({_id: req.params.blogID}, function(err, foundBlog) {
        if (err) {
            console.log(err);
        } else {
            res.render("comments/commentsNew", {
                blog: foundBlog
            });
        }
    });  
});

// ===== RESTful Comment Create (POST) =====
router.post("/", isLoggedIn, function(req, res) {
    Blog.findById({_id: req.params.blogID}, function(err, foundBlog) {
        if (err) {
            console.log(err);
        } else {
            Comment.create(req.body.comment, function(err, createdComment) {
                // Set the author of this new comment as the username of the currently active user
                createdComment.author._id = req.user._id
                createdComment.author.username = req.user.username
                createdComment.save()
                // Attach the comment to the blog document
                foundBlog.comments.push(createdComment);
                foundBlog.save();
                // The show blog route handles populating object IDs that we push into the comments array
                res.redirect("/blogs/" + foundBlog._id);  
            });
        }
    });
})


module.exports = router;