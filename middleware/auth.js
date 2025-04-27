const jwt = require('jsonwebtoken')


const auth = async(req,res,next)=>{

    try {
        const token = req.cookies?.accessToken || req?.headers?.authorization?.split(" ")[1]
        if(!token){
            res.status(400).json({
                message:'token in provide',
                error:true,
                success:false
            })
        }
        const decode = await jwt.verify(token,process.env.SECRET_KEY)
        if(!decode){
            res.status(401).json({
                message:"unauthorize user",
                error:true,
                success:false
            })
        }
        req.userId = decode.id
        next()

    } catch (error) {

        return res.status(501).json({
            message:error.message || error,
            error: true,
            success: false
        })
        
    }

}

module.exports = auth