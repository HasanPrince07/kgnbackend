const mongoose = require("mongoose");

const policySchema = mongoose.Schema({
    description: { type: String, trim: true }
})

module.exports = mongoose.model('policy', policySchema);