const faqT = require("../model/faqs");
const helper = require("../helper/message");

exports.fetchfaq = async (req, res) => {
    try {
        const record = await faqT.find().lean();
        if (!record.length) return res.status(404).json({ message: helper.dataMessage });
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

exports.fetchfaqbyid = async (req, res) => {
    try {
        const id = req.params.id
        const record = await faqT.findById(id);
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

exports.actionfaq = async (req, res) => {
    try {
        const { question, answer } = req.body
        const id = req.params.id
        if (id === "empty") {
            await faqT.create({ question, answer });
            return res.status(201).json({
                message: helper.insertMessage
            })
        } else {
            await faqT.updateOne({ _id: id }, { $set: { question, answer } });
            res.status(200).json({
                message: helper.updateMessage
            })
        }
    } catch (error) {
        console.error("Error during insert or update:", error);
        res.status(500).json({
            message: helper.serverMessage
        })
    }
}

exports.deletefaq = async (req, res) => {
    try {
        const id = req.params.id
        await faqT.findByIdAndDelete(id);
        res.status(200).json({
            message: helper.deleteMessage
        })
    } catch (error) {
        console.error("Error during delete:", error);
        res.status(500).json({
            message: helper.serverMessage
        })
    }
}