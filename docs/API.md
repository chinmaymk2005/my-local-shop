# API Documentation

Base URL: `http://localhost:5000/api`

## Authentication

All protected routes require JWT token in header:
```
Authorization: Bearer <token>
```

---

## Auth Routes

### Register User
**POST** `/auth/register`

Request:
```json
{
  "name": "John Doe",
  "mobile": "9876543210",
  "password": "password123",
  "role": "customer" // or "shop_owner"
}
```

Response:
```json
{
  "success": true,
  "token": "jwt-token-here",
  "user": {
    "id": "user-id",
    "name": "John Doe",
    "mobile": "9876543210",
    "role": "customer"
  }
}
```

### Login
**POST** `/auth/login`

Request:
```json
{
  "mobile": "9876543210",
  "password": "password123"
}
```

Response: Same as register

### Get Current User
**GET** `/auth/me`
- Requires: Bearer token
- Returns current user details

---

## Shop Routes

### Register Shop
**POST** `/shops`
- Protected: shop_owner only
- Request:
```json
{
  "shopName": "ABC Store",
  "address": {
    "street": "123 Main St",
    "city": "Mumbai",
    "state": "Maharashtra",
    "pincode": "400001"
  },
  "mobile": "9876543210"
}
```

### Get My Shop
**GET** `/shops/my-shop`
- Protected: shop_owner only

### Get Nearby Shops
**GET** `/shops/nearby`
- Public

---

## Product Routes

### Get Products
**GET** `/products?search=rice&shopId=123&category=grocery`
- Public
- Query params: search, shopId, category

### Get Product by ID
**GET** `/products/:id`
- Public

### Create Product
**POST** `/products`
- Protected: shop_owner only
- Request:
```json
{
  "name": "Rice",
  "category": "Grocery",
  "price": 50,
  "quantity": 20
}
```

### Update Product
**PUT** `/products/:id`
- Protected: shop_owner only

### Delete Product
**DELETE** `/products/:id`
- Protected: shop_owner only

---

## Order Routes

### Create Order
**POST** `/orders`
- Protected: customer only
- Request:
```json
{
  "shop": "shop-id",
  "products": [
    {
      "product": "product-id",
      "quantity": 2
    }
  ],
  "orderType": "delivery", // or "pickup"
  "convenienceTime": "40mins" // "20mins", "1-2hours", "anytime_today"
}
```

### Get My Orders
**GET** `/orders/my-orders`
- Protected: customer only

### Get Shop Orders
**GET** `/orders/shop-orders`
- Protected: shop_owner only

### Confirm Order
**PUT** `/orders/:id/confirm`
- Protected: shop_owner only

### Complete Order
**PUT** `/orders/:id/complete`
- Protected: shop_owner only

---

## WhatsApp Routes

### Webhook Verification
**GET** `/whatsapp/webhook?hub.mode=subscribe&hub.verify_token=token&hub.challenge=challenge`

### Webhook Handler
**POST** `/whatsapp/webhook`
- Receives WhatsApp messages
- Parses product details
- Updates inventory

---

## Error Responses

All errors follow this format:
```json
{
  "success": false,
  "error": "Error message here"
}
```

Common status codes:
- 400 - Bad Request
- 401 - Unauthorized
- 403 - Forbidden
- 404 - Not Found
- 500 - Internal Server Error
