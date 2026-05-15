const applyT = require("../model/apply");
const helper = require("../helper/message");
const https = require('https');
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
            let publicId = withExtension;
            let options = {};
            if (record.file.includes("/raw/")) {
                publicId = withExtension;
                options.resource_type = "raw";
            } else {
                publicId = withExtension.split('.')[0]
                options.resource_type = "image";
            }
            console.log("Deleting Public ID:", publicId, "with options:", options);
            await cloudinary.uploader.destroy(publicId, options);
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
        const records = await applyT.find({ _id: { $in: ids }, file: { $ne: "none" } });
        if (records.length > 0) {
            await Promise.all(records.map(async (dt) => {
                const afterUpload = dt.file.split("/upload/")[1]
                const withExtension = afterUpload.split("/").splice(1).join("/");
                let publicId = withExtension;
                let options = {};
                if (dt.file.includes("/raw/")) {
                    publicId = withExtension;
                    options.resource_type = "raw";
                } else {
                    publicId = withExtension.split('.')[0]
                    options.resource_type = "image";
                }
                console.log("Deleting Public ID:", publicId, "with options:", options);
                await cloudinary.uploader.destroy(publicId, options);
            }));
        }
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

exports.downloadPDF = async (req, res) => {
    try {
        const id = req.params.id;
        console.log("id ->",id)
        const record = await applyT.findById(id);
        console.log("record ->",record)
        if (!record || record.file === "none") {
            return res.status(404).json({ message: "फाइल नहीं मिली" });
        }
        const cloudinaryUrl = record.file;
        console.log("cloudinaryUrl ->",cloudinaryUrl)
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=application_document.pdf');
        https.get(cloudinaryUrl, (cloudinaryResponse) => {
            if (cloudinaryResponse.statusCode === 200) {
                cloudinaryResponse.pipe(res);
            } else {
                console.error("Cloudinary Error Status:", cloudinaryResponse.statusCode);
                if (!res.headersSent) {
                    res.status(500).send("क्लाउडिनary सर्वर से फाइल नहीं मिल सकी");
                }
            }
        }).on('error', (e) => {
            console.error("HTTPS Request Error:", e);
            if (!res.headersSent) {
                res.status(500).send("डाउनलोड के दौरान नेटवर्क एरर आई");
            }
        });
    } catch (error) {
        console.error("बैकएंड डाउनलोड एरर:", error);
        if (!res.headersSent) {
            res.status(500).send("सर्वर एरर");
        }
    }
};
