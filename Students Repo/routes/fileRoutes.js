const express = require("express");
const router = express.Router();
const {
  uploadFile,
  getAllFiles,
  downloadFile,
  deleteFile,
} = require("../controllers/fileController");

// Define routes for file management
router.post("/upload", uploadFile); // POST /api/files/upload - Upload a file
router.get("/files", getAllFiles); // GET /api/files - Retrieve all files
router.get("/files/:filename", downloadFile); // GET /api/files/:filename - Download a specific file
router.delete("/files/:id", deleteFile); // DELETE /api/files/:id - Delete a file

module.exports = router;