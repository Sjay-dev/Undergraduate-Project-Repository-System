const mongoose = require("mongoose");

const documentationSchema = new mongoose.Schema({
  groupID: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Group",
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
    type: Number,
    required: true,
  },
  chapterDocument: {
    type: String,
    required: true,
  },
  chapterStatus: {
    type: String,
    required: true,
    enum: ["draft", "submitted", "approved", "rejected"],
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model("Documentation", documentationSchema);