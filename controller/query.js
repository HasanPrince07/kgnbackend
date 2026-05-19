const queryT = require("../model/query");
const helper = require("../helper/message");
const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);


exports.fetchquery = async (req, res) => {
    try {
        const id = req.params.id
        const statusMap = {
            "Replied Queries": "replied",
            "Unreplied Queries": "unreplied"
        };
        const filterStatus = statusMap[id] || id;
        const queryFilter = id === "All Queries" ? {} : { status: filterStatus };
        const [record, total, replied, unreplied] = await Promise.all([
            queryT.find(queryFilter).lean(),
            queryT.countDocuments(),
            queryT.countDocuments({ status: "replied" }),
            queryT.countDocuments({ status: "unreplied" })
        ]);
        res.status(200).json({
            message: helper.fetchMessage,
            data: record,
            stats: {
                total,
                replied,
                unreplied
            }
        });
    } catch (error) {
        console.log("Error during fetch:", error);
        res.status(500).json({
            message: helper.serverMessage
        });
    }
}

exports.fetchquerybyid = async (req, res) => {
    try {
        const id = req.params.id
        const record = await queryT.findById(id);
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

exports.addquery = async (req, res) => {
    try {
        const { name, email, phone, message } = req.body
        const record = new queryT({ name: name, email: email, phone: phone, message: message });
        await record.save();
        res.status(201).json({
            message: helper.insertMessage,
        });
    } catch (error) {
        console.error("Error during creation:", error);
        res.status(500).json({
            message: helper.serverMessage
        });
    }
}

exports.deletequery = async (req, res) => {
    try {
        const id = req.params.id
        await queryT.findByIdAndDelete(id);
        res.status(200).json({
            message: helper.deleteMessage
        });
    } catch (error) {
        console.error("Error during delete:", error);
        res.status(500).json({
            message: helper.serverMessage
        });
    }
}

exports.multideletequery = async (req, res) => {
    try {
        const ids = req.body
        await queryT.deleteMany({ _id: { $in: ids } });
        res.status(200).json({
            message: helper.deleteMessage
        });
    } catch (error) {
        console.error("Error during delete:", error);
        res.status(500).json({
            message: helper.serverMessage
        });
    }
}

exports.replyquery = async (req, res) => {
    const { email, from, subject, body } = req.body;
    const id = req.params.id;
    try {
        let attachments = [];
        if (req.file) {
            attachments.push({
                filename: req.file.originalname,
                path: req.file.path
            });
        }
        const emailResponse = await resend.emails.send({
            from: from,
            to: [email],
            subject: subject,
            text: body,
            attachments: attachments.length > 0 ? attachments : undefined
        });
        if (emailResponse.error) {
            console.error("Resend API Error:", emailResponse.error);
            return res.status(400).json({ message: helper.sentMessage });
        }
        await queryT.findByIdAndUpdate(id, { status: 'replied' });
        return res.status(200).json({ message: helper.emailMessage });
    } catch (error) {
        console.error("Error during sent email:", error);
        return res.status(500).json({ message: helper.serverMessage });
    }
};
