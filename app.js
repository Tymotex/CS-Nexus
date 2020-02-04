const express = require("express"),
      mongoose = require("mongoose"),
      bodyParser = require("body-parser"),
      app = express();

app.use(bodyParser.urlencoded({extended: true}));
mongoose.connect("mongodb://localhost:27017/Blog", {useNewUrlParser: true, useUnifiedTopology: true});
app.set("view engine", "ejs");
app.use(express.static("public"));

// Mongoose model configuration
var blogSchema = mongoose.Schema({
    title: String,
    author: String,
    image: String,
    content: String,
    timeCreated: {type: Date, default: Date.now}
});

var Blog = mongoose.model("blog", blogSchema);

// RESTful Routes
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
            console.log(searchResults);
            res.render("blogs", {
                blogs: searchResults
            });
        }
    });
});

// Create
app.post("/blogs", function(req, res) {
    console.log("Attempting to post new blog");
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
    res.render("newblog");
});

// Show
app.get("/blogs/:blogID", function(req, res) {
    Blog.findById({_id: req.params.blogID}, function(err, foundBlog) {
        if (err) {
            res.send("Error");
        } else {
            res.render("viewblog", {
                blog: foundBlog
            });
        }
    });

});

app.listen(3000, function() {
    console.log("Listening on port 3000");
});
