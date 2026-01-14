// user routes ->for routing->  contains declarations for http metods -? get/post/put/delete etc..

const express = require("express")
const router = express.Router()
const verifyToken = require("../middlewares/authMiddleware.js")

const { 
    getUsers, 
    registration, 
    login 

} = require("../controllers/userController.js");


// http requests
//fetches all registered users,  from db
router.get("/",verifyToken, getUsers)
router.post("/login", login)
router.post("/register" , registration)


module.exports = router