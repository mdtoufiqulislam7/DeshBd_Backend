const express = require('express');
const router = express.Router();
const SSLCommerzPayment = require('sslcommerz-lts');
const { v4: uuidv4 } = require('uuid'); // for unique tran_id

const store_id = process.env.SSLCOMMERZ_STORE_ID;
const store_passwd = process.env.SSLCOMMERZ_STORE_PASSWORD;
const is_live = process.env.is_live === "true";

// POST /api/payment/init
router.post('/init', async (req, res) => {
    const { total_amount, user } = req.body;

    const transactionId = uuidv4(); // Unique ID for every payment

    const data = {
        total_amount,
        currency: 'BDT',
        tran_id: transactionId,
        success_url: `${process.env.SERVER_URL}/api/payment/success`,
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
    console.log(data)

    // const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);

    // try {
    //     const apiResponse = await sslcz.init(data);
    //     return res.status(200).json({ url: apiResponse.GatewayPageURL });
    // } catch (error) {
    //     return res.status(500).json({ message: 'Payment initialization failed', error });
    // }
});

module.exports = router;
