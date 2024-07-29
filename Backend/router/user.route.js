const express = require('express')
const router = express.Router()
router.use(express.json())
const {verifyJWT} = require('../middleware/auth.middleware')
const {addUserAddress} = require('../controllers/user.controller')
const {updateUser , fetchUserDetails} = require('../controllers/user.controller')


router.use(verifyJWT)
// router.get('/userDetails',userDetails)

router.post('/address/add',addUserAddress)
router.get('/my',fetchUserDetails)
router.post('/update',updateUser)


module.exports = router