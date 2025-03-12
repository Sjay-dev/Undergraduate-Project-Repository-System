const { GridFSBucket, ObjectId } = require("mongodb");
const path = require("path");
const fs = require("fs");
const mongoose = require("mongoose");

const conn = mongoose.connection;
let gridFSBucket = null;

// ✅ Ensure GridFSBucket initializes after MongoDB connects
conn.once("open", () => {
  gridFSBucket = new GridFSBucket(conn.db, { bucketName: "uploads" });
  console.log("✅ GridFSBucket Ready");
});

// ✅ Ensure "uploads/" directory exists before saving files
const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}


/**
 * ✅ Upload File to GridFS
 */
const uploadFile = async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    // ✅ Check if GridFSBucket is ready
    if (!gridFSBucket) {
      return res.status(500).json({ error: "GridFSBucket is not initialized yet." });
    }

    const filePath = path.join(uploadDir, req.file.filename);

    if (!fs.existsSync(filePath)) {
      return res.status(500).json({ error: "File not found on disk before streaming" });
    }

    const uploadStream = gridFSBucket.openUploadStream(req.file.filename);
    fs.createReadStream(filePath)
      .pipe(uploadStream)
      .on("error", (err) => next(err))
      .on("finish", () => {
        fs.unlinkSync(filePath); // ✅ Delete temp file after upload
        res.json({ message: "✅ File uploaded successfully!", fileId: uploadStream.id.toString() });
      });
  } catch (error) {
    next(error);
  }
};

/**
 * ✅ Get All Files
 */
const getAllFiles = async (req, res, next) => {
  try {
    if (!gridFSBucket) {
      return res.status(500).json({ error: "GridFSBucket is not initialized yet." });
    }

    const files = await conn.db.collection("uploads.files").find().toArray();
    if (!files.length) return res.status(404).json({ message: "No files found" });

    res.json(files);
  } catch (error) {
    next(error);
  }
};

/**
 * ✅ Download a File
 */
const downloadFile = async (req, res, next) => {
  try {
    if (!gridFSBucket) {
      return res.status(500).json({ error: "GridFSBucket is not initialized yet." });
    }

    const file = await conn.db.collection("uploads.files").findOne({ filename: req.params.filename });
    if (!file) return res.status(404).json({ error: "File not found" });

    res.set("Content-Disposition", `inline; filename="${file.filename}"`);
    res.set("Content-Type", file.contentType);
    const readStream = gridFSBucket.openDownloadStreamByName(req.params.filename);
    readStream.pipe(res);
  } catch (error) {
    next(error);
  }
};

/**
 * ✅ Delete a File
 */
const deleteFile = async (req, res, next) => {
  try {
    if (!gridFSBucket) {
      return res.status(500).json({ error: "GridFSBucket is not initialized yet." });
    }

    const fileId = new ObjectId(req.params.id);
    await gridFSBucket.delete(fileId);
    res.json({ success: true, message: "✅ File deleted successfully!" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  uploadFile,
  getAllFiles,
  downloadFile,
  deleteFile,
};
