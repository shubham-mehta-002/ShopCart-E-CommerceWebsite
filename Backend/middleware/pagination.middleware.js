const pagination = (model) =>{
    return async(req,res,next)=>{
        try{
            const page = parseInt(req.query.page) || 1
            const limit = parseInt(req.query.limit) || 10
            const startIndex = ( page-1 )*limit
            const endIndex = page*limit

            const results = {}

            if(startIndex > 0){
                results.previous = {
                    page : page-1,
                    limit:limit
                }    
            }

            if(endIndex < model.length){
                results.next = {
                    page : page+1,
                    limit:limit
                }    
            }

            results.results = await model.find().skip(startIndex).limit(limit)
            results.totalCount = await model.countDocuments()
            req.paginatedResult = results
            next()
        }catch(err){
            return res.status(500).json({success:false ,message:err.message})
        }
    }
}


module.exports= {pagination}


