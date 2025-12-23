# LocalShop Architecture

## System Overview

LocalShop is a monorepo-based platform with three main components:
1. Backend API (Node.js + Express + MongoDB)
2. Web Client (React.js for Customers)
3. Mobile Client (React Native for Shop Owners)

## Role-Based Access

### Customers
- Access: Web browser
- Authentication: JWT token
- Capabilities:
  - Browse products
  - Search and filter
  - Place orders
  - Track order status

### Shop Owners
- Access: Mobile app (Android/iOS)
- Authentication: JWT token
- Capabilities:
  - Register shop
  - Upload inventory via WhatsApp
  - View and manage orders
  - Confirm/complete orders

## Data Flow

### 1. Authentication Flow
```
User → Frontend → Backend API → MongoDB
                ← JWT Token ←
```

### 2. WhatsApp Inventory Upload Flow
```
Shop Owner → WhatsApp → WhatsApp Cloud API → Backend Webhook
                                             ↓
                                    Parse Message → Map to Shop
                                             ↓
                                    Create/Update Product → MongoDB
```

### 3. Order Confirmation Flow
```
Customer → Place Order → Backend
                         ↓
                    Set Timer (based on convenience time)
                         ↓
                    Notify Shop Owner
                         ↓
              Shop Owner Confirms? ─┬─ Yes → Order Confirmed
                                    │
                                    └─ No (timeout) → Auto-mark Unconfirmed
                                                    → Notify Customer
```

## Database Schema

### Collections

1. **users**
   - _id, name, mobile, password (hashed), role, createdAt

2. **shops**
   - _id, owner (ref: User), shopName, address, mobile, isActive, createdAt

3. **products**
   - _id, shop (ref: Shop), name, category, price, quantity, isAvailable, createdAt, updatedAt

4. **orders**
   - _id, customer (ref: User), shop (ref: Shop), products[], totalAmount, orderType, convenienceTime, status, confirmationDeadline, createdAt

## API Routes

### Authentication
- POST `/api/auth/register` - Register user
- POST `/api/auth/login` - Login user
- GET `/api/auth/me` - Get current user

### Shops
- POST `/api/shops` - Register shop (shop_owner only)
- GET `/api/shops/my-shop` - Get my shop (shop_owner only)
- PUT `/api/shops/my-shop` - Update shop (shop_owner only)
- GET `/api/shops/nearby` - Get nearby shops (public)

### Products
- GET `/api/products` - Get all products (public)
- GET `/api/products/:id` - Get product by ID (public)
- POST `/api/products` - Create product (shop_owner only)
- PUT `/api/products/:id` - Update product (shop_owner only)
- DELETE `/api/products/:id` - Delete product (shop_owner only)

### Orders
- POST `/api/orders` - Create order (customer only)
- GET `/api/orders/my-orders` - Get customer orders (customer only)
- GET `/api/orders/shop-orders` - Get shop orders (shop_owner only)
- PUT `/api/orders/:id/confirm` - Confirm order (shop_owner only)
- PUT `/api/orders/:id/complete` - Complete order (shop_owner only)

### WhatsApp
- GET `/api/whatsapp/webhook` - Webhook verification
- POST `/api/whatsapp/webhook` - Webhook handler

## Security

- All routes except auth and public product listing require JWT authentication
- Role-based authorization enforced at backend level
- Password hashing using bcrypt
- Input validation on all endpoints

## Scalability Considerations

### Current Implementation
- Simple timer-based order confirmation
- In-memory timer management

### Production Recommendations
- Use Redis for timer/queue management
- Implement proper job queue (Bull, BullMQ)
- Add WebSocket for real-time order updates
- Implement geolocation-based shop filtering
- Add caching layer for product listing
