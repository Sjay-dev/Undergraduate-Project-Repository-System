const mongoose = require("mongoose");
const multer = require("multer");
const { GridFSBucket } = require("mongodb");
const path = require("path");
const fs = require("fs");

const conn = mongoose.connection;
let gridFSBucket;

conn.once("open", () => {
  gridFSBucket = new GridFSBucket(conn.db, { bucketName: "uploads" });
});

const uploadFile = async (req, res) => {
  const storage = multer.memoryStorage();
  const upload = multer({ storage }).single("file");

  upload(req, res, async (err) => {
    if (err) {
      return res.status(500).json({ error: "File upload failed" });
    }

    const uploadStream = gridFSBucket.openUploadStream(req.file.originalname);
    uploadStream.end(req.file.buffer);

    uploadStream.on("finish", () => {
      res.status(201).json({ message: "File uploaded successfully", fileId: uploadStream.id });
    });

    uploadStream.on("error", () => {
      res.status(500).json({ error: "File upload failed" });
    });
  });
};

const getAllFiles = async (req, res) => {
  const files = await gridFSBucket.find().toArray();
  res.status(200).json(files);
};

const downloadFile = async (req, res) => {
  const fileId = req.params.filename;
  const downloadStream = gridFSBucket.openDownloadStream(fileId);

  downloadStream.on("error", () => {
    res.status(404).json({ error: "File not found" });
  });

  downloadStream.pipe(res);
};

const deleteFile = async (req, res) => {
  const fileId = req.params.id;
  await gridFSBucket.delete(fileId);
  res.status(200).json({ message: "File deleted successfully" });
};

module.exports = {
  uploadFile,
  getAllFiles,
  downloadFile,
  deleteFile,
};