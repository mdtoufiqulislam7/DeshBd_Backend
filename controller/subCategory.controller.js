const SubCategoryModel = require('../models/subCategory');
const uploadImageCloudnary = require('../utilis/uploadImage');


exports.subCategoryController = async(req,res)=>{

    try {
        let { name,  category } = req.body;

        // যদি category ফিল্ড single ID হয়, তাহলে একে Array বানিয়ে নাও
        if (!Array.isArray(category)) {
            category = [category];  
        }

        subCategoryImage = " "
        if (req.file) {
                    const uploadedImage = await uploadImageCloudnary(req.file);
                    subCategoryImage = uploadedImage.secure_url; // Get image URL from Cloudinary response
                }

        const subCategory = new SubCategoryModel({ name, image:subCategoryImage, category });
        await subCategory.save();

        return res.status(201).json({ 
        message: "Subcategory created successfully", 
        data: subCategory,
        error:false,
        success:true 
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const mongoose = require('mongoose');

exports.getSubCategory = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid category ID format" });
    }

    const subcategory = await SubCategoryModel.find({ category: id }).populate("category");

    return res.status(200).json({
      message: "Subcategories fetched successfully",
      data: subcategory
    });

  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false
    });
  }
};
