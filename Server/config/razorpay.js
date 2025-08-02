
const Razorpay = require('razorpay');
require('dotenv').config();

console.log("Key ID:", process.env.RAZORPAY_KEY);
console.log("Key Secret:", process.env.RAZORPAY_SECRET ? "Loaded" : "Missing");


exports.instance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY,
    key_secret: process.env.RAZORPAY_SECRET
})