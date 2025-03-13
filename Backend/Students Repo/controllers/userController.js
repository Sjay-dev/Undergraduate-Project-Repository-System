const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../Models/userModel");

// @desc Register a Lecturer
// @route POST /api/users/register
// @access Public
const registerUser = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  if (!firstName || !lastName || !email || !password) {
    res.status(400);
    throw new Error("All fields are mandatory!");
  }

  const userAvailable = await User.findOne({ email });

  if (userAvailable) {
    res.status(400);
    throw new Error("User already registered!");
  }

  // Hash Password
  const hashedPassword = await bcrypt.hash(password, 10);
  console.log("Hashed Password:", hashedPassword);

  const user = await User.create({
    firstName,
    lastName,
    email,
    password: hashedPassword,
  });

  console.log(`User created: ${user}`);

  if (user) {
    res.status(201).json({
      _id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    });

  } 
  
  else {
    res.status(400);
    throw new Error("User data is invalid");
  }
});

// @desc Login Lecturer
// @route POST /api/users/login
// @access Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error("All fields are mandatory!");
  }

  const user = await User.findOne({ email });

  // Compare password with hashed password
  if (user && (await bcrypt.compare(password, user.password))) {
    const accessToken = jwt.sign(
      {
        user: {
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          id: user.id
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "40m" }
    );

    if (user) {
      res.status(200).json({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        accessToken 
      });
  
      } else {
      res.status(404);
      throw new Error("User not found");
    }
 
    
  } else {
    res.status(401);
    throw new Error("Email or password is not valid");
  }
});

// @desc Get Current User Info
// @route GET /api/users/current
// @access Private
const currentUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).select("-password"); // Exclude password

  if (user) {
    res.status(200).json({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    });

    } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc Get specific user info
// @route GET /api/users/:id
// @access Private
const getUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");
  if (user) {
    res.status(200).json(user);
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});


module.exports = { registerUser, loginUser, currentUser , getUser };
