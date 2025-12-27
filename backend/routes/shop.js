const express = require('express');
const router = express.Router();

const {
  registerShop,
  getShop,
  updateShop,
  getNearbyShops,
  getShopById,
} = require('../controllers/shopController');

const { protect, authorize } = require('../middlewares/auth');
const { validateShopRegistration } = require('../middlewares/validator');

router.post('/', protect, authorize('shop_owner'), validateShopRegistration, registerShop);
router.get('/my-shop', protect, authorize('shop_owner'), getShop);
router.put('/my-shop', protect, authorize('shop_owner'), updateShop);
router.get('/nearby', getNearbyShops);
router.get('/:id', protect, getShopById);

module.exports = router;
