const mongoose = require('mongoose')


const productSchema = new mongoose.Schema({
    productName: {
      type: String,
      required: true
    },
    productImage: {
        type: String,
        required: true
    },
    price: {
      type: String,
      required: true
    },
    description: {
        type : String,
        required: true,
    },
    quality: {
      type: String,
      enum: ["High", "Medium", "Low"],
      default: "High",
      required: true,
    },
    user: {
         type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    size: {
        type: String,
        enum: ["S", "M", "L", "XL", "XXL"],
        required: true
    }
  });
  
  const Product = mongoose.model('Product', productSchema);
  
  module.exports = Product