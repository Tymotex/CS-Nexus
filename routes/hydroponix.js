const express = require("express");
const router = express.Router();
const passport = require("passport");
const moment = require("moment");
const Blog = require("../models/blog");
const Comment = require("../models/comment");
const User = require("../models/user");
const PlantData = require("../models/plantdata");
const fs = require("fs");

// Index
router.get("/", function(req, res) {
    console.log("Viewing Hydroponix Data");
    PlantData.find({}, function(err, searchResults) {
        if (err) {
            console.log(err);
        } else {
            console.log(searchResults);
            if (searchResults.length >= 1) {
            }
            res.render("hydroponix/plants", {
                plantData: searchResults
            });
        }
    });
});

router.get("/new", function(req, res) {
    console.log("Trying to add new plant data");
    res.render("hydroponix/newplantdata");
});

router.post("/", function(req, res) {
    const currTime = new Date();
    // Using epochMilliseconds to give a uniquely identifying image filename to be associated with the new plantdata snapshot 
    var epochMilliseconds = currTime.getTime()  // getTime() returns milliseconds
    var newPhotoPath = __dirname + "/../public/uploads/photo_" + epochMilliseconds + ".png"
    
    var plantData = new PlantData();
    fs.rename(__dirname + "/../" + req.file.path, newPhotoPath, function(err) {  // req.file.path is the path to the newly saved photo file relative to the project directory (eg. req.file.path == public/uploads/1nhfv8cv...)
        if (err) {
            console.log(err);
            res.redirect("/");
        } else {
            var newPath = "uploads/photo_" + epochMilliseconds + ".png"
            plantData.content = req.body.content;
            plantData.imgPath = newPath;
            plantData.timeCreatedSinceEpoch = epochMilliseconds;
            plantData.save();
            res.redirect("/hydroponix");
        }
    });

    
}); 

/*PlantData.create({
    content: req.body.content,
    img.data: fs.readFileSync(req.files.userPhoto.path),
    img["contentType"]: "image/png"
}, function(err, newPlantData) {
    if (err) {
        console.log(err);
    } else {
        console.log(newPlantData);
    }
});*/

module.exports = router;