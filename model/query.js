const mongoose = require("mongoose");

const querySchema = mongoose.Schema({
    name: { type: String, trim: true },
    email: { type: String, trim: true },
    phone: { type: String, trim: true },
    message: { type: String, trim: true },
    status: { type: String, default: "unreplied" }
})

module.exports = mongoose.model('query', querySchema);