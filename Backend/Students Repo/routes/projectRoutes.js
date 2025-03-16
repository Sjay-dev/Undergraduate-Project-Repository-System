const express = require("express");
const multer = require("multer");
const path = require("path");
const projectController = require("../controllers/projectController");

const router = express.Router();

// Set up Multer storage for temporary file saving
const uploadDir = path.join(__dirname, "../uploads");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Prepend a timestamp for uniqueness
    cb(null, Date.now() + "-" + file.originalname);
  }
});
const upload = multer({ storage });

// POST route to create a new project with multiple file uploads
router.post("/", upload.array("files"), projectController.createProject);

// GET route to retrieve a single project by ID
router.get("/:id", projectController.getProject);

// PUT route to update an existing project (details and additional files)
router.put("/:id", upload.array("files"), projectController.updateProject);

// DELETE route to delete a project and its associated files
router.delete("/:id", projectController.deleteProject);

// GET route to download a file from GridFS using fileId
router.get("/download/:fileId", projectController.downloadFile);

module.exports = router;
