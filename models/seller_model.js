const mongoose = require("mongoose")

const productSchmea = new mongoose.Schema({
    productName : {
        type:String,
        required:true,
        unique:true
    },
    productPrice : {
        type : Number,
        required : true
    }
}, { _id : false })

const orderSchema  = new mongoose.Schema({
    buyerId : String,
    productName : String
}, { _id : false })

const sellerSchmea = new mongoose.Schema({
    sellerId :{
        required : true,
        type: String,
        unique: true
    },
    sellerName :{
        required : true,
        unique : true,
        type: String
    },
    sellerPassword : {
        required : true,
        type: String
    },
    calatog :{
        type:[productSchmea],
        max : 1
    },
    ordersRecieved : [orderSchema],
    role : {
        type:String,
        default : "seller"
    }
})

const Seller = mongoose.model('Seller',sellerSchmea)

module.exports = Seller