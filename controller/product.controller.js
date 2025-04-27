
const SubCategoryModel = require('../models/subCategory')
const userModel = require('../models/user')
const CategoryModel = require("../models/category")
const uploadImageCloudnary = require('../utilis/uploadImage')
const ProductModel = require('../models/product')

exports.createProduct = async (req, res) => {
    try {
      const {
        name,
        category,
        subCategory,
        unit,
        stock,
        price,
        discount,
        description,
      } = req.body;
  
      if (!name || !category || !subCategory || !unit || !price || !description) {
        return res.status(400).json({
          message: "Enter required fields",
          error: true,
          success: false,
        });
      }
  
      const categorydata = await CategoryModel.findById(category);
      if (!categorydata) {
        return res.status(400).json({ message: "Invalid category ID" });
      }
  
      const subcategorydata = await SubCategoryModel.findById(subCategory);
      if (!subcategorydata) {
        return res.status(400).json({ message: "Invalid subcategory ID" });
      }
  
      let productImageUrl = "";
      if (req.file) {
        const uploadImage = await uploadImageCloudnary(req.file);
        productImageUrl = uploadImage.secure_url;
      }
  
      const product = new ProductModel({
        name,
        image: productImageUrl,
        category: [categorydata._id],
        subCategory: [subcategorydata._id],
        unit,
        stock,
        price,
        discount,
        description,
      });
  
      const saveProduct = await product.save();
  
      return res.json({
        message: "Product Created Successfully",
        data: saveProduct,
        error: false,
        success: true,
      });
    } catch (error) {
      return res.status(500).json({
        message: error.message || error,
        error: true,
        success: false,
      });
    }
  };

exports.getproduct  = async(req,res)=>{
    try {
        const getproduct = await ProductModel.find()
        .populate('category')
        .populate('subCategory')

        if(!getproduct){
            return res.status(501).json({
                message:"there is no product in Database",
                error:true,
                success:false
            })
        }
        return res.status(200).json({
            message:"Get All product data",
            data:getproduct,
            error:false,
            success:true
        })
    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true,
            success : false
        })
    }
}  


exports.getProductByCategory = async (req, res) => {
    try {
        const { id } = req.params;

        // Find all products with this category ID
        const products = await ProductModel.find({ category: id });

        if (!products || products.length === 0) {
            return res.status(404).json({
                message: "No products found for this category",
                error: true,
                success: false
            });
        }

        return res.status(200).json({
            message: "Products retrieved by category",
            data: products,
            error: false,
            success: true
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message || "Server Error",
            error: true,
            success: false
        });
    }
};