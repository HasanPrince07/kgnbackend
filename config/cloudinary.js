const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
require('dotenv').config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    const isPdf = file.mimetype === 'application/pdf';
    return {
      folder: 'kgn_electrodes',
      resource_type: isPdf ? 'raw' : 'image', 
      allowed_formats: isPdf ? ['pdf'] : ['jpg', 'jpeg', 'png', 'webp'],
      transformation: isPdf ? [] : [{ width: 1000, crop: 'limit' }]
    };
  }
});

const uploadCloud = multer({ storage: storage });

module.exports = { cloudinary, uploadCloud };
