const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    username: { type: String, trim: true },
    password: { type: String, trim: true, select: false }
})

module.exports = mongoose.model('user', userSchema);