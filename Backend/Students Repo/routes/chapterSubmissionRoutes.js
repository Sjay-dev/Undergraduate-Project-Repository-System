const express = require("express");
const router = express.Router();
const { 
  createChapterSubmission, 
  getChapter, 
  viewChapter, 
  downloadChapter,
  getChaptersByGroupId
} = require("../controllers/chapterSubmissionController");
const upload = require("../miiddleware/uploadMiddleware"); // our multer configuration

// Route for uploading a chapter submission
// The file field name is expected to be "file"
router.post("/", upload.single("file"), createChapterSubmission);

// Route for retrieving all chapter submissions by group ID (using query parameter)
router.get("/group/:id", getChaptersByGroupId);

// Route for viewing the chapter file inline
router.get("/view/:id", viewChapter);

// Route for downloading the chapter file as an attachment
router.get("/download/:id", downloadChapter);

// Route for retrieving chapter submission details by ID
router.get("/:id", getChapter);

module.exports = router;
