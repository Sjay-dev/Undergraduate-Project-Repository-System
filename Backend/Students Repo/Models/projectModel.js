const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
  projectTopic: 
  { type: String, 
    required: true 
},

  basedOn: { type: String, default: null },

  dateSubmitted: { type: Date, default: Date.now },

  projectStatus: { 
    type: String, 
    default: "pending" 
  },

  filesUploaded: [
    {
      fileId: { type: mongoose.Schema.Types.ObjectId, required: true },
      filename: { type: String, required: true },
      contentType: { type: String }
    }
  ],
  technologiesUsed: [{ type: String }]
});

module.exports = mongoose.model("Project", projectSchema);
