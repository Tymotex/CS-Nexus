const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");
// NPM package for adding an 'email' type to mongo
require("mongoose-type-email");

var userSchema = new mongoose.Schema({
    email: {type: String, unique: true, required: true},
    username: {type: String, unique: true, required: true},
    password: String,
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    isAdmin: {type: Boolean, default: false}
});

userSchema.plugin(passportLocalMongoose);

var User = mongoose.model("user", userSchema);
module.exports = User;
