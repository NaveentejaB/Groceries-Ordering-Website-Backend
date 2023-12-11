const Seller = require("../models/seller_model")
const jwt = require("jsonwebtoken")

module.exports.addItemsInCatalog = async(req,res) =>{
    const token = req.headers["x-access-token"]
	const decoded = jwt.decode(token)
    const {items} = req.body
    const seller = await Seller.findOne({ _id : decoded.id })
    const catalogData = await Seller.findOneAndUpdate({ sellerId : seller.sellerId },{
        $addToSet:{ calatog : { $each : items} }
    })
    res.status(201).json({
        products : items,
        message : `added new items into catalog`,
        success : true
    })
}

module.exports.getAllOrders = async(req,res) => {
    const token = req.headers["x-access-token"]
	const decoded = jwt.decode(token)
    const orders = await Seller.findOne({_id : decoded.id})
    res.status(200).json({
        orders : orders.ordersRecieved,
        message : `fetched all the recieved orders`,
        success : true
    })
}