const mongoose = require("mongoose"),
      fs = require("fs"),
      Blog = require("./models/blog"),
      Comment = require("./models/comment"),
      PlantData = require("./models/plantdata");

function wipeBlogs() {
    Blog.remove({}, function(err) {
        if (err) {
            console.log(err);
        }
        console.log("Wiped all blogs");
        Comment.remove({}, function(err) {
            console.log("Wiped all comments");
        });
    });
}

function wipeComments() {
    Comment.remove({}, function(err) {
        if (err) {
            console.log(err);
        }
        console.log("Wiped all comments")
    });
}  

function seedDB() {
    // Wiping all blogs and all comments:
    let blogs = await Blog.remove({});
    let comments = await Comment.remove({});
    
    // Inserting seed data:
    seedDataObj = fs.readFileSync("");
    seedBlogs = seedDataObj["blogs"]
    seedComments = seedDataObj["comments"]
    for (let i = 0; i < seedBlogs.length; i++) {
        Blog.create(seedBlogs[i], function(err, createdBlog) {
            console.log("Added a blog");
            Comment.create(seedComments[i], function(err, newComment) {
                console.log("Added a new comment");
                createdBlog.comments.push(newComment);
                createdBlog.save();
            });
        });
    }
}

module.exports = {
    seedDB: seedDB,
    wipeBlogs: wipeBlogs,
    wipeComments: wipeComments
};