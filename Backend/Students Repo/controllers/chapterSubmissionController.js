const asyncHandler = require("express-async-handler");
const path = require("path");
const fs = require("fs");
const { GridFSBucket, ObjectId } = require("mongodb");
const mongoose = require("mongoose");
const ChapterSubmission = require("../Models/chapterSubmissionModel");

// Get the Mongoose connection
const conn = mongoose.connection;
let gridFSBucket = null;

// Initialize GridFSBucket once the connection is open
conn.once("open", () => {
  gridFSBucket = new GridFSBucket(conn.db, { bucketName: "uploads" });
  console.log("✅ GridFSBucket Ready");
});

// Ensure the temporary uploads directory exists
const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

/**
 * @desc    Create a new chapter submission using GridFS
 * @route   POST /api/chapterSubmissions
 * @access  Private
 */
const createChapterSubmission = asyncHandler(async (req, res, next) => {
  if (!req.file) {
    res.status(400);
    throw new Error("No file uploaded.");
  }

  const { chapterName, groupId } = req.body;
  if (!chapterName || !groupId) {
    res.status(400);
    throw new Error("Chapter name and Group ID are required.");
  }

  // Build the full path of the uploaded file
  const filePath = path.join(uploadDir, req.file.filename);
  if (!fs.existsSync(filePath)) {
    res.status(500);
    throw new Error("File not found on disk before streaming.");
  }

  // Open an upload stream to GridFS with metadata containing chapterName and groupId
  const uploadStream = gridFSBucket.openUploadStream(req.file.filename, {
    metadata: { chapterName, groupId },
  });

  fs.createReadStream(filePath)
    .pipe(uploadStream)
    .on("error", (err) => next(err))
    .on("finish", async () => {
      // Delete the temporary file after successful upload
      fs.unlinkSync(filePath);
      // Create a new ChapterSubmission document and store the GridFS file ID
      const submission = await ChapterSubmission.create({
        group: groupId,
        chapterName,
        fileId: uploadStream.id.toString(), // Store the GridFS file id
      });
      res.status(201).json(submission);
    });
});

/**
 * @desc    Get a chapter submission by its ID (metadata)
 * @route   GET /api/chapterSubmissions/:id
 * @access  Private
 */
const getChapter = asyncHandler(async (req, res) => {
  const chapter = await ChapterSubmission.findById(req.params.id);
  if (!chapter) {
    res.status(404);
    throw new Error("Chapter submission not found.");
  }
  res.json(chapter);
});

/**
 * @desc    View a chapter file inline
 * @route   GET /api/chapterSubmissions/view/:id
 * @access  Private
 */
const viewChapter = asyncHandler(async (req, res) => {
  const chapter = await ChapterSubmission.findById(req.params.id);
  if (!chapter) {
    res.status(404);
    throw new Error("Chapter submission not found.");
  }

  // Convert the stored fileId to ObjectId
  const fileId = mongoose.Types.ObjectId(chapter.fileId);
  // Retrieve file metadata from GridFS
  const file = await conn.db.collection("uploads.files").findOne({ _id: fileId });
  if (!file) {
    res.status(404);
    throw new Error("File not found in GridFS.");
  }

  res.set("Content-Disposition", `inline; filename="${file.filename}"`);
  res.set("Content-Type", file.contentType || "application/octet-stream");

  const readStream = gridFSBucket.openDownloadStream(fileId);
  readStream.pipe(res);
});

/**
 * @desc    Download a chapter file as an attachment
 * @route   GET /api/chapterSubmissions/download/:id
 * @access  Private
 */
const downloadChapter = asyncHandler(async (req, res) => {
  const chapter = await ChapterSubmission.findById(req.params.id);
  if (!chapter) {
    res.status(404);
    throw new Error("Chapter submission not found.");
  }

  const fileId = mongoose.Types.ObjectId(chapter.fileId);
  const file = await conn.db.collection("uploads.files").findOne({ _id: fileId });
  if (!file) {
    res.status(404);
    throw new Error("File not found in GridFS.");
  }

  res.set("Content-Disposition", `attachment; filename="${file.filename}"`);
  res.set("Content-Type", file.contentType || "application/octet-stream");

  const readStream = gridFSBucket.openDownloadStream(fileId);
  readStream.pipe(res);
});

/**
 * @desc    Get all chapter submissions by group ID
 * @route   GET /api/chapterSubmissions?groupId=yourGroupId
 * @access  Private
 */
const getChaptersByGroupId = asyncHandler(async (req, res) => {
  // Check for groupId in route parameters or query string
  const groupId = req.params.id || req.query.groupId;
  if (!groupId) {
    res.status(400);
    throw new Error("Group ID is required.");
  }
  const chapters = await ChapterSubmission.find({ group: groupId });
  if (!chapters || chapters.length === 0) {
    res.status(404);
    throw new Error("No chapter submissions found for the specified group.");
  }
  res.json(chapters);
});


module.exports = {
  createChapterSubmission,
  getChapter,
  viewChapter,
  downloadChapter,
  getChaptersByGroupId,
};
