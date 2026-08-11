const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Description is required']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['Electronics', 'ID & Cards', 'Books & Notes', 'Clothing & Bags', 'Keys', 'Accessories', 'Other'],
    default: 'Other'
  },
  status: {
    type: String,
    required: true,
    enum: ['Lost', 'Found', 'Returned'],
    default: 'Lost'
  },
  location: {
    type: String,
    required: [true, 'Location is required'],
    trim: true
  },
  date: {
    type: Date,
    required: [true, 'Date is required'],
    default: Date.now
  },
  contact: {
    type: String,
    required: [true, 'Contact info is required'],
    trim: true
  },
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Item', itemSchema);
