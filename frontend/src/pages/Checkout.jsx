import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { orderAPI } from '../services/api';

const Checkout = () => {
  const navigate = useNavigate();
  const { cartItems, getCartTotal, clearCart } = useCart();
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    shippingAddress: '',
  });
  const [loading, setLoading] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderId, setOrderId] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const orderData = {
        ...formData,
        totalAmount: getCartTotal(),
        orderItems: cartItems.map((item) => ({
          product: { id: item.id },
          quantity: item.quantity,
          price: item.price,
        })),
      };

      const response = await orderAPI.createOrder(orderData);
      setOrderId(response.data.id);
      setOrderSuccess(true);
      clearCart();
    } catch (error) {
      console.error('Error creating order:', error);
      alert('Failed to create order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0 && !orderSuccess) {
    navigate('/cart');
    return null;
  }

  // Success Page
  if (orderSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-sky-50 to-blue-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl w-full mx-auto">
          <div className="bg-white/90 backdrop-blur-xl shadow-2xl rounded-3xl border border-white/50 p-12 text-center">
            <div className="mx-auto w-32 h-32 bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-3xl flex items-center justify-center mb-8 shadow-2xl">
              <span className="text-5xl text-white">✓</span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-gray-900 to-emerald-600 bg-clip-text text-transparent mb-6">
              Order Placed Successfully!
            </h1>
            <div className="bg-emerald-50 border-2 border-emerald-200 rounded-2xl p-8 mb-8">
              <p className="text-2xl font-bold text-emerald-800 mb-4">Order ID: <span className="font-mono bg-white px-4 py-2 rounded-xl shadow-inner">#{orderId}</span></p>
              <p className="text-xl text-gray-700">We'll send a confirmation email to <strong>{formData.customerEmail}</strong></p>
            </div>
            <button 
              onClick={() => navigate('/')}
              className="w-full bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 text-white font-bold py-5 px-8 rounded-3xl shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 hover:scale-[1.02] transition-all duration-300 text-xl flex items-center justify-center gap-3 mx-auto"
            >
              <span>🛍️</span>
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-sky-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-gray-900 to-sky-600 bg-clip-text text-transparent mb-4">
            Checkout
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Complete your purchase securely
          </p>
          <div className="flex items-center justify-center gap-2 mt-4 text-sm text-gray-500">
            <span>🛒</span>
            <span>{cartItems.length} items</span>
            <span>|</span>
            <span className="font-bold text-sky-600">${getCartTotal().toFixed(2)}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Checkout Form */}
          <div className="lg:order-2">
            <div className="bg-white/90 backdrop-blur-xl shadow-2xl rounded-3xl border border-white/50 p-8 lg:p-10">
              <h2 className="text-2xl font-bold text-gray-800 mb-8 flex items-center gap-3">
                <span className="text-3xl">📦</span>
                Shipping Information
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Full Name */}
                <div>
                  <label htmlFor="customerName" className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <span className="text-xl text-sky-400">👤</span>
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="customerName"
                    name="customerName"
                    value={formData.customerName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-5 py-4 text-lg bg-white/70 backdrop-blur-sm border-2 border-sky-100 rounded-2xl focus:border-sky-400 focus:outline-none focus:ring-4 focus:ring-sky-100/50 transition-all duration-300 placeholder-gray-400 shadow-lg hover:shadow-xl"
                    placeholder="John Doe"
                  />
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="customerEmail" className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <span className="text-xl text-sky-400">📧</span>
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="customerEmail"
                    name="customerEmail"
                    value={formData.customerEmail}
                    onChange={handleInputChange}
                    required
                    className="w-full px-5 py-4 text-lg bg-white/70 backdrop-blur-sm border-2 border-sky-100 rounded-2xl focus:border-sky-400 focus:outline-none focus:ring-4 focus:ring-sky-100/50 transition-all duration-300 placeholder-gray-400 shadow-lg hover:shadow-xl"
                    placeholder="john@example.com"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label htmlFor="customerPhone" className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <span className="text-xl text-sky-400">📱</span>
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    id="customerPhone"
                    name="customerPhone"
                    value={formData.customerPhone}
                    onChange={handleInputChange}
                    required
                    className="w-full px-5 py-4 text-lg bg-white/70 backdrop-blur-sm border-2 border-sky-100 rounded-2xl focus:border-sky-400 focus:outline-none focus:ring-4 focus:ring-sky-100/50 transition-all duration-300 placeholder-gray-400 shadow-lg hover:shadow-xl"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>

                {/* Address */}
                <div>
                  <label htmlFor="shippingAddress" className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <span className="text-xl text-sky-400">📍</span>
                    Shipping Address <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="shippingAddress"
                    name="shippingAddress"
                    value={formData.shippingAddress}
                    onChange={handleInputChange}
                    rows="4"
                    required
                    className="w-full px-5 py-4 text-lg bg-white/70 backdrop-blur-sm border-2 border-sky-100 rounded-2xl focus:border-sky-400 focus:outline-none focus:ring-4 focus:ring-sky-100/50 transition-all duration-300 placeholder-gray-400 resize-vertical shadow-lg hover:shadow-xl"
                    placeholder="Enter your full shipping address"
                  />
                </div>

                {/* Place Order Button */}
                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-emerald-500 via-emerald-600 to-sky-600 hover:from-emerald-600 hover:to-sky-700 text-white font-bold py-6 px-8 rounded-3xl shadow-2xl hover:shadow-3xl transform hover:-translate-y-2 hover:scale-[1.02] transition-all duration-400 text-xl flex items-center justify-center gap-4 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none uppercase tracking-wide"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                      <span>Processing Order...</span>
                    </>
                  ) : (
                    <>
                      <span className="text-2xl">🛒</span>
                      <span>Place Order - ${getCartTotal().toFixed(2)}</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:order-1">
            <div className="bg-white/90 backdrop-blur-xl shadow-2xl rounded-3xl border border-white/50 p-8 sticky top-24 lg:top-32">
              <h2 className="text-2xl font-bold text-gray-800 mb-8 flex items-center gap-3">
                <span className="text-3xl">📋</span>
                Order Summary
              </h2>

              {/* Cart Items */}
              <div className="space-y-4 mb-8 max-h-96 overflow-y-auto">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 p-4 bg-sky-50/50 rounded-2xl border border-sky-100 hover:shadow-md transition-all duration-200 group">
                    <img 
                      src={item.imageUrl} 
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-xl shadow-lg flex-shrink-0 group-hover:scale-105 transition-transform duration-200"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-lg text-gray-900 mb-1 line-clamp-2">{item.name}</h4>
                      <p className="text-sm text-gray-600">Qty: {item.quantity} × ${item.price.toFixed(2)}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-bold text-emerald-600">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Total */}
              <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white p-8 rounded-3xl shadow-2xl mb-6">
                <div className="flex items-center justify-between text-xl">
                  <span className="font-bold">Total Amount</span>
                  <span className="text-3xl font-bold">${getCartTotal().toFixed(2)}</span>
                </div>
              </div>

              <div className="text-xs text-gray-500 text-center p-4 bg-sky-50/50 rounded-2xl border border-sky-100">
                <p>🛡️ Secure checkout • 🔒 SSL protected • ⚡ Fast processing</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
