const jwt = require('jsonwebtoken')
const UserModel =require("../models/user");
const generateAccessToken = async(userId)=>{

    const token = await jwt.sign({id:userId},process.env.SECRET_KEY,{expiresIn:"7d"})
    const updateToken = await UserModel.updateOne({id:userId},{refresh_token:token})
    return token

}

module.exports = generateAccessToken