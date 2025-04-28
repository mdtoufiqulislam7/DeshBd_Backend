const express = require('express')
const auth = require('../middleware/auth')
const upload = require('../middleware/multer')
const { createProduct, getproduct, getProductByCategory } = require('../controller/product.controller')
const router = express.Router()

router.post('/createProduct',auth,upload.single('image'),createProduct)
router.get('/getproduct',getproduct)
router.get('/getproduct/:id',getProductByCategory)


module.exports = router