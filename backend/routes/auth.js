const express = require('express');
const router = express.Router();
const { register, login, getMe } = require('../controllers/authController');
const { protect } = require('../middlewares/auth');
const { validateRegistration } = require('../middlewares/validator');

router.post('/register', validateRegistration, register);
router.post('/login', login);
router.get('/me', protect, getMe);

module.exports = router;
