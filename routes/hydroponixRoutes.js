// Packages:
const express = require("express"),
      passport = require("passport"),
      moment = require("moment"),
      momentTimezone = require("moment-timezone")
      fs = require("fs");
// Models and middleware:
const Blog = require("../models/blog"),
      Comment = require("../models/comment"),
      User = require("../models/user"),
      PlantData = require("../models/plantdata"),
      authMiddleware = require("../middleware");

const router = express.Router({
    mergeParams: true
});

// RESTful Routes: |  Index |  New  |  Create  |  Show  |  Edit  |  Update  |  Destroy  | 
//                 |   GET  |  GET  |   POST   |  GET   |  GET   |   PUT    |   DELETE  |
// ===== RESTful Hydroponix Index (GET) =====
router.get("/", function(req, res) {
    // Show a list of all data snapshots
    var cardsPerPage = 8
    var pageQuery = parseInt(req.query.page);
    var pageNumber = pageQuery ? pageQuery : 1;

    PlantData.find({}).skip(cardsPerPage * (pageNumber - 1)).limit(cardsPerPage).exec(function(err, searchResults) {
        PlantData.count().exec(function(err, count) {
            if (err) {
                console.log(err);
            } else {
                console.log(searchResults);
                if (searchResults.length >= 1) {
                }
                res.render("hydroponix/hydroponixIndex", {
                    plantData: searchResults,
                    moment: moment,
                    current: pageNumber,
                    pages: Math.ceil(count / cardsPerPage)
                });
            } 
        });
    });
});

// ===== RESTful Hydroponix New (GET) =====
// Show the form for creating a new data snapshot
router.get("/new", function(req, res) {
    res.render("hydroponix/hydroponixNew");
});

// ===== RESTful Hydroponix Create (POST) =====
// Upload the data snapshot
// The picture is stored to the public/uploads directory
// The 'multer' package helps us work with image files sent from incoming POST requests
router.post("/", function(req, res) {
    const currTime = new Date();
    // TODO: This method of uniquely storing image files is unnecessary
    // Using epochMilliseconds to give a uniquely identifying image filename to be associated with the new plantdata snapshot 
    // getTime() returns milliseconds
    var epochMilliseconds = currTime.getTime()  
    var newPhotoPath = __dirname + "/../public/uploads/photo_" + epochMilliseconds + ".png"
    var plantData = new PlantData();
    // req.file.path is the path to the newly saved photo file relative to the project directory 
    // Eg. req.file.path == public/uploads/asdg11nhfv8casfv...
    fs.rename(__dirname + "/../" + req.file.path, newPhotoPath, function(err) {  
        if (err) {
            console.log(err);
            res.redirect("/");
        } else {
            var newPath = "uploads/photo_" + epochMilliseconds + ".png"
            plantData.title = req.body.title
            plantData.content = req.body.content;
            plantData.imgPath = newPath;
            plantData.save();
            res.redirect("/hydroponix");
        }
    });
}); 

// ===== RESTful Hydroponix Show (GET) =====
// Inspect details of a particular data snapshot, identified by plantID
router.get("/:plantID", function(req, res) {
    PlantData.findById({_id: req.params.plantID}, function(err, foundData) {
        if (err) {
            res.send("Error");
        } else {
            console.log(foundData)
            res.render("hydroponix/hydroponixView", {
                plantData: foundData,
                moment: moment
            })
        }
    });
});

// ===== RESTful Hydroponix Destroy (DELETE) =====
// Remove a data snapshot from the database
router.delete("/:plantID", function(req, res) {
    // TODO: photos are not being deleted
    PlantData.deleteOne({_id: req.params.plantID}, function(err) {
        if (err) {
            console.log(err);
        }
    });
    res.redirect("/hydroponix");
});

module.exports = router;