const express = require("express");
const router = express.Router();

const {getGroups , createGroup , getGroup , getStudentGroups , updateGroup , deleteGroup} = require("../controllers/groupController")

const validateToken = require("../miiddleware/validateTokenHandler");


router.use(validateToken)

// Get all groups
router.route("/").get(getGroups)
.get(getStudentGroups)

// Create a new group
.post(createGroup);

// Get a specific group
router.route("/:id")
.get(getGroup)

// Update a group
.put(updateGroup)

// Delete a group
.delete(deleteGroup);

module.exports = router;
