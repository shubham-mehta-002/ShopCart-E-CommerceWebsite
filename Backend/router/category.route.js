const express = require('express')
const router = express.Router()
const {verifyAdminJWT} = require("../middleware/auth.middleware")
const {fetchAllCategories , addCategory} = require("../controllers/category.controller") 

router.use(express.json())

router.get('/',fetchAllCategories)
router.post('/add',verifyAdminJWT,addCategory)


module.exports = router