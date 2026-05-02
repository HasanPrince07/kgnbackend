const historyT = require("../model/history");
const helper = require("../helper/message");

exports.fetchhistory = async (req, res) => {
    try {
        const record = await historyT.find().lean();
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

exports.fetchhistorybyid = async (req, res) => {
    try {
        const id = req.params.id
        const record = await historyT.findById(id);
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

exports.actionhistory = async (req, res) => {
    try {
        const { year, description } = req.body
        const id = req.params.id
        if (id === "empty") {
            await historyT.create({ year, description });
            return res.status(201).json({
                message: helper.insertMessage
            })
        } else {
            await historyT.updateOne({ _id: id }, { $set: { year, description } });
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

exports.deletehistory = async (req, res) => {
    try {
        const id = req.params.id
        await historyT.findByIdAndDelete(id);
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