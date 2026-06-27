const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    image: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    detail: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      trim: true,
      default: 'general',
    },
    weight: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    stock: {
      type: Number,
      default: 1,
      min: 0,
    },
  },
  { timestamps: true }
);

productSchema.index({ name: 'text', detail: 'text', category: 'text' });

const Product = mongoose.model('Product', productSchema);
module.exports = Product;