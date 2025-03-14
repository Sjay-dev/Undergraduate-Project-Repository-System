// routes/chapterSubmissionRoutes.js
const express = require("express");
const router = express.Router();
const { createChapterSubmission } = require("../controllers/chapterSubmissionController");
const upload = require("../miiddleware/uploadMiddleware"); // our multer configuration

// Route for uploading a chapter submission
// The file field name is expected to be "file"
router.post("/", upload.single("file"), createChapterSubmission);

module.exports = router;
