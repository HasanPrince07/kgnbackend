const mongoose = require("mongoose");

const faqSchema = mongoose.Schema({
    question: { type: String, trim: true },
    answer: { type: String, trim: true },
})

module.exports = mongoose.model('faq', faqSchema);