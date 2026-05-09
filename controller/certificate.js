const certificateT = require("../model/certificate");
const helper = require("../helper/message");
const { cloudinary } = require('../config/cloudinary');

exports.fetchcertificate = async (req, res) => {
    try {
        const record = await certificateT.findOne().lean();
        if (!record) return res.status(404).json({ message: helper.dataMessage });
        res.status(200).json({
            message: helper.fetchMessage,
            data: record
        });
    } catch (error) {
        console.error("Error during fetch:", error);
        res.status(500).json({ message: helper.serverMessage });
    }
}

exports.updatecertificate = async (req, res) => {
    try {
        const { existingImages } = req.body;
        const id = req.params.id;
        const newFiles = req.files?.map(file => file.path) || [];
        const oldData = await certificateT.findById(id).select("images -_id").lean();
        const keepImages = Array.isArray(existingImages) ? existingImages : (existingImages ? [existingImages] : []);
        const finalImages = [...keepImages, ...newFiles];
        const imagesToDelete = oldData.images.filter(img => !finalImages.includes(img));
        if (imagesToDelete.length > 0) {
            Promise.all(imagesToDelete.map(async (img) => {
                const afterUpload = img.split("/upload/")[1]
                const withExtension = afterUpload.split("/").splice(1).join("/");
                const publicId = withExtension.split('.')[0]
                console.log("Deleting ID:", publicId);
                return await cloudinary.uploader.destroy(publicId);
            }));
        }
        const updatedData = await certificateT.findByIdAndUpdate(id, { images: finalImages }, {
            new: true,
            lean: true
        });
        res.status(200).json({ message: helper.updateMessage, data: updatedData });
    } catch (error) {
        console.error("Error during update:", error);
        res.status(500).json({ message: helper.serverMessage });
    }
};
