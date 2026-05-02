const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
    image: { type: String, default: "none" },
    name: { type: String, trim: true },
    description: { type: String, trim: true },
    applications: { type: String, trim: true },
    positions: { type: String, trim: true },
    usage: { type: [String], default: [] },
    chemical: { type: [String], default: [] },
    mechanical: { type: [String], default: [] },
})

module.exports = mongoose.model('product', productSchema);