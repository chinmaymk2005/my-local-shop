const express = require('express');
const router = express.Router();
const {
  createOrder,
  getMyOrders,
  getShopOrders,
  confirmOrder,
  completeOrder,
} = require('../controllers/orderController');
const { protect, authorize } = require('../middlewares/auth');

router.post('/', protect, authorize('customer'), createOrder);
router.get('/my-orders', protect, authorize('customer'), getMyOrders);
router.get('/shop-orders', protect, authorize('shop_owner'), getShopOrders);
router.put('/:id/confirm', protect, authorize('shop_owner'), confirmOrder);
router.put('/:id/complete', protect, authorize('shop_owner'), completeOrder);

module.exports = router;
