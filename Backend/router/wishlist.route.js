const express = require('express')
const router = express.Router()
const {verifyJWT} = require('../middleware/auth.middleware')
const {wishlistItems ,addToWishlist,removeFromWishlist} = require("../controllers/wishlist.controllers")

router.use(express.json())

router.use(verifyJWT)

router.get('/',wishlistItems)
router.post('/add',addToWishlist)
router.post('/remove',removeFromWishlist)


module.exports = router