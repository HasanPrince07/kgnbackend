const policyT = require("../model/policy");
const helper = require("../helper/message");

exports.fetchpolicy = async (req, res) => {
    try {
        const record = await policyT.findOne().lean();
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

exports.updatepolicy = async (req, res) => {
    try {
        const { description } = req.body
        const id = req.params.id
        const updatedData = await policyT.findByIdAndUpdate(id, { description: description }, { new: true, lean: true });
        res.status(200).json({ message: helper.updateMessage, data: updatedData });
    } catch (error) {
        console.error("Error during update:", error);
        res.status(500).json({ message: helper.serverMessage });
    }
}