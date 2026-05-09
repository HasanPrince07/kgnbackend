const queryT = require("../model/query");
const helper = require("../helper/message");

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
    const { email, from, subject, body } = req.body
    const id = req.params.id
    if (req.file === undefined) {
        try {
            // const transporter = nodemailer.createTransport({
            //     host: "smtp.gmail.com",
            //     port: 465,
            //     secure: true,
            //     auth: {
            //         user: from,
            //         pass: "lnhdnirlkaopljvc",
            //     },
            // });
            // const info = await transporter.sendMail({
            //     from: from,
            //     to: to,
            //     subject: subject,
            //     text: body,
            // });
            await queryT.findByIdAndUpdate(id, { status: 'replied' });
            res.status(200).json({
                message: helper.emailMessage
            });
        } catch (error) {
            console.error("Error during sent email:", error);
            res.status(500).json({
                message: helper.serverMessage
            });
        }
    } else {
        const filepath = req.file.path
        try {
            // const transporter = nodemailer.createTransport({
            //     host: "smtp.gmail.com",
            //     port: 465,
            //     secure: true,
            //     auth: {
            //         user: from,
            //         pass: "lnhdnirlkaopljvc",
            //     },
            // });
            // const info = await transporter.sendMail({
            //     from: from,
            //     to: to,
            //     subject: subject,
            //     text: body,
            //     attachments: [{
            //         path: filepath
            //     }]
            // });
            await queryT.findByIdAndUpdate(id, { status: 'replied' })
            res.status(200).json({
                message: helper.emailMessage
            });
        } catch (error) {
            console.error("Error during sent email:", error);
            res.status(200).json({
                message: helper.serverMessage
            });
        }
    }
}
