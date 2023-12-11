const authUser = require("../controllers/authUsers")
const express = require("express")

const authUserRouter = express.Router()

authUserRouter.post("/register",authUser.register)

authUserRouter.post("/login",authUser.login)

module.exports = authUserRouter