const mongoose = require("mongoose");

const wallpaperSchema = mongoose.Schema({
    title: { type: String, trim: true },
    image: String,
})

module.exports = mongoose.model('wallpaper', wallpaperSchema);