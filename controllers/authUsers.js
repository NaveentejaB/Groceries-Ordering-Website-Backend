const Seller = require("../models/seller_model")
const Buyer = require('../models/buyer_model')
const bcrypt = require("bcrypt")
const { v4: uuidv4 } = require('uuid')
const jwt = require("jsonwebtoken")

module.exports.register = async(req,res) =>{
    const {username, password, type} = req.body
    if(type === "buyer"){
        const buyer = await Buyer.findOne({buyerName:username})
        if(buyer !== null ){
            return res.status(400).json({
                    message : `buyer name already exists.`,
                    success : false    
                })
        }  
        var salt = await bcrypt.genSalt(Number(process.env.SALT))
        var hashPassword = await bcrypt.hash(password, salt)
        const buyerId = uuidv4()
        await new Buyer({
            buyerName : username,
            buyerPassword : hashPassword,
            buyerId
        }).save()
        return res.status(201).json({
                message : `buyer account created successfully.`,
                success : true
            })
    }
    if(type === "seller"){
        const seller = await Seller.findOne({sellerName:username})
        if(seller !== null){
            return res.status(400).json({
                message : `seller name already exists.`,
                success : false    
            })
        }   
        salt = await bcrypt.genSalt(Number(process.env.SALT))
        hashPassword = await bcrypt.hash(password, salt)
        const sellerId = uuidv4()
        
        await new Seller({
            sellerName:username,
            sellerPassword : hashPassword,
            sellerId
        }).save()
        return res.status(201).json({
            message : `seller account created successfully.`,
            success : true
        })
    }
}

module.exports.login = async(req,res) => {
    const {username, password, type} = req.body
    if(type === "seller"){
        const seller = await Seller.findOne({sellerName:username}) 
        if(!seller){
            return res.status(401).json({
                message : `user with username : ${username} does't exists.`,
                success : false
            })
        }
        const verifiedPassword = await bcrypt.compare(
			password,
			seller.sellerPassword
		)
        if (!verifiedPassword)
            return res.redirect(401,"/login").json({ 
                success: false, 
                message: "Invalid  password" 
            })
		
		const payload = { id:seller._id , role :"seller"}

		const accessToken = jwt.sign(
			payload,
			process.env.ACCESS_TOKEN_PRIVATE_KEY,
			{ expiresIn: "30m" }
		)	
		return res.status(200).json({
            redirectUrl :"/api/seller/:"+seller.sellerId+"/orders",
			accessToken,
			success: true,
			message: "Logged in sucessfully",
		})
    }
    if(type === "buyer"){
        const buyer = await Buyer.findOne({buyerName:username})
        if(!buyer){
            return res.redirect(401,"/login").json({
                message : `buyer with username : ${username} does't exists.`,
                success : false
            })
        }
        const verifiedPassword = await bcrypt.compare(
			password,
			buyer.buyerPassword
		)
        if (!verifiedPassword)
            return res.redirect(401,"/login").json({ 
                success: false, 
                message: "Invalid password" 
            })
			
		const payload = { id:buyer._id , role :"buyer"}

		const accessToken = jwt.sign(
			payload,
			process.env.ACCESS_TOKEN_PRIVATE_KEY,
			{ expiresIn: "30m" }
		)	
		res.status(200).json({
			accessToken,
			success: true,
			message: "Logged in sucessfully",
		})
    }
}


