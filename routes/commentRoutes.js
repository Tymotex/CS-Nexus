// Packages:
const express = require("express"),
      passport = require("passport"),
      moment = require("moment");
// Models and middleware:
const Blog = require("../models/blog"),
      Comment = require("../models/comment"),
      User = require("../models/user"),
      authMiddleware = require("../middleware")

const router = express.Router({
    mergeParams: true
});

// RESTful Routes: |  Index |  New  |  Create  |  Show  |  Edit  |  Update  |  Destroy  | 
//                 |   GET  |  GET  |   POST   |  GET   |  GET   |   PUT    |   DELETE  |
// ===== RESTful Comment New (GET) =====
router.get("/new", authMiddleware.isLoggedIn, function(req, res) {
    Blog.findById({_id: req.params.blogID}, function(err, foundBlog) {
        if (err || !foundBlog) {
            req.flash("Comment was not found");
            res.redirect("/blogs/" + req.params.blogID);
        } else {
            res.render("comments/commentsNew", {
                blog: foundBlog
            });
        }
    });  
});

// ===== RESTful Comment Create (POST) =====
// Note that blogID exists under req.params because all comment routes extend of
// the route: /blogs/:blogID/comments/...
router.post("/", authMiddleware.isLoggedIn, function(req, res) {
    Blog.findById({_id: req.params.blogID}, function(err, foundBlog) {
        if (err || !foundBlog) {
            req.flash("Comment was not found");
            res.redirect("/blogs/" + req.params.blogID);
        } else {
            Comment.create({
                text: req.body.comment.text,
                author: {
                    id: req.user._id,
                    username: req.user.username
                } 
                // TODO: Update time created to the new modified time?
            }, function(err, createdComment) {
                // Set the author of this new comment as the username of the currently active user
                // Attach the comment to the blog document
                foundBlog.comments.push(createdComment);
                foundBlog.save();
                // The show blog route handles populating object IDs that we push into the comments array
                res.redirect("/blogs/" + foundBlog._id);  
            });
        }
    });
});

// ===== RESTful Comment Edit (GET) =====
router.get("/:commentID/edit", authMiddleware.isLoggedIn, authMiddleware.checkCommentOwnership, function(req, res) {
    Blog.findById(req.params.blogID, function(err, foundBlog) {
        if (err || !foundBlog) {
            req.flash("error", "Blog was not found");
            res.redirect("/blogs/" + req.params.blogID);
        } 
        Comment.findById(req.params.commentID, function(err, foundComment) {
            if (err || !foundComment) {
                req.flash("Comment was not found");
                res.redirect("/blogs/" + req.params.blogID);
            } else {
                res.render("comments/commentsEdit", {
                    comment: foundComment,
                    blogID: req.params.blogID
                });
            }
        });
    });
});

// ===== RESTful Comment Update (PUT) =====
router.put("/:commentID/", authMiddleware.isLoggedIn, authMiddleware.checkCommentOwnership, function(req, res) {
    req.body.comment.text = req.sanitize(req.body.comment.text);
    Comment.findByIdAndUpdate(req.params.commentID, req.body.comment, function(err, updatedComment) {
        if (err || !updatedComment) {
            req.flash("Comment was not found");
            res.redirect("/blogs/" + req.params.blogID);
        } else {
            res.redirect("/blogs/" + req.params.blogID);
        }
    });
});

// ===== RESTful Comment Destroy (DELETE) ===== 
router.delete("/:commentID/", authMiddleware.isLoggedIn, authMiddleware.checkCommentOwnership, function(req, res) {
    Comment.findByIdAndRemove(req.params.commentID, function(err, removedComment) {
        if (err) {
            req.flash("Comment was not found");
            res.redirect("/blogs/" + req.params.blogID);
        } else {
            res.redirect("/blogs/" + req.params.blogID);
        }
    });
});

module.exports = router;