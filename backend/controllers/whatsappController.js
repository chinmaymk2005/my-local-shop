const { webhookVerifyToken } = require('../config/whatsapp');

// @desc    Verify WhatsApp webhook
// @route   GET /api/whatsapp/webhook
// @access  Public
exports.webhookVerify = (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode && token) {
    if (mode === 'subscribe' && token === webhookVerifyToken) {
      console.log('✅ Webhook verified');
      res.status(200).send(challenge);
    } else {
      res.sendStatus(403);
    }
  }
};

// @desc    Handle incoming WhatsApp messages
// @route   POST /api/whatsapp/webhook
// @access  Public
exports.webhookHandler = async (req, res) => {
  try {
    const body = req.body;

    if (body.object) {
      if (body.entry && body.entry[0].changes && body.entry[0].changes[0].value.messages) {
        const message = body.entry[0].changes[0].value.messages[0];
        const from = message.from;
        const text = message.text.body;

        console.log('📩 Message received from:', from);
        console.log('📝 Message text:', text);

        // TODO: Parse message and update inventory
        // TODO: Map phone number to shop
        // TODO: Extract product details

        res.sendStatus(200);
      } else {
        res.sendStatus(404);
      }
    } else {
      res.sendStatus(404);
    }
  } catch (error) {
    console.error('WhatsApp webhook error:', error);
    res.sendStatus(500);
  }
};
