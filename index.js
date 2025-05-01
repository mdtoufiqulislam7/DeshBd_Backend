const express = require('express')
const app = express()
const cors = require('cors')
const bodyparser = require('body-parser');
require('dotenv').config(); // ✅ Load env first
const db = require('./config/db'); // Then use it
const cookieParser = require("cookie-parser");
app.use(cookieParser());


// const fileuploader = require('express-fileupload');

// app.use(fileuploader({
//     useTempFiles: true,
//     tempFileDir: '/tmp/'
// }));
const port = process.env.PORT
app.use(cors({
    origin: (origin, callback) => {
      const allowedOrigins = [
        "http://localhost:5173",
        "https://deshbd.netlify.app"
      ];
  
      if (!origin || origin === "null" || allowedOrigins.includes(origin.replace(/\/$/, ""))) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true
  }));

app.options('*', cors());
const upload = require('./middleware/multer')


// Handle preflight requests

app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());

const userRoute = require('./router/userRoute')
const userAddress = require('./router/address.router')
const category = require('./router/category.route')
const subCategory = require('./router/subCategory.router')
const product = require('./router/product.router')
const cart = require('./router/cart.router')

app.use('/api/user/',userRoute)
app.use('/api',userAddress)
app.use('/api',category)
app.use('/api',subCategory)
app.use('/api',product)
app.use('/api',cart)
const paymentRoutes = require('./router/Order.router');
app.use('/api/payment', paymentRoutes);


app.use((req, res, next) => {
    res.status(400).json({
        message: 'Bad request || URL not found'
    });
});

const server = async() => {
    db()
    app.listen(port, () => {
        console.log(`app is running at http://localhost:${port}`);
    });
};
server(); 