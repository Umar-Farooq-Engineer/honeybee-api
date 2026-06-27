const Product = require('../models/product');
const { validationResult } = require('express-validator');

exports.createProduct = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Product image is required' });
    }

    const imageUrl = encodeURI(`${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`);
    const product = await Product.create({
      image: imageUrl,
      name: req.body.name,
      detail: req.body.detail,
      weight: req.body.weight,
      price: Number(req.body.price),
      category: req.body.category || 'general',
      stock: Number(req.body.stock || 1),
    });

    res.status(201).json({ success: true, product });
  } catch (error) {
    next(error);
  }
};

exports.getProducts = async (req, res, next) => {
  try {
    const { search = '', minPrice = 0, maxPrice = 9999999, page = 1, limit = 8 } = req.query;
    const query = {
      name: { $regex: search.trim(), $options: 'i' },
      price: { $gte: Number(minPrice), $lte: Number(maxPrice) },
    };

    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
      .sort({ createdAt: -1 })
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit));

    res.json({ success: true, products, pagination: { total, page: Number(page), limit: Number(limit) } });
  } catch (error) {
    next(error);
  }
};

exports.getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.json({ success: true, product });
  } catch (error) {
    next(error);
  }
};

exports.updateProduct = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const updates = {
      name: req.body.name,
      detail: req.body.detail,
      weight: req.body.weight,
      price: Number(req.body.price),
      category: req.body.category,
      stock: Number(req.body.stock || 1),
    };

    if (req.file) {
      updates.image = encodeURI(`${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`);
    }

    const product = await Product.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.json({ success: true, product });
  } catch (error) {
    next(error);
  }
};

exports.deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    next(error);
  }
};

exports.getAdminStats = async (req, res, next) => {
  try {
    const totalProducts = await Product.countDocuments();
    const lowStock = await Product.countDocuments({ stock: { $lte: 5 } });
    res.json({ success: true, stats: { totalProducts, lowStock } });
  } catch (error) {
    next(error);
  }
};
