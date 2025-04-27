const categoryModel = require("../models/category");
const uploadImageCloudnary = require('../utilis/uploadImage')

exports.createCategory = async (req, res) => {
    try {
        const { name } = req.body;

        // Validate if category name is provided
        if (!name) {
            return res.status(400).json({
                message: "Category name is required",
                error: true,
                success: false
            });
        }

        let imageUrl = "";

        // Check if an image file is uploaded
        if (req.file) {
            const uploadedImage = await uploadImageCloudnary(req.file);
            imageUrl = uploadedImage.secure_url; // Get image URL from Cloudinary response
        }

        // Create new category with image
        const newCategory = new categoryModel({
            name,
            image: imageUrl
        });

        await newCategory.save();

        return res.status(201).json({
            message: "Category created successfully",
            error: false,
            success: true,
            data: newCategory
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message || "Internal Server Error",
            error: true,
            success: false
        });
    }
};

exports.getcategory = async(req,res)=>{
    try {
       const getcategorydata = await categoryModel.find()
       return res.status(200).json({
        message:"get category Product list",
        data: getcategorydata,
        error:false,
        success:true
       })

    } catch (error) {
        return res.status(500).json({
            message:error.message || error,
            error:true,
            success:false
        })
    }
}