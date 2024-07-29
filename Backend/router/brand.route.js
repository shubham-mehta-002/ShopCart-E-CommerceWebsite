const express = require('express')
const router = express.Router()

const {fetchAllBrands} = require("../controllers/brand.controller")

router.use(express.json())

router.get('/',fetchAllBrands)


module.exports = router