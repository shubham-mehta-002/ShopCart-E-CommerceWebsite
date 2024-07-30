const Brand = require("../models/brand.model")
const brandData = require('../brand.json')
const {asyncHandler} = require("../utils/asyncHandler")
const {ApiError} = require("../utils/ApiError")
const {ApiResponse} = require("../utils/ApiResponse")


const fetchAllBrands = asyncHandler(async(req,res,next)=>{
        const brands = await Brand.find()
        return res.status(200).json(new ApiResponse(200,"Successfully fetched Brands",brands))
})


const seedBrand = async(req,res)=>{
    try{
        await Brand.create(brandData)
    }catch(err){
        console.log({err})
        return res.status(500).json({success:false , message : "Something went wrong "})
    }
}


module.exports= {
    fetchAllBrands,
    seedBrand
}