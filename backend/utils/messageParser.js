// Parse WhatsApp message to extract product details

exports.parseProductMessage = (messageText) => {
  try {
    const lines = messageText.split('\n').map((line) => line.trim());
    const productData = {};

    lines.forEach((line) => {
      const lowerLine = line.toLowerCase();

      if (lowerLine.startsWith('product:')) {
        productData.name = line.split(':')[1].trim();
      } else if (lowerLine.startsWith('category:')) {
        productData.category = line.split(':')[1].trim();
      } else if (lowerLine.startsWith('price:')) {
        productData.price = parseFloat(line.split(':')[1].trim());
      } else if (lowerLine.startsWith('quantity:')) {
        productData.quantity = parseInt(line.split(':')[1].trim(), 10);
      }
    });

    // Validate required fields
    if (!productData.name || !productData.category || !productData.price || !productData.quantity) {
      return { valid: false, error: 'Missing required fields' };
    }

    return { valid: true, data: productData };
  } catch (error) {
    return { valid: false, error: 'Failed to parse message' };
  }
};
