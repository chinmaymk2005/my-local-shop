'use client';

import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { createOrder, getShopById } from '../services/api';

const CONVENIENCE_TIMES = [
  { value: '20mins', label: '⚡ 20 mins', bgColor: '#ef4444', borderColor: '#dc2626' },
  { value: '40mins', label: '🟡 40 mins', bgColor: '#eab308', borderColor: '#ca8a04' },
  { value: '1-2hours', label: '🟢 1-2 hours', bgColor: '#22c55e', borderColor: '#16a34a' },
  { value: 'anytime_today', label: '🕐 Anytime today', bgColor: '#3b82f6', borderColor: '#1d4ed8' },
];

const ProductDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const product = location.state?.product;

  const [shopMobile, setShopMobile] = useState('N/A');
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Order form state
  const [quantity, setQuantity] = useState(1);
  const [orderType, setOrderType] = useState(null);
  const [convenienceTime, setConvenienceTime] = useState(null);

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-2xl shadow-lg text-center">
          <p className="text-gray-600 text-lg">No product data available.</p>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  useEffect(() => {
    const fetchShopDetails = async () => {
      try {
        const data = await getShopById(product.shop._id, localStorage.getItem('token'));
        if (data?.success) {
          setShopMobile(data.shop.mobile);
        }
      } catch (error) {
        console.error('Error fetching shop details:', error);
      }
    };

    if (product?.shop?._id) {
      fetchShopDetails();
    }
  }, [product]);

  const handleBuyNow = () => {
    setShowOrderForm(true);
  };

  const handlePlaceOrder = async () => {
    if (!orderType) {
      setError('Please select a delivery option');
      return;
    }
    if (!convenienceTime) {
      setError('Please select a convenience time');
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const payload = {
        quantity: parseInt(quantity),
        orderType: orderType,
        convenienceTime: convenienceTime,
      };

      const data = await createOrder(payload, localStorage.getItem('token'), product._id);

      console.log('Order created successfully:', data);

      if (data.success) {
        setShowOrderForm(false);
        const deliveryLabel = orderType === 'pickup' ? 'Pick Up' : 'Home Delivery';
        alert(`✅ Order placed! Delivery: ${deliveryLabel} | Quantity: ${quantity} | Time: ${CONVENIENCE_TIMES.find(t => t.value === convenienceTime)?.label}`);
        // Reset form
        setQuantity(1);
        setOrderType(null);
        setConvenienceTime(null);
      } else {
        setError(data.message || 'Failed to create order');
      }
    } catch (err) {
      console.error('Error creating order:', err);
      setError('An error occurred while creating the order');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelOrder = () => {
    setShowOrderForm(false);
    setQuantity(1);
    setOrderType(null);
    setConvenienceTime(null);
    setError(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          {/* Logo & Back Button */}
          <div className="flex items-center gap-4">
            <div className="text-2xl font-bold text-blue-600">LocalShop</div>

          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition duration-200 font-medium"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <button
          onClick={() => navigate(-1)}
          className="my-2 flex items-center gap-2 px-3 py-2 text-gray-700 hover:bg-gray-200 rounded-lg transition duration-200"
        >
          <span className="text-lg">←</span>
          <span className="hidden sm:inline">Back</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left Column - Product Image */}
          <div className="flex flex-col items-center">
            <div className="w-full aspect-square bg-white rounded-2xl shadow-lg p-6 flex items-center justify-center overflow-hidden hover:shadow-xl transition-shadow duration-300 group">
              {product.image ? (
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="flex flex-col items-center gap-4 text-gray-400">
                  <div className="text-6xl">📦</div>
                  <p className="text-lg">No image available</p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Product Info */}
          <div className="flex flex-col justify-between">
            {/* Product Details Card */}
            <div className="space-y-6">
              {/* Product Title */}
              <div>
                <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-2">{product.name}</h1>
                <p className="text-gray-600">{product.category}</p>
              </div>

              {/* Price & Stock Badges */}
              <div className="flex flex-wrap gap-4 items-center">
                <div className="text-4xl font-bold text-blue-600">
                  ₹{product.price}
                </div>
                <div className="flex gap-2">
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
                    In Stock
                  </span>
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
                    {product.quantity} Available
                  </span>
                </div>
              </div>

              {/* Description */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
                <p className="text-gray-700 leading-relaxed text-base">{product.description}</p>
              </div>

              {/* Shop Details Card */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Shop Details</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <span className="text-gray-700 font-medium">Shop Name:</span>
                    <span className="text-gray-900 font-semibold">{product.shop?.shopName || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between items-start">
                    <span className="text-gray-700 font-medium">Distance:</span>
                    <span className="text-gray-900 font-semibold">{product?.shopDistance || 'N/A'} km</span>
                  </div>
                  <div className="flex justify-between items-start">
                    <span className="text-gray-700 font-medium">Address:</span>
                    <span className="text-gray-900 font-semibold text-right">
                      {product.shop?.address?.street}, {product.shop?.address?.city}
                    </span>
                  </div>
                  <div className="flex justify-between items-start pt-2 border-t border-blue-200">
                    <span className="text-gray-700 font-medium">Contact:</span>
                    <span className="text-gray-900 font-semibold">{shopMobile}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                {error}
              </div>
            )}

            {/* Buy Now Button & Order Form */}
            <div className="mt-8 space-y-4">
              {!showOrderForm ? (
                <button
                  onClick={handleBuyNow}
                  disabled={isLoading}
                  className="w-full py-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-400 text-white font-bold text-lg rounded-xl transition duration-300 transform hover:scale-105 active:scale-95 shadow-lg"
                >
                  {isLoading ? 'Processing...' : 'Buy Now'}
                </button>
              ) : (
                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-300 bg-white rounded-xl p-6 border border-gray-200 shadow-lg">
                  <h3 className="text-xl font-bold text-gray-900">Complete Your Order</h3>

                  {/* Quantity Selection */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">Quantity (Max: {product.quantity})</label>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        disabled={quantity === 1 || isLoading}
                        className="w-10 h-10 bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 text-gray-700 font-bold rounded-lg transition"
                      >
                        −
                      </button>
                      <input
                        type="number"
                        value={quantity}
                        onChange={(e) => {
                          const val = parseInt(e.target.value) || 1;
                          if (val > 0 && val <= product.quantity) {
                            setQuantity(val);
                          }
                        }}
                        min="1"
                        max={product.quantity}
                        className="w-16 text-center border border-gray-300 rounded-lg py-2 font-semibold"
                      />
                      <button
                        onClick={() => setQuantity(Math.min(product.quantity, quantity + 1))}
                        disabled={quantity === product.quantity || isLoading}
                        className="w-10 h-10 bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 text-gray-700 font-bold rounded-lg transition"
                      >
                        +
                      </button>
                      <span className="text-sm text-gray-600 ml-2">₹{(product.price * quantity).toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Delivery Type Selection */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">Delivery Option</label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => setOrderType('pickup')}
                        className={`py-3 rounded-lg font-semibold transition border-2 flex items-center justify-center gap-2 ${
                          orderType === 'pickup'
                            ? 'bg-blue-500 text-white border-blue-600'
                            : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400'
                        }`}
                      >
                        <span>🏪</span>
                        <span>Pick Up</span>
                      </button>
                      <button
                        onClick={() => setOrderType('home_delivery')}
                        className={`py-3 rounded-lg font-semibold transition border-2 flex items-center justify-center gap-2 ${
                          orderType === 'home_delivery'
                            ? 'bg-green-500 text-white border-green-600'
                            : 'bg-white text-gray-700 border-gray-300 hover:border-green-400'
                        }`}
                      >
                        <span>🚚</span>
                        <span>Home Delivery</span>
                      </button>
                    </div>
                  </div>

                  {/* Convenience Time Selection */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">Convenience Time Slot</label>
                    <div className="grid grid-cols-2 gap-2">
                      {CONVENIENCE_TIMES.map((time) => (
                        <button
                          key={time.value}
                          onClick={() => setConvenienceTime(time.value)}
                          style={
                            convenienceTime === time.value
                              ? {
                                  backgroundColor: time.bgColor,
                                  borderColor: time.borderColor,
                                  color: 'white',
                                }
                              : {
                                  backgroundColor: 'white',
                                  borderColor: '#d1d5db',
                                  color: '#374151',
                                }
                          }
                          className="py-3 rounded-lg font-semibold transition border-2 text-sm hover:shadow-md"
                        >
                          {time.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Error Message */}
                  {error && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                      {error}
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="grid grid-cols-2 gap-3 pt-4">
                    <button
                      onClick={handlePlaceOrder}
                      disabled={isLoading}
                      className="py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-400 text-white font-bold rounded-lg transition"
                    >
                      {isLoading ? '⏳ Processing...' : '✓ Place Order'}
                    </button>
                    <button
                      onClick={handleCancelOrder}
                      disabled={isLoading}
                      className="py-3 bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 text-gray-700 font-semibold rounded-lg transition"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProductDetails;
