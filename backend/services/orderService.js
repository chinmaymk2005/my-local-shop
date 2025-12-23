// Order-related business logic

// Calculate confirmation deadline based on convenience time
exports.calculateConfirmationDeadline = (convenienceTime) => {
  const now = new Date();
  let minutesToAdd;

  switch (convenienceTime) {
    case '20mins':
      minutesToAdd = 5; // Shop has 5 mins to confirm
      break;
    case '40mins':
      minutesToAdd = 10; // Shop has 10 mins to confirm
      break;
    case '1-2hours':
      minutesToAdd = 20; // Shop has 20 mins to confirm
      break;
    case 'anytime_today':
      minutesToAdd = 30; // Shop has 30 mins to confirm
      break;
    default:
      minutesToAdd = 10;
  }

  return new Date(now.getTime() + minutesToAdd * 60000);
};

// Check if order confirmation is overdue
exports.isConfirmationOverdue = (confirmationDeadline) => {
  return new Date() > new Date(confirmationDeadline);
};
