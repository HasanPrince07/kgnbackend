const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    username: { type: String, trim: true },
    password: { type: String, trim: true, select: false },
    email: { type: String, default: "hasanprince0786@gmail.com" },
    resetPasswordToken: { type: String, default: null },
    resetPasswordExpires: { type: Date, default: null }
})

module.exports = mongoose.model('user', userSchema);
