const mongoose = require("mongoose");

var userSchema = mongoose.Schema({
    username: String,
    password: String
});

var User = mongoose.model("user", userSchema);
module.exports = User;
const mongoose = require("mongoose"),
      passportLocalMongoose = require("passport-local-mongoose");

var userSchema = mongoose.Schema({
    username: String,
    password: String
});

userSchema.plugin(passportLocalMongoose());

var User = mongoose.model("user", userSchema);
module.exports = User;
