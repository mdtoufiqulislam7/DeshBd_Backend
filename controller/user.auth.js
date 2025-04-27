const sendEmail = require("../config/sendEmail");
const UserModel  =require("../models/user");

const bcrypt = require("bcryptjs");
const verifyEmailTemplate = require("../utilis/verifyEmailTemplae");
const generateAccessToken = require("../utilis/genarateRefreshToken");
const generateRefreshToken = require("../utilis/genarateRefreshToken");
const uploadImageCloudnary = require("../utilis/uploadImage");
const generatedOtp = require("../utilis/generateOtp");
const forgotPasswordTemplate = require("../utilis/forgetPasswordTemplate");
const nodemailer = require('nodemailer');
const crypto = require('crypto');
// user registation Controller

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,  // Use environment variables
        pass: process.env.EMAIL_PASS
    }
});

// const generateotp = () => crypto.randomInt(100000, 999999).toString();

exports.registerUserController = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Validate input fields
        if (!name?.trim() || !email?.trim() || !password?.trim()) {
            return res.status(400).json({
                message: "Provide email, name, and password",
                error: true,
                success: false
            });
        }
        
        // Check if email already exists
        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            return res.status(409).json({
                message: "Email already exists",
                error: true,
                success: false
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        const otp = generatedOtp();
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

        // Create user payload
        const newUser = new UserModel({
            name,
            email,
            password: hashedPassword,
            otp,
            otpExpiry
        });

        // Save user to the database
        const savedUser = await newUser.save();

        // Send OTP email
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: `OTP Verification`,
            text: `Your OTP is: ${otp}`,
            html: verifyEmailTemplate({
                name,
                otp
            })
        });

        // Success response
        return res.status(201).json({
            message: "User registered. Please verify OTP sent to email.",
            data: savedUser,
            error: false,
            success: true
        });

    } catch (error) {
        console.error("Registration Error:", error);
        return res.status(500).json({
            message: error.message || "Internal server error",
            error: true,
            success: false
        });
    }
};
// email verification controller 
exports.verifyEmailController = async (req,res)=>{

    try {
        const {email,otp}= req.body

    const user = await UserModel.findOne({email})
    if(!user){
        return res.status(400).json({
            message:"Not found user",
            error:true,
            success:false
        })
    }
    if(user.verify_email){
       return res.status(401).json({
        message:"user already varified",
        error:true,
        success:false
       })
    }

    if (user.otp !== otp || user.otpExpiry < new Date()) {
        return res.status(400).json({ message: 'Invalid or expired OTP' });
    }


    user.verify_email = true;
    user.otp = undefined;
    user.otpExpiry = undefined
    await user.save()
    return res.status(200).json({
        message:"verify successfully",
        
        error:false,
        success:true
    })
    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error:true,
            success:false
        })
    }
}
// User Login Controller 
exports.loginUserController = async(req,res)=>{

   try {

    
    const {email,password} = req.body;

    if ( !email?.trim() || !password?.trim()) {
        return res.status(400).json({
            message: "Provide email  and password",
            error: true,
            success: false
        });
    }

    const user = await UserModel.findOne({email})
    if(!user){
        return res.status(400).json({
            message:"user not found",
            error:true,
            success:false
        })
    }

    if(user.status !== 'active'){
        return res.status(401).json({
            message:"Contact to Admin",
            error:true,
            success:false
        })
    }

    const checkpassword = await bcrypt.compare(password,user.password)
    if(!checkpassword){
        return res.status(403).json({
            message: "check your password",
            error:true,
            success:false
        })

    }

    const accessToken = await generateAccessToken(user._id)
    const refreshToken = await generateRefreshToken(user._id)

    const cookieOption = {
        httpOnly :true,
        secure : true,
        sameSite: 'None'
    }
    res.cookie("accessToken",accessToken,cookieOption);
    res.cookie("refreshToken",refreshToken,cookieOption);

    const saveRefreshCookie = await UserModel.findByIdAndUpdate(user._id,{refresh_token:refreshToken})
    const updateLastDayLogin = await UserModel.findByIdAndUpdate(user?._id,{
        last_login_date : new Date()
    })

    return res.status(200).json({
        message: "Login successfully ",
        error:false,
        success:true,
        data:{
            user,
            accessToken,
            refreshToken
        }
    })



   } catch (error) {
    return res.status(500).json({
        message: error.message || error,
        error:true,
        success:false
    })
    
   }
}
exports.userLogout = async(req,res)=>{

    try {
        
        const userid = req.userId //middleware

        const cookiesOption = {
            httpOnly : true,
            secure : true,
            sameSite : "None"
        }

        res.clearCookie("accessToken",cookiesOption)
        res.clearCookie("refreshToken",cookiesOption)

        const removeRefreshToken = await UserModel.findByIdAndUpdate(userid,{
            refresh_token : ""
        })

        return res.status(203).json({
            message : "Logout successfully",
            error : false,
            success : true
        })
    } catch (error) {
        return res.status(501).json({
            message:error.message || error,
            error: true,
            success: false
        })
    }

}
//profile image upload 
exports.uploadProfileImage = async(req,res)=>{

    try {
        const userid = req.userId
        const image = req.file
        const upload = await uploadImageCloudnary(image)

        const uploadimagedata = await UserModel.findByIdAndUpdate(userid ,{
            avater:upload.url
        })

        return res.status(200).json({
            message:"profile image upload",
            _id:userid,
            profilePicture:upload.url,
            error:false,
            success:true
        })

        
    } catch (error) {
        res.status(400).json({
            message:error.message || error,
            error:true,
            success:false
        })
    }
}
//userDetaisUpdate
exports.userUpdateDetails = async(req,res)=>{
    try {
    const userId = req.userId
    const {name,email,password,mobile}=req.body
    let hashedPassword = ""
    if(password){
        hashedPassword = await bcrypt.hash(password, 10); 
    }
    const updateuser = await UserModel.findByIdAndUpdate(userId,{
        ...(name && {name:name}),
        ...(email && {email:email}),
        ...(password && {password:hashedPassword}),
        ...(mobile && {mobile:mobile}),
        
    })

    return res.status(201).json({
        message: "update succcessfully ",
        data:updateuser
    })
    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error:true,
            success:false
        })
    }
}
//forgetPassword
exports.userForgetPassword = async(req,res)=>{

   try {
    const {email}= req.body
    const user = await UserModel.findOne({email})

    if(!user){
        return res.json({
            message:"invalid Email ",
            error:true,
            success:false
        })
    }
    
    const otp = generatedOtp()
    const expireTime = new Date() + 60*60*1000 

    const updateuser = await UserModel.findByIdAndUpdate(user._id,{
        forgot_password_otp:otp,
        forgot_password_expiry:expireTime
    })

    await sendEmail({
        sendTo : email,
        subject : "Forget Password OTP from DeshBd",
        html : forgotPasswordTemplate({
                name:user.name,
                otp:otp
            })
    })

    return res.status(201).json({
        message:"otp send successfully"
    })
   } catch (error) {

    return res.status(500).json({
        message: error.message || error,
        error:true,
        success: false
    })
    
   }

   

}
//forgetpasswordOtp verify
exports.verifyForgetPasswordOtp = async(req,res)=>{
    try {
        const {email,otp} = req.body

        if(!email && !otp){
            return res.status(400).json({
                message: "requied to give email and otp"
            })
        }
        const user = await UserModel.findOne({email})
        if(!user){

            return res.status(401).json({
                message:"this email not found ",
                error:true,
                success:false
            })
      
        }
        const currentTime = new Date().toISOString()

        if(user.forgot_password_expiry < currentTime  ){
            return response.status(400).json({
                message : "Otp is expired",
                error : true,
                success : false
            })
        }

        if(otp !== user.forgot_password_otp){
            return response.status(400).json({
                message : "Invalid otp",
                error : true,
                success : false
            })
        }

        //if otp is not expired
        //otp === user.forgot_password_otp

        const updateUser = await UserModel.findByIdAndUpdate(user?._id,{
            forgot_password_otp : "",
            forgot_password_expiry : ""
        })
        
        return response.json({
            message : "Verify otp successfully",
            error : false,
            success : true
        })

    } catch (error) {
        return res.status(500).json({
            message:error.message || error,
            error:true,
            success:false
        })
    }
}
//reset password
exports.resetPassword = async(req,res)=>{
    try {
        const {email,Newpassword,ConfimPassword} = req.body
        if(!email && !Newpassword && !ConfimPassword){
            return res.status(401).json({
                message:"require to email password confirmpassword",
                error:true,
                success:false
            })
        }
        const user = await UserModel.findOne({email})
        if(!user){
            return res.status(402).json({
                message:"email not found",
                error:true,
                success:false
            })
        }
        if(Newpassword !== ConfimPassword){
            return res.status(402).json({
                message:"new password and confirmpassword not same",
                error:true,
                success:false
            })
        }


        const  hashedPassword = await bcrypt.hash(Newpassword, 10);
        const update = await UserModel.findByIdAndUpdate(user._id,{
            password:hashedPassword
        })

        return res.status(201).json({
            message:"updated user password ",
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
//user Details 
exports.userDetails = async(req,res)=>{
    try {
        const userId = req.userId
        const userDetails = await UserModel.findById(userId).select('-password -refresh_token')
        .populate("address_details")
        return res.json({
            message : 'user details',
            data : userDetails,
            error : false,
            success : true
        })
    } catch (error) {
        return res.status(500).json({
            message:error.message || error,
            error:true,
            success:false
        })
    }
}
