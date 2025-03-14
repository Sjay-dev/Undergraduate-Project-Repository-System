// middleware/uploadMiddleware.js
const multer = require("multer");
const path = require("path");

// Set up storage engine for Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Ensure this folder exists
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

// Check file type (for example, allow PDF, DOC, DOCX, and TXT)
function checkFileType(file, cb) {
  const filetypes = /pdf|doc|docx|txt/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);
  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb("Error: Files of type PDF, DOC, DOCX, or TXT only!");
  }
}

const upload = multer({
  storage: storage,
  limits: { fileSize: 10000000 }, // 10 MB file size limit
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});

module.exports = upload;
