const mongoose = require('mongoose')


const db =async()=>{
    try {
        mongoose.set('strictQuery',false)
        await mongoose.connect(process.env.mongo_url)
        console.log('connected to database')
    } catch (error) {
        console.log('database connection error')
    }
}

module.exports = db 