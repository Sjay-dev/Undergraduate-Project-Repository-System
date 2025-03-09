const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add student name"]
    },

    email: {
      type: String,
      required: [true, "Please add school email address"],
      unique: true, // Ensures no duplicate emails
      trim: true
    },
    
    password: {
      type: String,
      required: [true, "Please enter your password"],
      minlength: [8, "Password must be at least 8 characters long"],
    },

    matric_number: {
      type: String,
      required: [true, "Please add matric number"],
      unique: true // Ensures no duplicate matric numbers
    },

    level: {
      type: String,
      required: [true, "Please enter Level"]
    },

    department: {
      type: String,
      required: [true, "Please enter Department"]
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Student", studentSchema);
