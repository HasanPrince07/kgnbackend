const contactT = require("../model/contact");
const helper = require("../helper/message");
const { cloudinary } = require('../config/cloudinary');

exports.fetchcontact = async (req, res) => {
    try {
        const record = await contactT.findOne().lean();
        if (!record) return res.status(404).json({ message: helper.dataMessage });
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

exports.updatecontact = async (req, res) => {
    try {
        const { phone, email, map, whatsapp, linkedin, facebook, address, footer, existingImage } = req.body
        const id = req.params.id
        const newFile = req.file?.path;
        let oldData = await contactT.findById(id).select("image -_id").lean();
        let finalImage = existingImage;
        let shouldDelete = false;
        if (newFile) {
            finalImage = newFile;
            shouldDelete = true;
        } else if (!existingImage) {
            shouldDelete = true;
        }
        if (shouldDelete && oldData.image) {
                const afterUpload = img.split("/upload/")[1]
                const withExtension = afterUpload.split("/").splice(1).join("/");
                const publicId = withExtension.split('.')[0]
                console.log("Deleting ID:", publicId);
                return await cloudinary.uploader.destroy(publicId);
        }
        const updatedData = await contactT.findByIdAndUpdate(id, { phone, email, map, whatsapp, linkedin, facebook, address, footer, image: finalImage }, {
            new: true,
            lean: true
        });
        res.status(200).json({ message: helper.updateMessage, data: updatedData });
    } catch (error) {
        console.error("Error during update:", error);
        res.status(500).json({
            message: helper.serverMessage
        })
    }
}
