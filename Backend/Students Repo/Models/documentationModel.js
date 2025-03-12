const mongoose = require("mongoose");

const documentationSchema = new mongoose.Schema(
  {

       groupID: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: "Group" // Reference to the Student Group
        },
 
    projectTopic: {
      type: String,
      required: true,
    },

    projectDescription: {
      type: String,
      required: true,
    },

    projectObjective: {
      type: String,
      required: true,
    },

    chapterNumber: {
      type: String,
      required: true,
    },

   chapterDocument: {
      type: String,
      required: true,
    },

    
    chapterStatus: {
      type: String,
      required: true,
    }
    
  },

  {
    timestamps: true // Automatically adds createdAt and updatedAt fields
  }
);

module.exports = mongoose.model("Documentation", documentationSchema);
