const applyT = require("../model/apply");
const helper = require("../helper/message");
const { cloudinary } = require('../config/cloudinary');

exports.fetchapply = async (req, res) => {
    try {
        const record = await applyT.find().lean();
        if (!record.length) return res.status(404).json({ message: helper.dataMessage });
        res.status(200).json({
            message: helper.fetchMessage,
            data: record
        })
    } catch (error) {
        console.log("Error during fetch:", error);
        res.status(500).json({
            message: helper.serverMessage
        });
    }
}

exports.fetchapplybyid = async (req, res) => {
    try {
        const id = req.params.id
        const record = await applyT.findById(id);
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

exports.addapply = async (req, res) => {
    try {
        const { title, name, email, phone, message } = req.body
        if (req.file === undefined) {
            var file = "none"
        } else {
            var file = req.file.path
        }
        const record = new applyT({ title: title, name: name, email: email, phone: phone, message: message, file: file });
        await record.save();
        res.status(201).json({
            message: helper.applyMessage
        });
    } catch (error) {
        console.error("Error during creation:", error);
        res.status(500).json({
            message: helper.serverMessage
        });
    }
}

exports.deleteapply = async (req, res) => {
    try {
        const id = req.params.id
        const record = await applyT.findById(id);
        if (record.file !== "none") {
            const afterUpload = record.file.split("/upload/")[1]
            const withExtension = afterUpload.split("/").splice(1).join("/");
            const publicId = withExtension.split('.')[0]
            console.log("Deleting ID:", publicId);
            await cloudinary.uploader.destroy(publicId);
        }
        await applyT.findByIdAndDelete(id);
        res.status(200).json({
            message: helper.deleteMessage
        })
    } catch (error) {
        console.error("Error during delete:", error);
        res.status(500).json({
            message: helper.deleteMessage
        });
    }
}

exports.multideleteapply = async (req, res) => {
    try {
        const ids = req.body
        await applyT.deleteMany({ _id: { $in: ids } });
        res.status(200).json({
            message: helper.deleteMessage
        })
    } catch (error) {
        console.error("Error during delete:", error);
        res.status(500).json({
            message: helper.deleteMessage
        });
    }
}
