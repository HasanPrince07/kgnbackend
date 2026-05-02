const mongoose = require("mongoose");

const aboutSchema = mongoose.Schema({
    title: { type: String, trim: true },
    description: { type: String, trim: true },
    company: { type: String, trim: true },
    vision: { type: String, trim: true },
    features: [String],
    chooseus: [String],
    images: [String],
})

module.exports = mongoose.model('about', aboutSchema);