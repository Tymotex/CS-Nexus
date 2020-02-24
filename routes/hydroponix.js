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
    console.log("Trying to add new plant data");

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

    var plantData = new PlantData();
    console.log("PATH NAME: " + req.file.path);
    plantData.content = req.body.content;
    plantData.img.data = fs.readFileSync(req.file.path);
    plantData.img.contentType = "image/png";
    plantData.save();

    res.redirect("/hydroponix");
}); 

module.exports = router;