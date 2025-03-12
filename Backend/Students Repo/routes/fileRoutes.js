const express = require("express");
const multer = require("multer");
const {
  uploadFile,
  getAllFiles,
  downloadFile,
  deleteFile,
} = require("../controllers/fileController");

const router = express.Router();

// ✅ Multer Disk Storage (Temporary Storage Before GridFS)
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({ storage });

// ✅ Routes
router.post("/upload", upload.single("file"), uploadFile);
router.get("/files", getAllFiles);
router.get("/files/:filename", downloadFile);
router.delete("/files/:id", deleteFile);

module.exports = router;
