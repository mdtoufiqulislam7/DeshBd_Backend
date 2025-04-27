const multer = require('multer')


const stroage = multer.memoryStorage()

const upload = multer({storage:stroage})

module.exports = upload