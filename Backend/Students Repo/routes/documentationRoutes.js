const express = require("express");
const multer = require("multer");
const {
  uploadFile,
  downloadFile,
  deleteFile,
  getFilesByGroupId
} = require("../controllers/documentationController");

const router = express.Router();

// ✅ Multer Disk Storage (Temporary Storage Before GridFS)
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({ storage });

// ✅ Routes
router.post("/upload", upload.single("file"), uploadFile);
// router.get("/files", getAllFiles);
router.get("/files/:id", downloadFile);
router.delete("/files/:id", deleteFile);

// GET /api/files?groupId=yourGroupIdValue
router.get("/files", getFilesByGroupId);

module.exports = router;





