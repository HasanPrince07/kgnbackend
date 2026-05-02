const mongoose = require("mongoose");

const mainSchema = mongoose.Schema({
    title: { type: String, trim: true },
    description: { type: String, trim: true },
    images: [String],
})

module.exports = mongoose.model('main', mainSchema);