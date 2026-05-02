const mongoose = require("mongoose");

const careerSchema = mongoose.Schema({
    title: { type: String, trim: true },
    brief: { type: String, trim: true },
    requirment: { type: String, trim: true },
    salary: { type: String, trim: true },
    location: { type: String, trim: true }
})

module.exports = mongoose.model('career', careerSchema);