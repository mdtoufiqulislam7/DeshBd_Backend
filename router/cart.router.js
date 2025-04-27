const express = require('express')
const auth = require('../middleware/auth')
const { cartProductController, getUserCart, deleteCart } = require('../controller/cart.controller')
const router = express.Router()

router.post('/addtocart',auth,cartProductController)
router.get('/getcardproduct',auth,getUserCart)
router.delete('/deleteCart', auth, deleteCart);


module.exports = router