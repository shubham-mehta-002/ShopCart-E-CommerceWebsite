const User = require("../models/user.model")
const Order = require("../models/order.model")
const Product = require('../models/product.model')
const {createInvoiceMessage, sendMail} = require("../service/mail.service.js")
const {asyncHandler} = require("../utils/asyncHandler.js")
const {ApiResponse} = require("../utils/ApiResponse.js")
const {ApiError} = require("../utils/ApiError.js")
const mongoose = require('mongoose');


const createOrderFunction = async (orderDetails, userId, session) => {
  const fetchedUser = await User.findById(userId).session(session).populate('cart.product');
  if (!fetchedUser) {
    throw new ApiError(400, "User not found");
  }

  const totalAmount = fetchedUser.cart.reduce((acc, curr) => {
    return acc + Math.floor(((100 - curr.product.discountPercentage) / 100) * curr.product.price) * curr.quantity;
  }, 0);

  const totalItems = fetchedUser.cart.reduce((acc, curr) => acc + curr.quantity, 0);
  const order = {
    user: userId,
    items: fetchedUser.cart,
    phoneNumber: orderDetails.phoneNumber,
    address: fetchedUser.address[orderDetails.addressIndex],
    paymentMethod: orderDetails.paymentMethod,
    totalAmount,
    totalItems,
    billingName: orderDetails.fullName,
    email: orderDetails.email,
  };

  const newOrder = await Order.create([order], { session });
  // Update user's order history
  fetchedUser.orderHistory = [newOrder[0]._id, ...fetchedUser.orderHistory];
  await fetchedUser.save({ session });
  return newOrder[0];
};
const updateStock = async (cart, session) => {
  for (const item of cart) {
    const product = await Product.findById(item.product).session(session);
    if (!product) {
      throw new ApiError(500, "Product not found");
    }

    let stockUpdated = false;

    for (const variation of product.variations) {
      if (variation.size === item.size) {
        for (const color of variation.colors) {
          if (color.color === item.color) {
            if (color.stock < item.quantity) {
              throw new ApiError(500, `Insufficient stock: ${color.stock} left`);
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
      await product.save({ session });
    }
  }
};
const emptyCart = async (userId, session) => {
  const fetchedUser = await User.findById(userId).session(session);
  if (!fetchedUser) {
    throw new ApiError(400, "User not found");
  }

  fetchedUser.cart = [];
  await fetchedUser.save({ session });
};

// API
const createOrder = asyncHandler(async (req, res, next) => {
  const { id: userId } = req.body.user;
  const { orderDetails } = req.body;
  const { addressIndex, paymentMethod, email, fullName, phoneNumber } = orderDetails;

  if (addressIndex === undefined || !paymentMethod || !email || !fullName || !phoneNumber) {
    return next(new ApiError(400, "Insufficient data"));
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Create order
    const newOrder = await createOrderFunction(orderDetails, userId, session);

    // Fetch user with populated cart
    const fetchedUser = await User.findById(userId).session(session).populate('cart.product');

    // Update stock
    await updateStock(fetchedUser.cart, session);

    // Empty cart
    await emptyCart(userId, session);

    // Commit transaction
    await session.commitTransaction();
    // Sending mail
    const html = createInvoiceMessage({ order: newOrder, orderId: newOrder._id });
    const subject = "Invoice Details";
    const to = fetchedUser.email;
    const text = "Invoice";


    await sendMail({ html, to, subject, text });

    return res.status(200).json(new ApiResponse(200, "Order created successfully", { newOrderId : newOrder._id, orderItems: fetchedUser.cart }));

  } catch (error) {
    console.log({error})
    // Abort transaction only if an error occurs or the transaction is still uncommitted
    if (session.inTransaction()) {
      await session.abortTransaction();
    }
    return next(error);
  } finally {
    // Always end the session, regardless of the transaction outcome
    session.endSession();
  }
});




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
      path:"items.product"
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
    fetchUserOrders,
    fetchAllOrders,
    fetchOrderById,
    updateOrder
}