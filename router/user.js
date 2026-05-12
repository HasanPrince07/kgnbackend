const router = require("express").Router();
const mainC = require("../controller/main");
const policyC = require("../controller/policy");
const historyC = require("../controller/history");
const productC = require("../controller/product");
const numberC = require("../controller/number");
const certificateC = require("../controller/certificate");
const faqC = require("../controller/faqs");
const careerC = require("../controller/career");
const aboutC = require("../controller/about");
const wallpaperC = require("../controller/wallpaper");
const contactC = require("../controller/contact");
const applyC = require("../controller/apply");
const queryC = require("../controller/query");
const { uploadCloud } = require('../config/cloudinary');


router.get("/fetchmain", mainC.fetchmain);
router.get("/fetchhistory", historyC.fetchhistory);
router.get("/fetchproduct", productC.fetchproduct);
router.get("/fetchnumber", numberC.fetchnumber);
router.get("/fetchcertificate", certificateC.fetchcertificate);
router.get("/fetchpolicy", policyC.fetchpolicy);
router.get("/fetchfaq", faqC.fetchfaq);
router.get("/fetchcareer", careerC.fetchcareer);
router.get("/fetchabout", aboutC.fetchabout);
router.get("/fetchwallpaper/:id", wallpaperC.fetchwallpaper);
router.get("/fetchcontact", contactC.fetchcontact);

router.post("/addapply", uploadCloud.single("file"), applyC.addapply);
router.post("/addquery", queryC.addquery);

router.get("/fetchcareerbyid/:id", careerC.fetchcareerbyid);
router.get("/fetchproductbyid/:id", productC.fetchproductbyid);
router.get("/fetchfirstproduct", productC.fetchfirstproduct);
router.post("/downloadbrochure", productC.downloadbrochure);


module.exports = router
