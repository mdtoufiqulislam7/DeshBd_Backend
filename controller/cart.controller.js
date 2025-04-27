const cartModel = require('../models/cartproduct')
const ProductModel = require('../models/product')
const userModel =require('../models/user')


exports.cartProductController = async(req,res)=>{
    try {
        const userId = req.userId;
        const {productId} = req.body

        const findproduct = await ProductModel.findById(productId)
        if(!findproduct){
            return res.status(404).json({ message: "Product not found", error: true });
        }
        let cartItem = await cartModel.findOne({ productId, userId });
        if (cartItem) {
            cartItem.quantity += 1;
        } else {
            cartItem = new cartModel({ productId, quantity: 1, userId });
        }
        await cartItem.save();

        const userInfoupdate = await userModel.updateOne({_id:userId},{
            $push :{
                shopping_cart: cartItem._id
            }
        })
        return res.status(200).json({
            message:"add to card done",
            data:cartItem,
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

exports.getUserCart = async (req, res) => {
    try {
        const userId = req.userId;
        const cartItems = await cartModel.find({ userId })
            .populate("productId")
            .populate("userId", "name email");
        
        if(!cartItems){
            return res.status(500).json({
                message:"cart product not found",
                error:true,
                success:false
            })
        }

        return res.status(200).json({
            message:"cart product found",
            data:cartItems,
            error:false,
            success:true
        });
    } catch (error) {
        res.status(500).json({ message: error.message, error: true });
    }
};

exports.deleteCart = async (req, res) => {
    try {
        const { cartItemId } = req.body; // Assuming cartItemId is passed in the request body

        // Find the cart item to be deleted
        const cartItem = await cartModel.findById(cartItemId);
        if (!cartItem) {
            return res.status(404).json({
                message: "Cart item not found",
                error: true,
                success: false,
            });
        }

        // Remove the cart item from the cart
        await cartModel.findByIdAndDelete(cartItemId);

        // Optionally, remove the cart item from the user's shopping cart array
        await userModel.updateOne(
            { _id: req.userId },
            { $pull: { shopping_cart: cartItemId } }
        );

        return res.status(200).json({
            message: "Cart item removed successfully",
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