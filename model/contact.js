const mongoose = require("mongoose");

const contactSchema = mongoose.Schema({
    image: String,
    phone: { type: String, trim: true },
    email: { type: String, trim: true },
    address: { type: String, trim: true },
    map: { type: String, trim: true },
    whatsapp: { type: String, trim: true },
    linkedin: { type: String, trim: true },
    facebook: { type: String, trim: true },
    footer: { type: String, trim: true }
})

module.exports = mongoose.model('contact', contactSchema);