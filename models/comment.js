const mongoose = require("mongoose");

var commentSchema = mongoose.Schema({
    author: String,
    text: String,
    timeCreated: {type: Date, default: Date.now}
});

var Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;
