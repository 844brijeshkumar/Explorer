
// 💡 NOTICE THE .v2 AT THE END!
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// This part stays the same
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary, // This now passes the v2-configured object
  params: {
    folder: 'explorer_DEV',
    allowedFormats: ["png" ,"jpeg" , "jpg"], // Corrected property name
  },
});

module.exports = {cloudinary, storage};