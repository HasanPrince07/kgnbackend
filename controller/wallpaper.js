const wallpaperT = require("../model/wallpaper");
const helper = require("../helper/message");
const { cloudinary } = require('../config/cloudinary');

exports.fetchwallpaper = async (req, res) => {
    try {
        const index = parseInt(req.params.id)
        if (isNaN(index)) {
            return res.status(400).json({ message: "Invalid ID parameter" });
        }
        const record = (index === 0) ? await wallpaperT.find().lean() : await wallpaperT.findOne().skip(index - 1).lean()
        const isEmpty = !record || (Array.isArray(record) && record.length === 0);
        if (isEmpty) return res.status(404).json({ message: helper.dataMessage });
        res.status(200).json({
            message: helper.fetchMessage,
            data: record
        });
    } catch (error) {
        console.log("Error during fetch:", error);
        res.status(500).json({
            message: helper.serverMessage
        });
    }
}

exports.fetchwallpaperbyid = async (req, res) => {
    try {
        const id = req.params.id
        const record = await wallpaperT.findById(id);
        res.status(200).json({
            message: helper.fetchMessage,
            data: record
        })
    } catch (error) {
        console.log("Error during fetch:", error);
        res.status(500).json({
            message: helper.serverMessage
        })
    }
}

exports.updatewallpaper = async (req, res) => {
    try {
        const { title, existingImage } = req.body
        const id = req.params.id
        const newFile = req.file?.path
        let oldData = await wallpaperT.findById(id).select("image -_id").lean();
        let finalImage = existingImage;
        let shouldDelete = false;
        if (newFile) {
            finalImage = newFile;
            shouldDelete = true;
        } else if (!existingImage) {
            shouldDelete = true;
        }
        if (shouldDelete && oldData.image) {
                const afterUpload = oldData.image.split("/upload/")[1]
                const withExtension = afterUpload.split("/").splice(1).join("/");
                const publicId = withExtension.split('.')[0]
                console.log("Deleting ID:", publicId);
                return await cloudinary.uploader.destroy(publicId);
        }
        const updatedData = await wallpaperT.findByIdAndUpdate(id, { title, image: finalImage }, {
            new: true,
            lean: true
        });
        res.status(200).json({ message: helper.updateMessage, data: updatedData })
    } catch (error) {
        console.error("Error during update:", error);
        res.status(500).json({
            message: helper.serverMessage
        })
    }
}
