const Buyer = require("../models/buyer_model")
const Seller = require("../models/seller_model")
const jwt = require("jsonwebtoken")

module.exports.getAllSellers = async(req,res) => {
    const sellers = await Seller.find({})
    return res.status(200).json({
            sellers:sellers,
            message:`fetched all the sellers`,
            success : true
        })
}

module.exports.getSpecificSellerCatalog = async(req,res) => {
    const seller = await Seller.findOne({sellerId:req.params.seller_id})
    if(!seller)
        return res.status(404).json({
                    message : `No seller exists with id : ${req.params.seller_id}`,
                    success : false
                })
    return res.status(200).json({
                products : seller.calatog,
                message:`fetched all the products in calatog of the ${seller.sellerName}`,
                success : true
            })
}

module.exports.placeOrder = async(req,res) => {
    const {orders} = req.body
    const seller = await Seller.findOne({sellerId:req.params.seller_id})
    if(!seller)
        return res.status(404).json({
            message : `No seller exists with id : ${req.params.seller_id}`,
            success : false
        })
    
    //update the buyer orderplaced
    const buyerOrders = orders.map( product => {
        return {
            sellerId : req.params.seller_id,
            productName : product
        }
    })
    const token = req.headers["x-access-token"]
	const decoded = jwt.decode(token)
    const buyer = await Buyer.findOne({_id:decoded.id})
    const updateBuyer = await Buyer.findOneAndUpdate({buyerId:buyer.buyerId},{
        $push : { ordersPlaced :{$each : buyerOrders}}
    })
    //update the seller
    const sellerOrders = orders.map( product => {
        return {
            buyerId : buyer.buyerId,
            productName : product
        }
    } )
    const updateSeller = await Seller.findOneAndUpdate({sellerId:req.params.seller_id},{
        $push : { ordersRecieved :{$each : sellerOrders}}
    })
    return res.status(200).json({
            orders : orders,
            message:`placed the above orders successfully.`,
            success : true
        })
}