const buyer = require("../controllers/buyer")
const auth = require("../middleware/auth")
const express = require("express")

const buyerRouter = express.Router()

buyerRouter.get("/list-of-sellers",auth.authenticate,auth.checkRole("buyer"),buyer.getAllSellers)

buyerRouter.get("/seller-catalog/:seller_id",auth.authenticate,auth.checkRole("buyer"),buyer.getSpecificSellerCatalog)

buyerRouter.post("/create-order/:seller_id",auth.authenticate,auth.checkRole("buyer"),buyer.placeOrder)

module.exports = buyerRouter