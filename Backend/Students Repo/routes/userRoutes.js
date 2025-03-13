const express = require("express")
const { registerUser, loginUser, currentUser , getUser } = require("../controllers/userController")
const validateToken = require("../miiddleware/validateTokenHandler")

const router = express.Router()

router.post("/register" , registerUser)

router.post("/login" , loginUser)

router.get("/current", validateToken ,  currentUser)

router.get("/:id", validateToken, getUser);


module.exports = router