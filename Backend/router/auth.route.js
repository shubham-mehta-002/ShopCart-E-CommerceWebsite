const express = require('express')
const router = express.Router()
const {verifyJWT} = require('../middleware/auth.middleware')
const {registerUser , loginUser  ,logoutUser, resetPasswordRequest ,resetPassword } = require('../controllers/auth.controller')

router.use(express.json())

router.post('/register',registerUser)
router.post('/login',loginUser)
router.post('/logout',verifyJWT,logoutUser)
router.post('/reset-password-request',resetPasswordRequest)
router.post('/reset-password',resetPassword)

module.exports = router