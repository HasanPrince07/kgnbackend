const express = require("express");
const cookieParser = require("cookie-parser");
const mongoose = require('mongoose');
const compression = require("compression");
const cors = require("cors");
require("dotenv").config();
const adminRouter = require('./router/admin');
const userRouter = require('./router/user');
const app = express();


app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());
app.use(compression());
app.use(cors({ origin: ["https://kgnfrontend.onrender.com"], credentials: true }));

mongoose.connect(process.env.DB_URL || `mongodb://127.0.0.1:27017/kgnelectrodes`);
mongoose.connection.on("connected", () => console.log("DB is connected"));
mongoose.connection.on("error", (err) => console.error("Error during connected with DB:", err));


app.use(express.static('public', {
    maxAge: "1y",
    etag: false
}));
app.use('/admin', adminRouter);
app.use('/user', userRouter);
console.log("call backenddddd")

const PORT = process.env.PORT || 5000
app.listen(PORT, () => { console.log(`server is running on port ${PORT}`) });
