const cloudinary = require('cloudinary').v2;

cloudinary.config({ 
    cloud_name: process.env.cloud_name, 
    api_key: process.env.api_key, 
    api_secret: process.env.api_secret 
});


const uploadImageCloudnary = async(image)=>{
    const buffer = image?.buffer || Buffer.from(await image.arrayBuffer())

    const uploadimage = await new Promise((resolve,reject)=>{
        cloudinary.uploader.upload_stream({folder:"DeshBd"},(error,uploadResult)=>{
            return resolve(uploadResult)
        }).end(buffer)
    })
    return uploadimage
}


module.exports = uploadImageCloudnary