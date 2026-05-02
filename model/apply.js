const mongoose = require("mongoose");

const applySchema = mongoose.Schema({
    title: String,
    name: { type: String, trim: true },
    email: { type: String, trim: true },
    phone: { type: String, trim: true },
    message: { type: String, trim: true },
    file: String
})

module.exports = mongoose.model('apply', applySchema);