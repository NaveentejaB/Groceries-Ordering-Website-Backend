const seller = require("../controllers/seller")
const auth = require("../middleware/auth")
const express = require("express")

const sellerRouter = express.Router()

sellerRouter.post("/create-catalog",auth.authenticate,auth.checkRole("seller"),seller.addItemsInCatalog)

sellerRouter.get("/orders",auth.authenticate,auth.checkRole("seller"),seller.getAllOrders)

module.exports = sellerRouter