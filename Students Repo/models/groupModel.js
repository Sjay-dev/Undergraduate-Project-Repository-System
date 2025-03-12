const mongoose = require("mongoose");

const groupSchema = new mongoose.Schema({
  groupName: {
    type: String,
    required: true,
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  students: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
  }],
}, {
  timestamps: true,
});

module.exports = mongoose.model("Group", groupSchema);