const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const { GridFSBucket } = require("mongodb");
const Project = require("../Models/projectModel");

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
 * Create a new Project with multiple file uploads
 */
const createProject = async (req, res, next) => {
  try {
    // Retrieve fields from the request body
    const { projectTopic, basedOn, projectStatus, technologiesUsed } = req.body;
    if (!projectTopic) {
      return res.status(400).json({ error: "Project topic is required" });
    }

    // Handle technologiesUsed as a string
    const techUsed = technologiesUsed ? technologiesUsed.trim() : "";

    // Check GridFSBucket and that files are provided
    if (!gridFSBucket) {
      return res.status(500).json({ error: "GridFSBucket is not initialized yet." });
    }
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: "No files uploaded" });
    }

    const filesUploaded = [];

    // Process each file: stream it into GridFS and record its reference
    const uploadPromises = req.files.map((file) => {
      return new Promise((resolve, reject) => {
        const filePath = path.join(uploadDir, file.filename);
        if (!fs.existsSync(filePath)) {
          return reject(new Error("File not found on disk"));
        }
        const uploadStream = gridFSBucket.openUploadStream(file.filename, {
          contentType: file.mimetype,
          metadata: { projectTopic }
        });
        fs.createReadStream(filePath)
          .pipe(uploadStream)
          .on("error", (err) => reject(err))
          .on("finish", () => {
            // Remove the temporary file after successful upload
            fs.unlinkSync(filePath);
            filesUploaded.push({
              fileId: uploadStream.id,
              filename: file.filename,
              contentType: file.mimetype
            });
            resolve();
          });
      });
    });

    await Promise.all(uploadPromises);

    // Create and save the new Project document
    const project = new Project({
      projectTopic,
      basedOn: basedOn || null,
      projectStatus: projectStatus || "pending",
      filesUploaded,
      technologiesUsed: techUsed
    });

    await project.save();

    res.json({ message: "Project created successfully", project });
  } catch (error) {
    next(error);
  }
};

/**
 * Get a project by its ID
 */
const getProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }
    res.json(project);
  } catch (error) {
    next(error);
  }
};

/**
 * Update an existing Project
 *
 * Allows updating project details and adding additional files.
 */
const updateProject = async (req, res, next) => {
  try {
    // Retrieve the project to update
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    // Update fields if provided
    const { projectTopic, basedOn, projectStatus, technologiesUsed } = req.body;
    if (projectTopic) project.projectTopic = projectTopic;
    if (basedOn) project.basedOn = basedOn;
    if (projectStatus) project.projectStatus = projectStatus;

    // Handle technologiesUsed as a string if provided
    if (technologiesUsed !== undefined) {
      project.technologiesUsed = technologiesUsed.trim();
    }

    // Process additional file uploads if any
    if (req.files && req.files.length > 0) {
      const newFiles = [];
      const uploadPromises = req.files.map((file) => {
        return new Promise((resolve, reject) => {
          const filePath = path.join(uploadDir, file.filename);
          if (!fs.existsSync(filePath)) {
            return reject(new Error("File not found on disk"));
          }
          const uploadStream = gridFSBucket.openUploadStream(file.filename, {
            contentType: file.mimetype,
            metadata: { projectTopic: project.projectTopic }
          });
          fs.createReadStream(filePath)
            .pipe(uploadStream)
            .on("error", (err) => reject(err))
            .on("finish", () => {
              fs.unlinkSync(filePath);
              newFiles.push({
                fileId: uploadStream.id,
                filename: file.filename,
                contentType: file.mimetype
              });
              resolve();
            });
        });
      });

      await Promise.all(uploadPromises);
      // Append new files to existing filesUploaded array
      project.filesUploaded = project.filesUploaded.concat(newFiles);
    }

    await project.save();
    res.json({ message: "Project updated successfully", project });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete a Project and its associated files from GridFS
 */
const deleteProject = async (req, res, next) => {
  try {
    // Retrieve the project by ID
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    // Delete each file from GridFS associated with this project
    const deletePromises = project.filesUploaded.map((file) => {
      return new Promise((resolve, reject) => {
        gridFSBucket.delete(file.fileId, (err) => {
          if (err) return reject(err);
          resolve();
        });
      });
    });
    await Promise.all(deletePromises);

    // Remove the project document
    await project.remove();
    res.json({ message: "Project deleted successfully" });
  } catch (error) {
    next(error);
  }
};

/**
 * Download a file from GridFS by fileId
 */
const downloadFile = async (req, res, next) => {
  try {
    const fileId = mongoose.Types.ObjectId(req.params.fileId);
    // Find the file document in GridFS
    const file = await conn.db.collection("uploads.files").findOne({ _id: fileId });
    if (!file) {
      return res.status(404).json({ error: "File not found" });
    }
    res.set("Content-Disposition", `attachment; filename="${file.filename}"`);
    res.set("Content-Type", file.contentType || "application/octet-stream");
    // Stream the file from GridFS
    const readStream = gridFSBucket.openDownloadStream(fileId);
    readStream.pipe(res);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createProject,
  getProject,
  updateProject,
  deleteProject,
  downloadFile
};
