const {ApiError} = require('../utils/ApiError')


function devErrors(res,error){
    res.status(error.statusCode).json({
        statusCode : error.statusCode,
        success:false,
        message:error.message,
        stackTrace : error.stack,
        error:error
    })
}

function prodErrors(res,error){
    console.log({error})
    if(error.isOperational){
        res.status(error.statusCode).json({
            statusCode : error.statusCode,
            success:false,
            message:error.message
        })
    }else{
        res.status(500).json({
            statusCode : 500,
            success:false,
            message:"Something went wrong !"
        })
    }
    
}

function castErrorHandler(error){
    const message = `Invalid value ${error.value} for field ${error.path}`
    return new ApiError(400,message)
}

function duplicateKeyErrorHandler(error){
    const name = error.keyValue.name
    const message = `Already exists with name ${name}`
    return new ApiError(409 , message)
}

function validationErrorHandler(error){
    const errors = Object.values(error.errors).map(err  => err.message)
    const errorMessages = errors.join(' . ')
    const message = `Invaid input data : ${errorMessages}`
    return new ApiError(400,message)
}

const globalErrorHandler = (error,req,res,next) =>{
    console.log({error})
    error.statusCode  = error.statusCode || 500
    error.message = error.message || "Interal Server Error" // "Something went wrong " 
    
    if(process.env.NODE_ENV === "development"){
        devErrors(res,error)
    }else if(process.env.NODE_ENV === "production"){

        if(error.name === "CastError"){
            error = castErrorHandler(error) 
        }
        if(error.code === 11000){
            error = duplicateKeyErrorHandler(error)
        }
        if(error.name === "ValidationError"){
            error = validationErrorHandler(error) 
        }
        prodErrors(res,error)
    }
    
}

module.exports = {globalErrorHandler}