const express = require('express')
const router = express.Router()
const upload = require('../middleware/multer')
const auth = require('../middleware/auth')
const { createCategory, getcategory } = require('../controller/category.controller')


router.post('/createcategory',auth,upload.single("image"),createCategory)
router.get('/getcategory',auth,getcategory)



module.exports = router