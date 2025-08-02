const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true,
  },
  orderId: {
    type: String,
    required: true,
    unique: true,
  },
  paymentId: {
    type: String,
    required: true,
    unique: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  currency: {
    type: String,
    default: 'INR',
  },
  status: {
    type: String,
    enum: ['Pending', 'Completed', 'Failed'],
    default: 'Pending',
  },
  paymentMethod: {
    type: String,
    required: true,
  },
  transactionDate: {
    type: Date,
    default: Date.now,
  },
  courseDetails: {
    courseName: String,
    instructorName: String,
    thumbnail: String,
  },
  userDetails: {
    firstName: String,
    lastName: String,
    email: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model('Payment', paymentSchema); 