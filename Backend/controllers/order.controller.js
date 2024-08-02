const User = require("../models/user.model")
const Order = require("../models/order.model")
const Product = require('../models/product.model')
const {createInvoiceMessage, sendMail} = require("../service/mail.service.js")
const {asyncHandler} = require("../utils/asyncHandler.js")
const {ApiResponse} = require("../utils/ApiResponse.js")
const {ApiError} = require("../utils/ApiError.js")

// TODO : Break this into 3 apis and also do separately on the frontend 
const createOrder = asyncHandler(async (req, res,next) => {
      const { id: userId } = req.body.user;
      const { orderDetails } = req.body;

      const { addressIndex, paymentMethod, email, fullName, phoneNumber } = orderDetails;
      
      // Check all required fields
      if ( addressIndex===undefined || !paymentMethod || !email || !fullName || !phoneNumber) {
          return next(new ApiError(400,"Insufficient data"))
      }
  
      // Fetch user with populated cart
      const fetchedUser = await User.findById(userId).populate('cart.product');
  
      if (!fetchedUser) {
        return next(new ApiError(400,"User not found"))
      }
  
      // Calculate total amount and total items
      const totalAmount = fetchedUser.cart.reduce((acc, curr) => {
        return acc + Math.floor(((100 - curr.product.discountPercentage) / 100) * curr.product.price) * curr.quantity;
      }, 0);
  
      const totalItems = fetchedUser.cart.reduce((acc, curr) => acc + curr.quantity, 0);
      const order = {
        user: userId,
        items: fetchedUser.cart,
        phoneNumber,
        address: fetchedUser.address[addressIndex],
        paymentMethod,
        totalAmount,
        totalItems,
        billingName:fullName,
        email:email
      };
     
      
      // Create order
      const newOrder = await Order.create(order);
      const newOrderId = newOrder._id;
  
      // Update user's order history
      fetchedUser.orderHistory = [newOrderId, ...fetchedUser.orderHistory];
  
      // Reduce stock from products
      for (const item of fetchedUser.cart) {
        const product = await Product.findById(item.product);
  
        if (!product) {
          return next(new ApiError(500,"Product not found"))
          // return res.status(500).json({ success: false, message: "Product not found" });
        }
  
        let stockUpdated = false;
  
        for (const variation of product.variations) {
          if (variation.size === item.size) {
            for (const color of variation.colors) {
              if (color.color === item.color) {
                if (color.stock < item.quantity) {
                  return next(new ApiError(500,`Insufficient stock: ${color.stock} left`))
                  // return res.status(500).json({ success: false, message: `Insufficient stock: ${color.stock} left` });
                } else {
                  color.stock -= item.quantity;
                  product.stock -= item.quantity;
                  stockUpdated = true;
                }
              }
            }
          }
        }
  
        if (stockUpdated) {
          await product.save();
        }
      }

      // removing items from cart

      fetchedUser.cart = []

      // Save updated user
      await fetchedUser.save();

      // sending mail
      const html = createInvoiceMessage({order , orderId : newOrderId})
      const subject = "Invoice Details"
      const to = fetchedUser.email
      const text= "Invoice"

      await sendMail({
        html,
        to,
        subject,
        text
      })

      return res.status(200).json(new ApiResponse(200, "Order created successfully", {newOrderId,orderItems:order.items}))
  
  }
 )
  
// TODO : Convert this inot sinple api in users.controller.js
const fetchUserDetails = asyncHandler(async(req,res,next) =>{
        const {id:userId}= req.body.user
        const fetchedUser = await User.findById(userId).populate('address')
        if(!fetchedUser){
          return next(new ApiError(400,"User not found"))
        }
        
        const {address , email , fullName , phoneNumber} = fetchedUser

        const userDetails = {address , email , fullName ,phoneNumber}

        return res.status(200).json(new ApiResponse(200,"User details fetched successfully", userDetails))
        
})

const fetchUserOrders = asyncHandler(async(req,res,next)=>{
 
      const {id : userId} =  req.body.user
      
      const fetchedUser = await User.findById(userId).populate({
            path: 'orderHistory',
            populate: {
              path: 'items.product',
              select:"-reviews -rating -images -deleted -stock -variations -__v "
              }
            })
      if(! fetchedUser ){
          return next(new ApiError(400,"User not found"))
      }

      const orders = fetchedUser.orderHistory

      return res.status(200).json(new ApiResponse(200,"Orders fetched Successfully",orders))
     
})

const fetchAllOrders = asyncHandler(async(req,res,next)=>{
 
    let query = Order.find().populate({
      path:"items.product"
    })
    let totalOrdersQuery = Order.find()

    if(req.query._sort){
      query = query.sort({[req.query._sort] : parseInt(req.query._order ) || 1})
    }

    const page =  parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 15

    query = query.skip( (page -1) * limit ).limit(limit)
    const totalOrders = await totalOrdersQuery.countDocuments()
    const orders = await query.exec();
    
    return res.status(200).json(new ApiResponse(200,"Successfully fetched orders", {totalOrders ,orders}))
  }
)

const fetchOrderById = asyncHandler(async(req,res,next)=>{
    const {orderId} = req.params
    if(!orderId){
      return next(new ApiError(400,"Order Id not found"))
    }

    const order = await Order.findById(orderId).populate({
      path:"items.product",
      select:""
    })

    if(!order){
      return next(new ApiError(400,`No Order found with OrderID ${orderId}`))
    }
    return res.status(200).json(new ApiResponse(200,"Order fetched successfully",order)) 


})

const updateOrder = asyncHandler(async(req,res,next)=>{
  

    const { updatedOrderDetails } = req.body
    const {orderId} = req.params
    if(!orderId){
      return next(new ApiError(400,"Order Id not found"))
    }

    const updatedOrder = await Order.findByIdAndUpdate(orderId , {...updatedOrderDetails},{new:true})
    if(!updateOrder){
      return next(new ApiError(400,`No Order found with OrderID ${orderId}`))
    }

    return res.status(200).json(new ApiResponse(200,"Order Updated successfully"))

})

module.exports = {
    createOrder , 
    fetchUserDetails,
    fetchUserOrders,
    fetchAllOrders,
    fetchOrderById,
    updateOrder
}