const Brand = require("../models/brand.model")
const brandData = require('../brand.json')
const {asyncHandler} = require("../utils/asyncHandler")
const {ApiError} = require("../utils/ApiError")
const {ApiResponse} = require("../utils/ApiResponse")

const fetchAllBrands = asyncHandler(async(req,res,next)=>{
        const brands = await Brand.find()
        return res.status(200).json(new ApiResponse(200,"Successfully fetched Brands",brands))
})

const addBrand = asyncHandler((async(req,res,next)=>{
    const {label} = req.body
    const ifAlreadyExist = await Brand.find({label})
    if(ifAlreadyExist.length){
        return next(new ApiError(409,"Brand already exists"))
    }

    const newBrand = await Brand.create({
        label 
    })

    return res.status(200).json(new ApiResponse(200,"Brand Added successfully",newBrand))

}))


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
    seedBrand,
    addBrand
}