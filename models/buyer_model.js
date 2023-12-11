const mongoose = require("mongoose")

const orderSchema  = new mongoose.Schema({
    sellerId : String,
    productName : String
}, { _id : false })

const buyerSchmea = new mongoose.Schema({
    buyerId :{
        required : true,
        type: String,
        unique: true
    },
    buyerName :{
        required : true,
        unique : true,
        type: String
    },
    buyerPassword : {
        required : true,
        type: String
    },
    ordersPlaced : [orderSchema],
    role : {
        type:String,
        default : "buyer"
    }
})

const Buyer = mongoose.model('Buyer',buyerSchmea)

module.exports = Buyer