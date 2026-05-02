const mongoose = require("mongoose");

const numberSchema = mongoose.Schema({
    number: { type: String, trim: true },
    title: { type: String, trim: true },
})

module.exports = mongoose.model('number', numberSchema);