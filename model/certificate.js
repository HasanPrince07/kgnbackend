const mongoose = require("mongoose");

const certificateSchema = mongoose.Schema({
    images: [String],
})

module.exports = mongoose.model('certificate', certificateSchema);