// filepath: c:\Final Year Project\Backend\Students Repo\routes\documentationRoutes.js
const express = require("express");
const router = express.Router();
const { getDocumentations, createDocumentation, getDocumentation, updateDocumentation, deleteDocumentation } = require("../controllers/documentationController");
const validateToken = require("../middleware/validateTokenHandler");

// Routes for documentation
router.use(validateToken);

router.route("/")
  .get(getDocumentations)    // GET /api/documentations - Get all documentation entries
  .post(createDocumentation);  // POST /api/documentations - Create a new documentation entry

router.route("/:id")
  .get(getDocumentation)       // GET /api/documentations/:id - Get a single documentation entry
  .put(updateDocumentation)    // PUT /api/documentations/:id - Update a documentation entry
  .delete(deleteDocumentation); // DELETE /api/documentations/:id - Delete a documentation entry

module.exports = router;