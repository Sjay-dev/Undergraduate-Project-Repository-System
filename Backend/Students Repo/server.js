const express = require("express");
const cors = require("cors");
const errorHandler = require("./miiddleware/errorHandler");
const connectDb = require("./config/dbConnection");
const dotenv = require("dotenv").config();

// Connect to Database
connectDb();

const app = express();
const port = process.env.PORT || 5000;

//  Enable CORS
app.use(cors({
    origin: "http://127.0.0.1:5500", // Change this to match your frontend URL
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: "Content-Type,Authorization"
}));

// Middleware to parse JSON requests
app.use(express.json());

// API Routes
app.use("/api/students", require("./routes/studentsRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/groups" , require("./routes/groupsRoutes"))
app.use('/api', require('./routes/documentationRoutes'));



// Error Handling Middleware
app.use(errorHandler);

// Start Server
app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});


