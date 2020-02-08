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

seedDB();

app.use(bodyParser.urlencoded({extended: true}));
mongoose.connect("mongodb://localhost:27017/Blog", {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false});
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(methodOverride("_method"));
app.use(expressSanitizer());

// Passport config
app.use(require("express-session")({
    secret: "Secret sentence",   // Used to encode and decode information from a session
    resave: false,
    saveUninitialized: false
}));
app.use(passport,session());
passport.use(new LocalStrategy(User.authenticate()));   // Comes with passportLocalMongoose
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// ===== RESTful Routes For Blogs =====
app.get("/", function(req, res) {
    res.render("home");
});

// Index
app.get("/blogs", function(req, res) {
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
app.post("/blogs", function(req, res) {
    req.body.blog.content = req.sanitize(req.body);
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
    res.redirect("/blogs");
});

// New
app.get("/blogs/new", function(req, res) {
    console.log("Attempting to fill in new blog");
    res.render("blogs/newblog");
});

// Show
app.get("/blogs/:blogID", function(req, res) {
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
app.get("/blogs/:blogID/edit", function(req, res) {
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
app.put("/blogs/:blogID", function(req, res) {
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
app.delete("/blogs/:blogID", function(req, res) {
    console.log("Deleted");
    Blog.deleteOne({_id: req.params.blogID}, function(err) {
        if (err) {
            console.log(err);
        }
    });
    res.redirect("/blogs");
});

// ===== Comment Routes =====
app.get("/blogs/:blogID/comments", function(req, res) {
    
});

app.get("/blogs/:blogID/comments/new", function(req, res) {
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

app.post("/blogs/:blogID/comments", function(req, res) {
    console.log(req.body.comment);
    Blog.findById({_id: req.params.blogID}, function(err, foundBlog) {
        if (err) {
            console.log(err);
        } else {
            Comment.create(req.body.comment, function(err, createdComment) {
                foundBlog.comments.push(createdComment);
                foundBlog.save();
                res.redirect("/blogs/" + foundBlog._id);  // The show blog route handles populating object IDs that we push into the comments array
            });
        }
    });
})

// ===== Authentication routes =====
app.get("/register", function(req, res) {
    res.render("register");
};


app.listen(3000, function() {
    console.log("Listening on port 3000");
});
