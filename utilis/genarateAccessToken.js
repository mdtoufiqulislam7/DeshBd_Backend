const jwt = require('jsonwebtoken')

const generateToken = async(userId)=>{

    const token = await jwt.sign({id:userId},process.env.SECRET_KEY,{expiresIn:"5h"})
    return token

}

module.exports = generateToken