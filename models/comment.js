const mongoose = require("mongoose");

var commentSchema = mongoose.Schema({
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String,
        fuck: String
    },
    text: String,
    timeCreated: {type: Date, default: Date.now}
});

var Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;
