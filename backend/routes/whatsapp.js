const express = require('express');
const router = express.Router();
const { webhookVerify, webhookHandler } = require('../controllers/whatsappController');

router.get('/webhook', webhookVerify);
router.post('/webhook', webhookHandler);

module.exports = router;
