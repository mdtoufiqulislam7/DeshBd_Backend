// routes/payment.js
const express = require('express');
const router = express.Router();
const SSLCommerzPayment = require('sslcommerz-lts');
const { v4: uuidv4 } = require('uuid');
const OrderModel = require('../models/order'); // path depends on your structure
const UserModel = require('../models/user');
const auth = require('../middleware/auth');
const store_id = process.env.SSLCOMMERZ_STORE_ID;
const store_passwd = process.env.SSLCOMMERZ_STORE_PASSWORD;
const is_live = process.env.is_live === "true";

router.post('/init', async (req, res,next) => {
    const { total_amount, user } = req.body;
    const transactionId = uuidv4();

    const data = {
        total_amount,
        currency: 'BDT',
        tran_id: transactionId,
        success_url: `${process.env.SERVER_URL}/api/payment/success?tran_id=${transactionId}`,
        fail_url: `${process.env.SERVER_URL}/api/payment/fail`,
        cancel_url: `${process.env.SERVER_URL}/api/payment/cancel`,
        ipn_url: `${process.env.SERVER_URL}/api/payment/ipn`,
        shipping_method: 'Courier',
        product_name: 'Cart Products',
        product_category: 'Mixed',
        product_profile: 'general',
        cus_name: user.name,
        cus_email: user.email,
        cus_add1: user.address || 'Dhaka',
        cus_city: 'Dhaka',
        cus_postcode: '1000',
        cus_country: 'Bangladesh',
        cus_phone: user.phone || '01711111111',
        ship_name: user.name,
        ship_add1: user.address || 'Dhaka',
        ship_city: 'Dhaka',
        ship_postcode: 1000,
        ship_country: 'Bangladesh',
    };

    try {
        // ✅ Create a pending order in DB
        const order = await OrderModel.create({
            userId: user._id,
            orderId: transactionId,
            totalAmt: total_amount,
            payment_status: 'Pending',
           
        });

       

        // ✅ Initiate SSLCommerz
        const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);
        const apiResponse = await sslcz.init(data);
        return res.status(200).json({ url: apiResponse.GatewayPageURL });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Payment initialization failed', error });
    }
});

// router.post('/success', async (req, res) => {
//     try {
      
//       const tran_id = req.query.tran_id || req.body.tran_id;
//       console.log("Received tran_id:", tran_id);
  
//       if (!tran_id) return res.status(400).send('Missing transaction ID');
  
//       const order = await OrderModel.findOneAndUpdate(
//         { orderId: tran_id },
//         { payment_status: 'Success', paymentId: req.body.val_id || '' },
//         { new: true }
//       );
  
//       if (!order) return res.status(404).send('Order not found');
//       const userId = order.userId
//         await UserModel.findByIdAndUpdate(
//             userId,
//             { $push: { orderHistory: order._id } },
//             { new: true } // Return updated user document
//         );
  
//       // HTML redirect for POST
//       res.send(`
//         <html>
//           <head>
//             <meta http-equiv="refresh" content="0; URL='https://deshbd.netlify.app/userprofile'" />
//           </head>
//           <body>
//             Redirecting to your profile...
//           </body>
//         </html>
//       `);
//     } catch (err) {
//       console.error('Payment success error:', err.message, err.stack);
//       res.status(500).send('Internal server error');
//     }
//   });

router.post('/success', async (req, res) => {
  try {
    // TEMP TEST ONLY
    return res.redirect("https://deshbd.netlify.app/userprofile");

    // ... your existing logic
  } catch (err) {
    console.error('Payment success error:', err.message);
    res.status(500).send('Internal server error');
  }
});

router.post('/fail', (req, res) => {
    return res.redirect(`${process.env.FRONTEND_URL}/payment-fail`);
});

router.post('/cancel', (req, res) => {
    return res.redirect(`${process.env.FRONTEND_URL}/payment-cancel`);
});

module.exports = router;
