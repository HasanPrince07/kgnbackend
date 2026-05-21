const userT = require("../model/user");
const helper = require("../helper/message");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Resend } = require("resend");
const resend = new Resend(process.env.RESEND_API_KEY);
const secretKey = process.env.SECRET_KEY;

exports.fetchuser = async (req, res) => {
    try {
        const record = await userT.findOne().lean();
        if (!record) return res.status(404).json({ message: helper.dataMessage });
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

exports.updateuser = async (req, res) => {
    try {
        const { password } = req.body
        const id = req.params.id
        if (!password) return res.status(400).json({ message: "Password missing" });
        const hashedPassword = await bcrypt.hash(password.trim(), 10);
        const record = await userT.findByIdAndUpdate(id, { password: hashedPassword }, { lean: true });
        if (!record) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ message: helper.updateMessage });
    } catch (error) {
        console.error("Error during update:", error);
        res.status(500).json({ message: helper.serverMessage });
    }
}

exports.login = async (req, res) => {
    try {
        const { username, password } = req.body
        const record = await userT.findOne({ username }).select("+password").lean();
        if (record) {
            const isMatch = await bcrypt.compare(password.trim(), record.password);
            if (isMatch) {
                const token = jwt.sign({ id: record._id, role: "admin" }, secretKey, { expiresIn: "1d" });
                const cookieOptions = {
                    httpOnly: true,
                    maxAge: 24 * 60 * 60 * 1000,
                    secure: true,
                    sameSite: "none",
                    path: "/"
                };
                return res.status(200).cookie("token", token, cookieOptions).json({ message: helper.loginMessage });
            }
        }
        return res.status(401).json({ message: helper.credentialMessage });
    } catch (error) {
        console.log("Error during login:", error);
        res.status(500).json({
            message: helper.serverMessage
        });
    }
}

exports.logout = async (req, res) => {
    try {
        const cookieOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            path: "/"
        };
        return res.status(200).clearCookie("token", cookieOptions).json({ message: helper.logoutMessage });
    } catch (error) {
        console.log("Error during logout:", error);
        res.status(500).json({
            message: helper.serverMessage
        });
    }
}

exports.checkAuth = async (req, res) => {
    try {
        res.status(200).json({ authenticated: true });
    } catch (error) {
        console.log("Error during authentication:", error);
        res.status(500).json({
            message: helper.serverMessage
        });
    }
}

exports.forgot = async (req, res) => {
    try {
        const { email } = req.body
        const record = await userT.findOne({ email: email.trim().toLowerCase() });
        if (!record) { return res.status(200).json({ message: helper.existMessage }) }
        const resetToken = crypto.randomBytes(32).toString('hex');
        const expiryDate = Date.now() + 5 * 60 * 1000;
        record.resetPasswordToken = resetToken
        record.resetPasswordExpires = expiryDate
        await record.save();
        const resetUrl = `https://kgnelectrodes.com/reset/${resetToken}`;
        const emailResponse = await resend.emails.send({
            from: "KGN Electrodes <info@kgnelectrodes.com>",
            to: [email],
            replyTo: "hasanprince0786@gmail.com",
            subject: "Password Reset Request - KGN Electrodes",
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee;">
                    <h2 style="color: #333;">Password reset request</h2>
                    <p>Hello,</p>
                    <p>We've received a password reset request for your account. Click the button below to change your password:</p>
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="${resetUrl}" style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">reset password</a>
                    </div>
                    <p style="color: #555;">This link will be valid only for <b>5 minutes</b> due to security reasons.</p>
                    <p style="font-size: 12px; color: #999;">If you didn't request this, please ignore this email. Your old password will remain secure.</p>
                    <hr style="border: none; border-top: 1px solid #eee;" />
                    <p style="font-size: 12px; color: #666;">KGN Electrodes Team</p>
                </div>
      `
        });
        if (emailResponse.error) {
            console.log("Resend API Error:", emailResponse.error);
            record.resetPasswordToken = undefined;
            record.resetPasswordExpires = undefined;
            await record.save();
            return res.status(400).json({ message: helper.sentMessage });
        }
        res.status(200).json({ message: helper.existMessage })
    } catch (error) {
        console.log("Error during forgot:", error);
        res.status(500).json({
            message: helper.serverMessage
        });
    }
}

exports.reset = async (req, res) => {
    try {
        const { newpass, cpass } = req.body
        const { id } = req.params
        if (newpass.trim() !== cpass.trim()) { return res.status(400).json({ message: helper.matchMessage }); }
        const record = await userT.findOne({ resetPasswordToken: id, resetPasswordExpires: { $gt: Date.now() } });
        if (!record) { return res.status(400).json({ message: "The password reset link is invalid or has expired (15 minutes)." }); }
        const hashedPassword = await bcrypt.hash(newpass.trim(), 10);
        record.password = hashedPassword;
        record.resetPasswordToken = undefined;
        record.resetPasswordExpires = undefined;
        await record.save();
        return res.status(200).json({ message: helper.resetMessage });
    } catch (error) {
        console.log("Error during forgot:", error);
        res.status(500).json({
            message: helper.serverMessage
        });
    }
}
