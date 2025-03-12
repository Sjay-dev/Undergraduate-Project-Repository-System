const multer = require("multer");
const path = require("path");

// ✅ Set up Multer Storage (Temporary)
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/"); // Ensure this folder exists in your project
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

// ✅ Initialize Multer
const upload = multer({ storage });

module.exports = upload;
