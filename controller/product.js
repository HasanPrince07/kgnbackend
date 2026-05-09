const productT = require("../model/product");
const helper = require("../helper/message");
const handlebars = require("handlebars");
const puppeteer = require("puppeteer");
const { cloudinary } = require('../config/cloudinary');

exports.fetchproduct = async (req, res) => {
    try {
        const record = await productT.find().lean();
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

exports.fetchfirstproduct = async (req, res) => {
    try {
        const record = await productT.findOne();
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

exports.addproduct = async (req, res) => {
    try {
        const { name, description, applications, positions, usage, chemical, mechanical } = req.body
        await productT.create({ name, description, applications, positions, usage: JSON.parse(usage), chemical: JSON.parse(chemical), mechanical: JSON.parse(mechanical), image: req.file ? req.file.path : "none" });
        res.status(201).json({
            message: helper.insertMessage
        })
    } catch (error) {
        console.log("Error during create:", error);
        if (req.file) {
            fs.unlinkSync(req.file.path);
        }
        res.status(500).json({
            message: helper.serverMessage
        })
    }
}

exports.fetchproductbyid = async (req, res) => {
    try {
        const id = req.params.id
        const record = await productT.findById(id);
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

exports.deleteproduct = async (req, res) => {
    try {
        const id = req.params.id
        const record = await productT.findById(id);
        if (record.image !== "none") {
            const imgPath = path.join(__dirname, "../public", record.image);
            fs.promises.unlink(imgPath).catch(error => console.error("Error during file delete:", error));
        }
        await productT.findByIdAndDelete(id);
        res.status(200).json({
            message: helper.deleteMessage
        })
    } catch (error) {
        console.error("Error during delete:", error);
        res.status(500).json({
            message: helper.serverMessage
        })
    }
}

exports.downloadbrochure = async (req, res) => {
    try {
        const dynamicData = req.body
        const browser = await puppeteer.launch({ headless: "new", args: ['--no-sandbox'] });
        const page = await browser.newPage();

        const brochureDir = path.join(__dirname, "..", "brochure");
        const htmlContentRaw = fs.readFileSync(path.join(brochureDir, 'brochure.html'), 'utf8');

        const template = handlebars.compile(htmlContentRaw);
        let finalHtml = template(dynamicData);

        const bitmap = fs.readFileSync(path.join(brochureDir, 'logo.webp'));
        const imageDataUri = `data:image/webp;base64,${bitmap.toString('base64')}`;
        finalHtml = finalHtml.replace('logo.webp', imageDataUri);

        await page.setContent(finalHtml, { waitUntil: 'networkidle0' });
        const pdfBuffer = await page.pdf({
            format: 'A4',
            printBackground: true,
            margin: { top: '10px', right: '10px', bottom: '10px', left: '10px' }
        });
        await browser.close();

        res.status(200).set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': 'attachment; filename=brochure.pdf',
            'Content-Length': pdfBuffer.length
        });
        res.end(pdfBuffer);
    } catch (error) {
        console.error("Error during download brochure:", error);
        res.status(500).json({
            message: helper.serverMessage
        })
    }
}
