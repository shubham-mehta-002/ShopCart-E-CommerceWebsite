const express = require('express')
const router = express.Router()
router.use(express.json())
const {verifyJWT} = require('../middleware/auth.middleware')
const {addUserAddress} = require('../controllers/user.controller')
const {updateUser , fetchUserDetails} = require('../controllers/user.controller')


router.use(verifyJWT)

router.post('/address/add',addUserAddress)
router.get('/',fetchUserDetails)
router.post('/update',updateUser)


module.exports = router