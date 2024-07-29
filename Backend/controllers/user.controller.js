const User = require("../models/user.model")
const {asyncHandler} =  require("../utils/asyncHandler")
const { ApiError } = require("../utils/ApiError")
const { ApiResponse } = require("../utils/ApiResponse")

const addUserAddress = asyncHandler(async(req,res,next)=>{
    // try{
        console.log("i am called")
        const {id:userId} = req.body.user
        const {addressDetails} = req.body
        if(!addressDetails){
            return next(new ApiError(400,"Address Details not passed"))
        }
        const {street , city, state, pinCode} = addressDetails
        if(!street || !city || !state || !pinCode ){
            return next(new ApiError(400,"Insufficient address details"))

        }
        // console.log({addressDetails})
        const fetchedUser = await User.findById(userId)
        if(!fetchedUser){
            return next(new ApiError(400,"User not found"))

            // return res.status(400).json({success:false , message:"User not found"})
        }
        fetchedUser.address.push(addressDetails)
        await fetchedUser.save()

        return res.status(200).json(new ApiResponse(200,"Successfully added "))
        // return res.status(200).json({success:true , message:"Successfully added "})
    // }catch(err){
    //     console.log({err})
    //     return res.status(500).json({success:false , message:"Somethingggg went wrong ", error:err.message})
    // }
})

// const fetchUserOrders = async(req,res)=>{
//     try{    
//         const {id : userId} =  req.body.user
//         if(!id){
//             res.status(400).json({success:false , message:"No id found "})
//         }

//         const fetchedUser = await User.findById(userId)
//         if(!fetchedUser){
//             res.status(400).json({success:false , message:"User not found "})
//         }

//         const orders = fetchedUser.orderHistory

//         return res.status(200).json({success:true , message: "Orders fetched Successfully" , data:orders})

//     }catch(error){
//         return res.status(500).json({success:false , message:"Something went wrong "})
//     }
// }

const fetchUserDetails = asyncHandler(async(req,res,next) =>{
    // try{
        const {id:userId} = req.body.user
        const fetchedUserDetails = await User.findById(userId).select('email fullName address phoneNumber role')

        if(!fetchedUserDetails){
            return next(new ApiError(400,"User not found"))
            // return res.status(400).json({success:false , message : "User not found"})
        }

        return res.status(200).json(new ApiResponse(200,"User details fetched successfully",fetchedUserDetails))

        // return res.status(200).json({success:true, message:"User details fetched successfully ", data :fetchedUserDetails})
    // }catch(error){
    //     return res.status(500).json({success:false , message : "User not found" , error:error.message})
    // }
})

const updateUser = asyncHandler(async(req,res,next) =>{
    // try{
        const {id:userId} = req.body.user
        console.log(req.body)
        const {newData : fieldsToBeUpdated} = req.body
        if(!fieldsToBeUpdated){
            return next(new ApiError(400,"No fields found"))
        }
        console.log({...fieldsToBeUpdated})
        const updatedUser = await User.findByIdAndUpdate(userId , {...fieldsToBeUpdated} , {new:true}) 
        if(!updatedUser){
            return next(new ApiError(400,"User not found"))
            // res.status(400).json({success:false , message: "User not found"})
        }

        return res.status(200).json(new ApiResponse(200,"Updated successfully"))
        // return res.status(200).json({success:true , message:"Updated successfully"})

    // }catch(error){
    //     return res.status(500).json({success:false , message: "Something ent wrong", error:error.message})
    // }
})

module.exports= {
    addUserAddress,
    fetchUserDetails,
    updateUser
    // fetchUserOrders
}
