const User = require('../models/user.model');
const {asyncHandler} = require("../utils/asyncHandler")
const {ApiError} = require("../utils/ApiError")
const {ApiResponse} = require("../utils/ApiResponse")

const addToCart = asyncHandler(async (req, res,next) => {

    const { productDetails, user } = req.body;
    const { productId, quantity, color, colorCode, size } = productDetails;
    const { id: userId } = user;
    
    const fetchedUser = await User.findById(userId).populate({
      path: 'cart.product',
      select: 'thumbnail quantity price title description discountPercentage'
    });

    if (!fetchedUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Check if the product is already in the cart
    const isProductAlreadyInCart = fetchedUser.cart.find(
      item => item.product._id.toString() === productId.toString() && item.color === color && item.size === size
    );

    if (isProductAlreadyInCart) {
      // Update the quantity if already in the cart
      if (isProductAlreadyInCart.quantity + quantity > 5) {
        return next(new ApiError(400,"Max 5 allowed"))
        // return res.status(400).json({ success: false, message: "Max limit reached" });
      }
      isProductAlreadyInCart.quantity += quantity;
    } else {
      // Add new item to cart
      const itemToBeAddedToCart = { product: productId, quantity, size, color, colorCode };
      fetchedUser.cart.push(itemToBeAddedToCart);
    }

    await fetchedUser.save({ validateBeforeSave: false });

    return res.status(200).json(new ApiResponse(200,"Added to Cart",  fetchedUser.cart))
   
})



const reduceQuantity = asyncHandler(async (req, res,next) => {
 
    const { productDetails, user } = req.body;
    const { productId, quantity, color, colorCode, size } = productDetails;
    const { id: userId } = user;
    
    const fetchedUser = await User.findById(userId).populate({
      path: 'cart.product',
      select: 'thumbnail quantity price title description discountPercentage'
    })

    if (!fetchedUser) {
      return next(new ApiError(404,"User not found" ))
    }
    const existingProduct = fetchedUser.cart.find(
      (item) =>
      item.product._id.toString() === productId.toString() &&
        item.color === color &&
        item.size === size
    );

    if(!existingProduct){
      return next(new ApiError(400,"No product found"))
    }

    // Convert Mongoose documents to plain JavaScript objects
    let cartItems = fetchedUser.cart.map(item => item.toObject());

    let updatedCart =[]

    if(existingProduct.quantity === 1){
      updatedCart = cartItems.filter(item => 
        item.product._id.toString() === productId.toString() && item.color === color && item.size === size ? false : true
      )
    }else{
      updatedCart = cartItems.map(item => 
        item.product._id.toString() === productId.toString() && item.color === color && item.size === size ? {...item,quantity:item.quantity-1} : {...item}
      )
    }

    fetchedUser.cart = updatedCart;
    await fetchedUser.save();

    return res.status(200).json(new ApiResponse(200,"Quantity updated successfully",fetchedUser.cart))

})


const cartItems = asyncHandler(async (req,res,next)=> {
        const { id:userId } = req.body.user
        const user = await User.findById(userId).populate({
            path: 'cart.product',
            select : 'thumbnail quantity price title description discountPercentage'
        })

        const {cart} = user

        return res.status(200).json(new ApiResponse(200,"cart fetched successfully", cart))
      
})

const removeCartItem = asyncHandler(async(req,res,next)=>{

    const { id:userId } = req.body.user
   
    const { productId, color, size } = req.body.productDetails;

    const fetchedUser = await User.findById(userId)

    if(!fetchedUser){
      return next(new ApiError(404,"User not found"))
    }
    
    const cartItems = fetchedUser.cart

    const updatedCart = cartItems.filter((item) => 
      item.product._id.toString() === productId.toString() && item.color === color && item.size === size ? false : true)

    fetchedUser.cart = updatedCart
    await fetchedUser.save()

    return res.status(200).json(new ApiResponse(200,"Successfully removed "))
})


module.exports = {
  addToCart,
  cartItems,
  reduceQuantity,
  removeCartItem
};
