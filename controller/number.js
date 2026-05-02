const numberT = require("../model/number");
const helper = require("../helper/message");

exports.fetchnumber = async (req, res) => {
    try {
        const record = await numberT.find().lean();
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

exports.fetchnumberbyid = async (req, res) => {
    try {
        const id = req.params.id
        const record = await numberT.findById(id);
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

exports.actionnumber = async (req, res) => {
    try {
        const { number, title } = req.body
        const id = req.params.id
        if (id === "empty") {
            await numberT.create({ number, title });
            return res.status(201).json({
                message: helper.insertMessage,
            });
        } else {
            await numberT.updateOne({ _id: id }, { $set: { number, title } });
            res.status(200).json({
                message: helper.updateMessage,
            });
        }
    } catch (error) {
        console.error("Error during insert or update:", error);
        res.status(500).json({
            message: helper.serverMessage
        })
    }
}

exports.deletenumber = async (req, res) => {
    try {
        const id = req.params.id
        await numberT.findByIdAndDelete(id);
        res.status(200).json({
            message: helper.deleteMessage,
        })
    } catch (error) {
        console.error("Error during delete:", error);
        res.status(500).json({
            message: helper.serverMessage
        })
    }
}