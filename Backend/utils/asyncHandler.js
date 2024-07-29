// const asyncHandler = (fn) => async(req,res,next) =>{
//     try{
//         await fn(req,res,next)
//     }catch(err){
//         next(err)
//     }
// }

// module.exports = {asyncHandler}

const  { ApiError } = require( "./ApiError")

const asyncHandler = (fun) =>  async(req,res,next) =>{
        try{
            await fun(req,res,next);
        }catch(error){
            console.log("async handler ",error)
            next(error)
        }
}
module.exports = {asyncHandler}
