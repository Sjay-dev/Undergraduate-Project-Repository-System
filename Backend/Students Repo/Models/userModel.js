const mongoose = require("mongoose")

const userSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "Please enter your first name"],
    },

    lastName: {
      type: String,
      required: [true, "Please enter your last name"],
    },

    email: {
      type: String,
      required: [true, "Please enter your email address"],
      unique: [true, "Email address already taken"],
    },

    password: {
      type: String,
      required: [true, "Please enter your password"],
      minlength: [8, "Password must be at least 8 characters long"],
    },
  },

  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
