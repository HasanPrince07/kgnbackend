const mongoose = require("mongoose");

const historySchema = mongoose.Schema({
    year: { type: String, trim: true },
    description: { type: String, trim: true },
})

module.exports = mongoose.model('history', historySchema);