const mongoose = require("mongoose");

// Mongoose model configuration
var plantDataSchema = mongoose.Schema({
    content: String
});

var PlantData = mongoose.model("plantData", plantDataSchema);
module.exports = PlantData;
