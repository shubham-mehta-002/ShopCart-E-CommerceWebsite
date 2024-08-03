const User = require("../models/user.model")
const {asyncHandler} =  require("../utils/asyncHandler")
const { ApiError } = require("../utils/ApiError")
const { ApiResponse } = require("../utils/ApiResponse")

const addUserAddress = asyncHandler(async(req,res,next)=>{

        const {id:userId} = req.body.user
        const {addressDetails} = req.body
        if(!addressDetails){
            return next(new ApiError(400,"Address Details not passed"))
        }
        const {street , city, state, pinCode} = addressDetails
        if(!street || !city || !state || !pinCode ){
            return next(new ApiError(400,"Insufficient address details"))

        }
        const fetchedUser = await User.findById(userId)
        if(!fetchedUser){
            return next(new ApiError(400,"User not found"))

        }
        fetchedUser.address.push(addressDetails)
        await fetchedUser.save()

        return res.status(200).json(new ApiResponse(200,"Successfully added "))
      
})



const fetchUserDetails = asyncHandler(async(req,res,next) =>{
        const {id:userId} = req.body.user
        const fetchedUserDetails = await User.findById(userId)
            .select('email fullName address phoneNumber role')
            .populate("address")

        if(!fetchedUserDetails){
            return next(new ApiError(400,"User not found"))
        }

        return res.status(200).json(new ApiResponse(200,"User details fetched successfully",fetchedUserDetails))

       
})

const updateUser = asyncHandler(async(req,res,next) =>{
        const {id:userId} = req.body.user
        const {newData : fieldsToBeUpdated} = req.body
        if(!fieldsToBeUpdated){
            return next(new ApiError(400,"No fields found"))
        }
        const updatedUser = await User.findByIdAndUpdate(userId , {...fieldsToBeUpdated} , {new:true}) 
        if(!updatedUser){
            return next(new ApiError(400,"User not found"))
        }

        return res.status(200).json(new ApiResponse(200,"Updated successfully"))

    
})

module.exports= {
    addUserAddress,
    fetchUserDetails,
    updateUser
}
