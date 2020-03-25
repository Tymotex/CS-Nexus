const mongoose = require("mongoose"),
      Comment = require("./comment");

// Mongoose model configuration
var blogSchema = mongoose.Schema({
    title: String,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
    image: String,
    content: String,
    timeCreated: {type: Date, default: Date.now},
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ]
});

var Blog = mongoose.model("blog", blogSchema);
module.exports = Blog;
