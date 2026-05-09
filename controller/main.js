const mainT = require("../model/main");
const helper = require("../helper/message");
const { cloudinary } = require('../config/cloudinary');

exports.fetchmain = async (req, res) => {
    try {
        const record = await mainT.findOne().lean();
        if (!record) return res.status(404).json({ message: helper.dataMessage });
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

exports.updatemain = async (req, res) => {
    try {
        const { title, description, existingImages } = req.body;
        const id = req.params.id;
        const newFiles = req.files?.map(file => file.path) || [];
        const oldData = await mainT.findById(id).select("images -_id").lean();
        const keepImages = Array.isArray(existingImages) ? existingImages : (existingImages ? [existingImages] : []);
        const finalImages = [...keepImages, ...newFiles];
        const imagesToDelete = oldData.images.filter(img => !finalImages.includes(img));
        if (imagesToDelete.length > 0) {
            Promise.all(imagesToDelete.map(async (img) => {
                const afterUpload = img.split("/upload/")[1]
                const withExtension = afterUpload.split("/").splice(1).join("/");
                const publicId = withExtension.split('.')[0]
                console.log("Deleting ID:", publicId);
                await cloudinary.uploader.destroy(publicId);
            }));
        }
        const updatedData = await mainT.findByIdAndUpdate(id, { title, description, images: finalImages }, {
            new: true,
            lean: true
        });
        res.status(200).json({ message: helper.updateMessage, data: updatedData });
    } catch (error) {
        console.error("Error during update:", error);
        res.status(500).json({ message: helper.serverMessage });
    }
}
