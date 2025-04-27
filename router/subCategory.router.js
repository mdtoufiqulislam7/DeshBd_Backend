const express = require('express')
const { subCategoryController, getSubCategory } = require('../controller/subCategory.controller')
const auth = require('../middleware/auth')
const upload = require('../middleware/multer')
const router = express.Router()



router.post('/createSubCategory',auth,upload.single('image'),subCategoryController)
router.get('/getsubcategory/:id',auth,getSubCategory)
module.exports = router