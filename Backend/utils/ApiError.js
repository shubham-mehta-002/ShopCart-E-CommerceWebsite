class ApiError extends Error{
    constructor(statusCode , message){
        super(message)
        this.statusCode = statusCode
        this.isOperational = true
        
        Error.captureStackTrace(this,this.constructor)
    }
}

module.exports = {ApiError}