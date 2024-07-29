const express = require('express')
const router = express.Router()

const {fetchAllCategories} = require("../controllers/category.controller") 

router.use(express.json())

router.get('/',fetchAllCategories)


module.exports = router