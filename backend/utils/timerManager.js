// Timer management for order confirmation deadlines

// TODO: Implement with node-cron or bull queue
const activeTimers = new Map();

exports.setOrderTimer = (orderId, deadline, callback) => {
  const now = new Date();
  const delay = new Date(deadline) - now;

  if (delay > 0) {
    const timer = setTimeout(() => {
      callback(orderId);
      activeTimers.delete(orderId);
    }, delay);

    activeTimers.set(orderId, timer);
    console.log(`⏰ Timer set for order ${orderId}, expires in ${delay}ms`);
  }
};

exports.clearOrderTimer = (orderId) => {
  if (activeTimers.has(orderId)) {
    clearTimeout(activeTimers.get(orderId));
    activeTimers.delete(orderId);
    console.log(`🔕 Timer cleared for order ${orderId}`);
  }
};

exports.getActiveTimers = () => {
  return activeTimers.size;
};
