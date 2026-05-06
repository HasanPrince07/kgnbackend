const router = require("express").Router();
const mainC = require("../controller/main");
const userC = require("../controller/user");
const historyC = require("../controller/history");
const numberC = require("../controller/number");
const certificateC = require("../controller/certificate");
const policyC = require("../controller/policy");
const faqC = require("../controller/faqs");
const aboutC = require("../controller/about");
const careerC = require("../controller/career");
const applyC = require("../controller/apply");
const wallpaperC = require("../controller/wallpaper");
const contactC = require("../controller/contact");
const queryC = require("../controller/query");
const productC = require("../controller/product");
const helper = require("../helper/message");
const jwt = require("jsonwebtoken");
const secretKey = process.env.SECRET_KEY
const { upload } = require('../config/cloudinary');

const verifyToken = (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) return res.status(401).json({ message: helper.deniedMessage });
        jwt.verify(token, secretKey, (error, valid) => {
            if (error) {
                console.log("Error in token:", error);
                res.status(401).json({ message: helper.tokenMessage });
            } else {
                req.user = valid
                next();
            }
        });
    } catch (error) {
        console.log("Error during verify token", error);
        res.status(500).json({ message: helper.serverMessage });
    }
};

router.get("/fetchmain", verifyToken, mainC.fetchmain);
router.put("/updatemain/:id", upload.array("images", 10), verifyToken, mainC.updatemain);

router.get("/fetchuser", verifyToken, userC.fetchuser);
router.put("/updateuser/:id", verifyToken, userC.updateuser);

router.get("/fetchhistory", verifyToken, historyC.fetchhistory);
router.get("/fetchhistorybyid/:id", verifyToken, historyC.fetchhistorybyid);
router.post("/actionhistory/:id", verifyToken, historyC.actionhistory);
router.get("/deletehistory/:id", verifyToken, historyC.deletehistory);

router.get("/fetchnumber", verifyToken, numberC.fetchnumber);
router.get("/fetchnumberbyid/:id", verifyToken, numberC.fetchnumberbyid);
router.post("/actionnumber/:id", verifyToken, numberC.actionnumber);
router.get("/deletenumber/:id", verifyToken, numberC.deletenumber);

router.get("/fetchcertificate", verifyToken, certificateC.fetchcertificate);
router.put("/updatecertificate/:id", upload.array("images", 10), verifyToken, certificateC.updatecertificate);

router.get("/fetchpolicy", verifyToken, policyC.fetchpolicy);
router.put("/updatepolicy/:id", verifyToken, policyC.updatepolicy);

router.get("/fetchfaq", verifyToken, faqC.fetchfaq);
router.get("/fetchfaqbyid/:id", verifyToken, faqC.fetchfaqbyid);
router.post("/actionfaq/:id", verifyToken, faqC.actionfaq);
router.get("/deletefaq/:id", verifyToken, faqC.deletefaq);

router.get("/fetchcareer", verifyToken, careerC.fetchcareer);
router.get("/fetchcareerbyid/:id", verifyToken, careerC.fetchcareerbyid);
router.post("/actioncareer/:id", verifyToken, careerC.actioncareer);
router.get("/deletecareer/:id", verifyToken, careerC.deletecareer);

router.get("/fetchapply", verifyToken, applyC.fetchapply);
router.get("/fetchapplybyid/:id", verifyToken, applyC.fetchapplybyid);
router.get("/deleteapply/:id", verifyToken, applyC.deleteapply);
router.post("/multideleteapply", verifyToken, applyC.multideleteapply);

router.get("/fetchabout", verifyToken, aboutC.fetchabout);
router.put("/updateabout/:id", upload.array("images", 10), verifyToken, aboutC.updateabout);

router.get("/fetchwallpaper/:id", verifyToken, wallpaperC.fetchwallpaper);
router.get("/fetchwallpaperbyid/:id", verifyToken, wallpaperC.fetchwallpaperbyid);
router.put("/updatewallpaper/:id", upload.single("image"), verifyToken, wallpaperC.updatewallpaper);

router.get("/fetchcontact", verifyToken, contactC.fetchcontact);
router.put("/updatecontact/:id", upload.single("image"), verifyToken, contactC.updatecontact);

router.get("/fetchquery/:id", verifyToken, queryC.fetchquery);
router.get("/deletequery/:id", verifyToken, queryC.deletequery);
router.post("/multideletequery", verifyToken, queryC.multideletequery);
router.get("/fetchquerybyid/:id", verifyToken, queryC.fetchquerybyid);
router.post("/replyquery/:id", upload.single("image"), verifyToken, queryC.replyquery);

router.get("/fetchproduct", verifyToken, productC.fetchproduct);
router.post("/addproduct", upload.single("image"), verifyToken, productC.addproduct);
router.get("/deleteproduct/:id", verifyToken, productC.deleteproduct);
router.get("/fetchproductbyid/:id", verifyToken, productC.fetchproductbyid);

router.post("/login", userC.login);
router.get("/logout", userC.logout);
router.get("/checkAuth", verifyToken, userC.checkAuth);

module.exports = router
