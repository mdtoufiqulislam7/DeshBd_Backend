
const UserModel = require("../models/user")
const AddressModel = require('../models/address')



exports.createUserAddress = async (req, res) => {
    try {
        const userId = req.userId;
        const { address_line, city, state, pincode, country, mobile } = req.body;

        // Validate required fields
        if (!address_line || !city || !state || !pincode || !country || !mobile) {
            return res.status(400).json({
                message: "All fields are required",
                error: true,
                success: false
            });
        }

        // Check if address already exists
        const existingAddress = await AddressModel.findOne({ userId });

        if (existingAddress) {
            return res.status(400).json({
                message: "Address already exists. Use update endpoint.",
                error: true,
                success: false
            });
        }

        // Create a new address
        const newAddress = new AddressModel({
            userId,
            address_line,
            city,
            state,
            pincode,
            country,
            mobile
        });

        const saveAddress = await newAddress.save();

        await UserModel.findByIdAndUpdate(
            userId,
            { $push: { address_details: saveAddress._id } },
            { new: true } // Return updated user document
        );

        return res.status(201).json({
            message: "User address created successfully",
            error: false,
            success: true
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message || "Internal Server Error",
            error: true,
            success: false
        });
    }
};

exports.getUserAddress = async(req,res)=>{
    try {
        const userId = req.userId
        const getuseraddress = await AddressModel.find({userId:userId}).sort({createdAt: -1})


        return res.status(200).json({

            message:"address details successfully get",
            data:getuseraddress

        })
    } catch (error) {
        return res.status(500).json({
            message:error.message|| error,
            error:true,
            success:false
        })
    }

}

exports.updateUserAddress = async (req, res) => {
    try {
      const userId = req.userId;
      const { address_line, city, state, pincode, country, mobile } = req.body;
  
      // Validate input
      if (!address_line || !city || !state || !pincode || !country || !mobile) {
        return res.status(400).json({
          message: "All fields are required",
          error: true,
          success: false,
        });
      }
  
      // Find the existing address for the user
      const existingAddress = await AddressModel.findOne({ userId });
  
      if (!existingAddress) {
        return res.status(404).json({
          message: "Address not found. Please create one first.",
          error: true,
          success: false,
        });
      }
  
      // Update address fields
      existingAddress.address_line = address_line;
      existingAddress.city = city;
      existingAddress.state = state;
      existingAddress.pincode = pincode;
      existingAddress.country = country;
      existingAddress.mobile = mobile;
  
      await existingAddress.save();
  
      return res.status(200).json({
        message: "Address updated successfully",
        error: false,
        success: true,
        data: existingAddress,
      });
    } catch (error) {
      return res.status(500).json({
        message: error.message || "Internal Server Error",
        error: true,
        success: false,
      });
    }
  };
  