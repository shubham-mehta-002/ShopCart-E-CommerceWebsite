const express = require('express')
const router = express.Router()
const {verifyJWT} = require('../middleware/auth.middleware')
const {addToCart , cartItems ,reduceQuantity ,removeCartItem} = require('../controllers/cart.controllers')


router.use(express.json())

router.use(verifyJWT)

router.get('/',cartItems)
router.post('/add',addToCart)
router.post('/reduce',reduceQuantity)
router.post('/remove',removeCartItem)

module.exports = router