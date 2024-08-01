require('dotenv').config()
const express = require('express')

process.on('uncaughtException',(error)=>{
    console.log(error.name , error.message)
    console.log("Uncaught exception occured! Shutting down...")
    process.exit(1)  
})


const app = express()
const cors = require('cors')
const {connectWithDB} = require("./db/dbConnection")
const { globalErrorHandler } = require('./utils/globalErrorHandler')
const cookieParser = require('cookie-parser')
const { seedData } = require('./controllers/product.controller')
const {seedCategory} = require("./controllers/category.controller")
const {seedBrand} = require("./controllers/brand.controller")
const {ApiError} = require("./utils/ApiError")

const PORT =  process.env.PORT || 8000

app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}))

app.use(cookieParser())
app.use(express.json());

connectWithDB()
.then(res => console.log("Successfully connected with database"))

app.get('/',(req,res)=>{
    res.send("This is home page")
})



// import routes
const authRoute = require('./router/auth.route')
const cartRoute = require('./router/cart.route')
const productRoute = require('./router/product.router')
const orderRoute = require('./router/order.route')
const userRoute = require('./router/user.route')
const brandRoute = require('./router/brand.route')
const categoryRoute = require('./router/category.route')
const wishlistRoute =  require("./router/wishlist.route")

// seedData()
// seedCategory()
// seedBrand()

app.use('/auth',authRoute)
app.use('/cart',cartRoute)
app.use('/products',productRoute)
app.use('/orders',orderRoute)
app.use('/user',userRoute)
app.use('/brand',brandRoute)
app.use('/category',categoryRoute)
app.use('/wishlist',wishlistRoute)

app.all("*",(req,res,next)=>{
    next(new ApiError(404,`This path ${req.originalUrl} is not on the server`))
})

app.use(globalErrorHandler)


const server = app.listen(PORT,()=>{
    console.log("app running on port : ",PORT)
})

process.on('unhandledRejection',(error)=>{
    console.log(error.name , error.message)
    console.log("Unhandled rejection occured! Shutting down...")

    server.close(()=>{
        process.exit(1) 
    })
})

