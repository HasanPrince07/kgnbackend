const careerT = require("../model/career");
const helper = require("../helper/message");

exports.fetchcareer = async (req, res) => {
    try {
        const record = await careerT.find().lean();
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

exports.fetchcareerbyid = async (req, res) => {
    try {
        const id = req.params.id
        const record = await careerT.findById(id);
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

exports.actioncareer = async (req, res) => {
    try {
        const { title, brief, requirment, salary, location } = req.body
        const id = req.params.id
        if (id === "empty") {
            await careerT.create({ title, brief, requirment, salary, location });
            return res.status(201).json({
                message: helper.insertMessage
            })
        } else {
            await careerT.updateOne({ _id: id }, { $set: { title, brief, requirment, salary, location } });
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

exports.deletecareer = async (req, res) => {
    try {
        const id = req.params.id
        await careerT.findByIdAndDelete(id);
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