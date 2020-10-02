const mongoose = require("mongoose");

// Mongoose model configuration
var plantDataSchema = mongoose.Schema({
    title: String,
    content: String,
    imgPath: String,
    timeCreated: {type: Date, default: Date.now}
});

var PlantData = mongoose.model("plantData", plantDataSchema);
module.exports = PlantData;
