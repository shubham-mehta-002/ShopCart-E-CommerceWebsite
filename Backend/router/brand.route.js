const express = require('express')
const router = express.Router()
const {verifyAdminJWT} = require("../middleware/auth.middleware")

const {fetchAllBrands , addBrand} = require("../controllers/brand.controller")

router.use(express.json())

router.get('/',fetchAllBrands)
router.post('/add',verifyAdminJWT,addBrand)

module.exports = router