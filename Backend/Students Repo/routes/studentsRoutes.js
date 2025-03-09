const express = require("express");
const validateToken = require("../miiddleware/validateTokenHandler")
const router = express.Router();

const { registerStudent, loginStudent, currentStudent, getStudents, createStudent, getStudent, updateStudent, deleteStudent
} = require("../controllers/studentController");



// Public routes (No authentication required)
router.post("/register", registerStudent);
router.post("/login", loginStudent);

// Private routes (Authentication required)
router.get("/current", validateToken, currentStudent);

router.route("/")
  .get(validateToken, getStudents)
  .post(validateToken, createStudent);

router.route("/:id")
  .get(validateToken, getStudent)
  .put(validateToken, updateStudent)
  .delete(validateToken, deleteStudent);

module.exports = router;
