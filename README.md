# LocalShop - Local Commerce Platform

A role-based local commerce platform connecting customers with nearby shop owners.

## 🎯 Project Vision

LocalShop helps local businesses compete with large online brands by providing:
- Fast local delivery (within hours)
- Easy inventory management via WhatsApp
- Time-based order confirmation
- Simple UX for non-technical shop owners

## 👥 User Roles

### 1. Customer (Web App)
- Browse products from nearby local shops
- Search and filter products
- Place orders with pickup/delivery options
- Select convenience time for order confirmation
- Track order status

### 2. Shop Owner (Mobile App)
- Register shop details
- Upload inventory via WhatsApp messages
- Manage orders
- Confirm/complete orders
- View order urgency indicators

## 🏗️ Architecture

This is a **monorepo** containing:
- `backend/` - Node.js + Express + MongoDB API
- `web-client/` - React.js customer web application
- `mobile-client/` - React Native shop owner mobile application
- `shared/` - Shared constants and utilities
- `docs/` - Documentation

## 🚀 Getting Started

### Prerequisites
- Node.js (v16+)
- MongoDB
- npm or yarn

### Backend Setup
```bash
cd backend
npm install
# Create .env file with your configuration
npm run dev
```

### Web Client Setup
```bash
cd web-client
npm install
npm run dev
```

### Mobile Client Setup
```bash
cd mobile-client
npm install
npm start
```

## 🔑 Key Features

### WhatsApp-Based Inventory Upload (USP)
Shop owners send messages like:
```
Product: Rice
Category: Grocery
Price: 50
Quantity: 20
```

Backend parses and updates inventory automatically.

### Time-Based Order Confirmation
- Customer selects convenience time
- Shop owner must confirm within deadline
- Auto-notification if unconfirmed
- Customer can order from another shop

### Order Flow
1. Customer places order
2. System sets confirmation deadline
3. Shop owner confirms (or timer expires)
4. Shop owner marks complete
5. Notifications sent at each stage

## 📁 Folder Structure

```
Project-folder/
├── backend/
│   ├── config/
│   ├── models/
│   ├── routes/
│   ├── controllers/
│   ├── services/
│   ├── middlewares/
│   ├── utils/
│   └── app.js
├── web-client/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── context/
│   │   └── routes/
│   └── package.json
├── mobile-client/
│   ├── src/
│   │   ├── screens/
│   │   ├── components/
│   │   ├── services/
│   │   └── context/
│   └── package.json
├── shared/
│   ├── constants/
│   ├── schemas/
│   └── utils/
├── docs/
└── README.md
```

## 🛠️ Tech Stack

- **Backend**: Node.js, Express, MongoDB, JWT
- **Web**: React.js, React Router, Axios, Vite
- **Mobile**: React Native, Expo, React Navigation
- **Integration**: WhatsApp Cloud API

## 📝 License

MIT

## 👨‍💻 Contributing

This is a hackathon project focused on MVP development.
