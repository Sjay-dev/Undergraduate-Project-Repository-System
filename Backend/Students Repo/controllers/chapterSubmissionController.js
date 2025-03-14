// controllers/chapterSubmissionController.js
const asyncHandler = require("express-async-handler");
const ChapterSubmission = require("../Models/chapterSubmissionModel");

// @desc    Create a new chapter submission
// @route   POST /api/chapterSubmissions
// @access  Private (ensure you use your auth middleware as needed)
const createChapterSubmission = asyncHandler(async (req, res) => {
  // The uploaded file will be available in req.file
  if (!req.file) {
    res.status(400);
    throw new Error("No file uploaded.");
  }

  const { chapterName, groupId } = req.body;
  if (!chapterName || !groupId) {
    res.status(400);
    throw new Error("Chapter name and Group ID are required.");
  }

  const submission = await ChapterSubmission.create({
    group: groupId,
    chapterName,
    fileUrl: req.file.path, // The file's saved path
    // dateSubmitted is set by default
  });

  res.status(201).json(submission);
});

module.exports = { createChapterSubmission };
