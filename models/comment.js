const mongoose = require("mongoose");

var commentSchema = mongoose.Schema({
    author: {
        // 'ref' tells Mongoose which model to use when the populate() method is eventually called
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
    text: String,
    timeCreated: {type: Date, default: Date.now}
});

var Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;
