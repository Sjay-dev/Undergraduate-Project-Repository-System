const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");

const validateToken = asyncHandler(async (req, res, next) => {
    let token;
    let authHeader = req.headers.Authorization || req.headers.authorization;

    if (authHeader && authHeader.startsWith("Bearer")) {
        token = authHeader.split(" ")[1];

        if (!token) {
            res.status(401);
            throw new Error("User is not authorized or token is missing in request");
        }

        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
            if (err) {
                res.status(401);
                throw new Error("User is not authorized");
            }

            // Separately handle user and student roles
            if (decoded.user) {
                req.user = decoded.user; // If it's a user, attach to req.user
            }
            if (decoded.student) {
                req.student = decoded.student; // If it's a student, attach to req.student
            }

            next();
        });
    } else {
        res.status(401);
        throw new Error("User is not authorized, no token provided");
    }
});

module.exports = validateToken;
