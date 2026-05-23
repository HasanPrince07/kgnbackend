const express = require("express");
const cookieParser = require("cookie-parser");
const mongoose = require('mongoose');
const compression = require("compression");
const cors = require("cors");
require("dotenv").config();
const adminRouter = require('./router/admin');
const userRouter = require('./router/user');
const app = express();

mongoose.connect(process.env.DB_URL)
    .then(() => {
        console.log("Database connected successfully!");
    })
    .catch((err) => {
        console.error("Database connection error: ", err.message);
    });

app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());
app.use(compression());
app.use(cors({ origin: ["https://kgnelectrodes.com"], credentials: true }));

app.use(express.static('public', {
    maxAge: "1y",
    etag: false
}));
app.use('/admin', adminRouter);
app.use('/user', userRouter);
app.get('/cronjob/ping', (req, res) => {
    return res.status(200).json({ message: "Server is alive!" });
});

const PORT = process.env.PORT || 5000
app.listen(PORT, () => { console.log(`server is running on port ${PORT}`) });
