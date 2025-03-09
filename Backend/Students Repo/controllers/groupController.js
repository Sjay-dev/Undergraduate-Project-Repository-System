const asyncHandler = require("express-async-handler");
const Group = require("../Models/groupModel");

// @desc Get all groups
// @route GET /api/groups
// @access private
const getGroups = asyncHandler(async (req, res) => {
    const groups = await Group.find({ user_id: req.user.id }).populate({
      path: "students",
      select: "name email level matric_number department" // Select only required fields
    });
  
    res.status(200).json(groups);
  });
  

// @desc Create a new group
// @route POST /api/groups
// @access private
const createGroup = asyncHandler(async (req, res) => {
    console.log("Console output", req.body);

    const { groupName, department, projectTopic, students} = req.body;

    if (!groupName || !department || !projectTopic || !students ) {
        res.status(400);
        throw new Error("All fields must be filled");
    }

    const group = await Group.create({
        groupName,
        department,
        projectTopic,
        students,
        user_id: req.user.id
    });

    res.status(201).json(group);
});

// @desc Get a single group
// @route GET /api/groups/:id
// @access private
const getGroup = asyncHandler(async (req, res) => {
    const group = await Group.findById(req.params.id).populate("lecturer students", "name email");

    if (!group) {
        res.status(404);
        throw new Error("Group not found");
    }

    res.status(200).json(group);
});

// @desc Update a group
// @route PUT /api/groups/:id
// @access private
const updateGroup = asyncHandler(async (req, res) => {
    const group = await Group.findById(req.params.id);

    if (!group) {
        res.status(404);
        throw new Error("Group not found");
    }

    if (group.user_id.toString() !== req.user.id) {
        res.status(403);
        throw new Error("User doesn't have permission to update this group");
    }

    const updatedGroup = await Group.findByIdAndUpdate(req.params.id, req.body, { new: true });

    res.status(200).json(updatedGroup);
});

// @desc Delete a group
// @route DELETE /api/groups/:id
// @access private
const deleteGroup = asyncHandler(async (req, res) => {
    const group = await Group.findById(req.params.id);

    if (!group) {
        res.status(404);
        throw new Error("Group not found");
    }

    if (group.user_id.toString() !== req.user.id) {
        res.status(403);
        throw new Error("User doesn't have permission to delete this group");
    }

    await group.deleteOne({ _id: req.params.id });

    res.status(200).json({ message: "Group deleted successfully" });
});

module.exports = { getGroups, createGroup, getGroup, updateGroup, deleteGroup };
