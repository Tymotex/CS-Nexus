// ===== Middleware Helper Functions =====
// This module contains authentication and authorisation functions
// Note: route handlers app.get, app.post, etc. can be given multiple callback functions
// that behave like middleware to handle a request.
// Note: the filename 'index.js' has special meaning. When we 'require()' this file in 
// other files, we only need to have specify the directory containing this file.
// Eg. require("express") instead of require("express/index.js")

// Models:
const Blog = require("../models/blog"),
      User = require("../models/user"),
      Comment = require("../models/comment"),
      PlantData = require("../models/plantdata");

var authMiddleware = {}

// Checks if a user is authenticated
authMiddleware.isLoggedIn = function(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        req.flash("error", "Please login first!");
        res.redirect("/login");
    }
}

// Checks if the user is authorised, ie. that their _id is the same as the _id of the author
// of the blog. This prevents users from editing/deleting blogs that they didn't write 
authMiddleware.checkBlogOwnership = function(req, res, next) {
    Blog.findById(req.params.blogID, function(err, foundBlog) {
        if (err || !foundBlog) {
            console.log(err);
            req.flash("error", "Blog was not found");
            res.redirect("/blogs");
        } else {
            // Can't directly use '==' to compare IDs because req.user._id is a string and
            // foundBlog.author.id is a Mongoose ObjectID
            if (foundBlog.author.id.equals(req.user._id) || req.user.isAdmin) {
                // User is authorised to make changes to this blog
                // Calling next to proceed with the next operation along the middleware stack
                next();
            } else {
                req.flash("error", "You are not authorised to do that!");
                res.redirect("/blogs");
            }
        }
    });
}

// Checks if the user is authorised to modify/delete this comment by checking the comment's
// author's ID against the current user's DI
authMiddleware.checkCommentOwnership = function(req, res, next) {
    Comment.findById(req.params.commentID, function(err, foundComment) {
        if (err) {
            console.log(err);
            req.flash("error", "Comment was not found");
            res.redirect("back");
        } else {
            if (foundComment.author.id.equals(req.user._id) || req.user.isAdmin) {
                next();
            } else {
                req.flash("error", "You are not authorised to do that!");
                res.redirect("back");
            }
        }
    });
}

module.exports = authMiddleware;