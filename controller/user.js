const userT = require("../model/user");
const helper = require("../helper/message");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
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
                return res.status(200).cookie("token", token, cookieOptions).json({ message: helper.loginMessage, debugToken: token });
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
