const express = require('express');
const router = express.Router();
const { body, query } = require('express-validator');
const upload = require('../config/multer');
const productController = require('../controllers/productController');
const { requireAuth, requireRole } = require('../middleware/auth');

router.post(
  '/',
  requireAuth,
  requireRole('admin'),
  upload.single('image'),
  [
    body('name').notEmpty().withMessage('Product name is required'),
    body('detail').notEmpty().withMessage('Product detail is required'),
    body('weight').notEmpty().withMessage('Product weight is required'),
    body('price').isNumeric().withMessage('Product price must be a number'),
  ],
  productController.createProduct
);

router.get(
  '/',
  [
    query('search').optional().isString(),
    query('minPrice').optional().isNumeric(),
    query('maxPrice').optional().isNumeric(),
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1 }),
  ],
  productController.getProducts
);

router.get('/admin/stats', requireAuth, requireRole('admin'), productController.getAdminStats);
router.get('/:id', productController.getProductById);

router.put(
  '/:id',
  requireAuth,
  requireRole('admin'),
  upload.single('image'),
  [
    body('name').optional().notEmpty().withMessage('Product name cannot be empty'),
    body('detail').optional().notEmpty().withMessage('Product detail cannot be empty'),
    body('price').optional().isNumeric().withMessage('Product price must be a number'),
  ],
  productController.updateProduct
);

router.delete('/:id', requireAuth, requireRole('admin'), productController.deleteProduct);

module.exports = router;
