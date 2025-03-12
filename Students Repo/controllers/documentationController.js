// filepath: c:\Final Year Project\Backend\Students Repo\controllers\documentationController.js
const asyncHandler = require("express-async-handler");
const Documentation = require("../Models/documentationModel");
const Group = require("../Models/groupModel");
const Student = require("../Models/studentModel");

// @desc Get all documentation entries for groups owned by the lecturer
// @route GET /api/documentations
// @access private

const getDocumentations = asyncHandler(async (req, res) => {
  const documentations = await Documentation.find().populate({
    path: "group",
    select: "user_id groupName",
    match: { user_id: req.user.id } // Only populate if the group belongs to this lecturer
  });

  // Remove entries that do not have a populated group (i.e. the lecturer doesn't own the group)
  const filteredDocs = documentations.filter(doc => doc.group);
  res.status(200).json(filteredDocs);
});

// @desc Create a new documentation entry
// @route POST /api/documentations
// @access private

const createDocumentation = asyncHandler(async (req, res) => {
  const { projectTopic, projectDescription, projectObjective, chapterNumber, chapterDocument, chapterStatus } = req.body;

  // Validate required fields
  if (!projectTopic || !projectDescription || !projectObjective || !chapterNumber || !chapterDocument || !chapterStatus) {
    return res.status(400).json({ error: "All fields must be filled" });
  }

  // Get student ID from request (assumes req.student is populated by authentication middleware)
  const studentId = req.student.id;

  // Fetch the group where the student is a member (assuming a student belongs to a single group)
  const studentGroup = await Group.findOne({ students: studentId });
  
  if (!studentGroup) {
    return res.status(404).json({ error: "Student does not belong to any group" });
  }

  // Create the documentation entry with the retrieved group ID
  const documentation = await Documentation.create({
    groupID: studentGroup._id,
    projectTopic,
    projectDescription,
    projectObjective,
    chapterNumber,
    chapterDocument,
    chapterStatus,
  });

  return res.status(201).json(documentation);
});

// @desc Get a single documentation entry by id
// @route GET /api/documentations/:id
// @access private
const getDocumentation = asyncHandler(async (req, res) => {
  const documentation = await Documentation.findById(req.params.id).populate("group", "user_id groupName");

  if (!documentation) {
    res.status(404);
    throw new Error("Documentation not found");
  }

  // Verify permission: check that the group associated with the documentation belongs to the lecturer
  if (documentation.group.user_id.toString() !== req.user.id) {
    res.status(403);
    throw new Error("User doesn't have permission to view this documentation");
  }

  res.status(200).json(documentation);
});

// @desc Update a documentation entry
// @route PUT /api/documentations/:id
// @access private
const updateDocumentation = asyncHandler(async (req, res) => {
  const documentation = await Documentation.findById(req.params.id).populate("group", "user_id");

  if (!documentation) {
    res.status(404);
    throw new Error("Documentation not found");
  }

  const updatedDocumentation = await Documentation.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.status(200).json(updatedDocumentation);
});

// @desc Delete a documentation entry
// @route DELETE /api/documentations/:id
// @access private
const deleteDocumentation = asyncHandler(async (req, res) => {
  const documentation = await Documentation.findById(req.params.id).populate("group", "user_id");

  if (!documentation) {
    res.status(404);
    throw new Error("Documentation not found");
  }

  // Verify permission
  if (documentation.group.user_id.toString() !== req.user.id) {
    res.status(403);
    throw new Error("User doesn't have permission to delete this documentation");
  }

  await documentation.deleteOne({ _id: req.params.id });
  res.status(200).json({ message: "Documentation deleted successfully" });
});

module.exports = {
  getDocumentations,
  createDocumentation,
  getDocumentation,
  updateDocumentation,
  deleteDocumentation,
};