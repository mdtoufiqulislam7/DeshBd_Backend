const express = require('express')
const { registerUserController, verifyEmailController, loginUserController, userLogout, uploadProfileImage, userUpdateDetails, userForgetPassword, verifyForgetPasswordOtp, resetPassword, userDetails } = require('../controller/user.auth')
const auth = require('../middleware/auth')
const upload = require('../middleware/multer')
const router = express.Router()
// const {registerUserController}= require('../controller/user.auth')

router.post('/registation',registerUserController)
router.post('/verify-email',verifyEmailController)
router.post('/login',loginUserController)
router.get('/logout',auth,userLogout)
router.put('/upload-profile',auth,upload.single('image'),uploadProfileImage)
router.put('/update-user',auth,userUpdateDetails)
router.put('/forgetpassword',userForgetPassword)
router.put('/verify-otp',verifyForgetPasswordOtp)
router.put('/reset-password',resetPassword)
router.get('/userdetails',auth,userDetails)



module.exports = router