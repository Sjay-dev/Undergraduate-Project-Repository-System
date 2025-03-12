// filepath: c:\Final Year Project\Backend\Students Repo\middleware\validateTokenHandler.js
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");

// Middleware to validate token
const validateToken = asyncHandler(async (req, res, next) => {
  let token;

  // Check for token in headers
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded; // Attach user info to request
      next(); // Proceed to the next middleware or route handler
    } catch (error) {
      res.status(401);
      throw new Error("Not authorized, token failed");
    }
  }

  if (!token) {
    res.status(401);
    throw new Error("Not authorized, no token");
  }
});

module.exports = validateToken;