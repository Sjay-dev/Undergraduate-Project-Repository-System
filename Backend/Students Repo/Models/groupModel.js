const mongoose = require("mongoose");

const groupSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User" // Reference to the User (lecturer) model
    },

    groupName: {
      type: String,
      required: [true, "Please add group name"]
    },

    department: {
      type: String,
      required: [true, "Please add department"]
    },

    projectTopic: {
      type: String,
      required: [true, "Please add project topic"]
    },

  

    students: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student",
        required: [true, "Please add at least one student"]
      }
    ] ,

    lecturer: {
      type: String,
      required: [true, "Please add name of lecturer"]
    },
  
  
  
  },
    
  {
    timestamps: true
  }

);

module.exports = mongoose.model("Group", groupSchema);
