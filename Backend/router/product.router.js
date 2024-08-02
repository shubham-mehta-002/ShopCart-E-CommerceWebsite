const express= require('express')
const router = express.Router()
router.use(express.json())
const {fetchAllProducts ,fetchProductById,  updateProduct ,createProduct } = require('../controllers/product.controller')
const {pagination} = require('../middleware/pagination.middleware')
const Product = require('../models/product.model')
const {verifyJWT , verifyAdminJWT} =  require("../middleware/auth.middleware")



router.get('/',fetchAllProducts)
router.get('/:productId',fetchProductById)
router.post('/update/:productId',verifyAdminJWT,updateProduct)

router.post('/create',verifyAdminJWT,createProduct)

module.exports = router