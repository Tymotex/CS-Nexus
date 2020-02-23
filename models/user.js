const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

var userSchema = new mongoose.Schema({
    username: String,
    password: String
});


userSchema.plugin(passportLocalMongoose);

var User = mongoose.model("user", userSchema);
module.exports = User;
