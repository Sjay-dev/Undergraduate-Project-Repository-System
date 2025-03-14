// models/chapterSubmissionModel.js
const mongoose = require("mongoose");

const chapterSubmissionSchema = new mongoose.Schema({
  group: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Group",
    required: true,
  },
  chapterName: {
    type: String,
    required: true,
  },
  fileUrl: {
    type: String,
    required: true,
  },
  dateSubmitted: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model("ChapterSubmission", chapterSubmissionSchema);
