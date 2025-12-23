// /api/products/{Below all sub routes} 


const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');
const { protect, authorize } = require('../middlewares/auth');

router.get('/', getProducts);
router.get('/:id', getProductById);
router.post('/', protect, authorize('shop_owner'), createProduct);
router.put('/:id', protect, authorize('shop_owner'), updateProduct);
router.delete('/:id', protect, authorize('shop_owner'), deleteProduct);

module.exports = router;
