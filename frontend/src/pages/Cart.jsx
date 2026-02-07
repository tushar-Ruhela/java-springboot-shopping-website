import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const Cart = () => {
  const navigate = useNavigate();
  const { cartItems, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart();

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity >= 1) {
      updateQuantity(productId, newQuantity);
    }
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  // Empty Cart State
  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-sky-50 to-blue-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full mx-auto text-center">
          <div className="mx-auto w-32 h-32 bg-gradient-to-r from-gray-200 to-gray-300 rounded-3xl flex items-center justify-center mb-8 shadow-2xl">
            <span className="text-5xl">🛒</span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-gray-900 to-sky-600 bg-clip-text text-transparent mb-6">
            Your Cart is Empty
          </h2>
          <p className="text-xl text-gray-600 mb-12 max-w-sm mx-auto leading-relaxed">
            You haven't added any items to your cart yet.
          </p>
          <button 
            onClick={() => navigate('/')}
            className="w-full bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 text-white font-bold py-5 px-8 rounded-3xl shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 hover:scale-[1.02] transition-all duration-300 text-xl flex items-center justify-center gap-3 mx-auto"
          >
            <span>🛍️</span>
            Continue Shopping
          </button>
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
            Shopping Cart
          </h1>
          <div className="flex items-center justify-center gap-2 text-xl text-gray-600">
            <span>{cartItems.length}</span>
            <span>items</span>
            <span>|</span>
            <span className="font-bold text-sky-600">${getCartTotal().toFixed(2)}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white/90 backdrop-blur-xl shadow-2xl rounded-3xl border border-white/50 p-8">
              <div className="space-y-6">
                {cartItems.map((item) => (
                  <div key={item.id} className="group flex items-center gap-6 p-6 bg-sky-50/50 rounded-3xl border border-sky-100 hover:shadow-xl hover:border-sky-200 transition-all duration-300 hover:-translate-y-1">
                    {/* Product Image */}
                    <div className="relative">
                      <img 
                        src={item.imageUrl} 
                        alt={item.name}
                        className="w-28 h-28 object-cover rounded-2xl shadow-lg group-hover:scale-105 transition-transform duration-300 flex-shrink-0"
                      />
                      <div className="absolute -top-2 -right-2 w-8 h-8 bg-emerald-500 text-white rounded-full flex items-center justify-center text-sm font-bold shadow-lg">
                        {item.quantity}
                      </div>
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-sky-600 transition-colors">
                        {item.name}
                      </h3>
                      <p className="text-lg font-semibold text-emerald-600 mb-4">
                        ${item.price.toFixed(2)}
                      </p>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-3 px-6 py-4 bg-white rounded-2xl shadow-md border border-sky-100">
                      <button
                        className="w-12 h-12 bg-sky-100 hover:bg-sky-200 text-sky-600 font-bold text-2xl rounded-xl shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                      >
                        −
                      </button>
                      <span className="text-2xl font-bold text-gray-800 w-12 text-center">
                        {item.quantity}
                      </span>
                      <button
                        className="w-12 h-12 bg-sky-100 hover:bg-sky-200 text-sky-600 font-bold text-2xl rounded-xl shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-center"
                        onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                      >
                        +
                      </button>
                    </div>

                    {/* Item Total */}
                    <div className="text-right">
                      <div className="text-3xl font-bold text-emerald-600 mb-2">
                        ${(item.price * item.quantity).toFixed(2)}
                      </div>
                      <div className="text-sm text-gray-500">Subtotal</div>
                    </div>

                    {/* Remove Button */}
                    <button
                      className="w-12 h-12 bg-red-100 hover:bg-red-200 text-red-600 hover:text-red-700 font-bold text-xl rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-center group-hover:scale-110"
                      onClick={() => removeFromCart(item.id)}
                      title="Remove item"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:sticky lg:top-24">
            <div className="bg-white/90 backdrop-blur-xl shadow-2xl rounded-3xl border border-white/50 p-8 lg:p-10">
              <h2 className="text-2xl font-bold text-gray-800 mb-8 flex items-center gap-3">
                <span className="text-3xl">📋</span>
                Order Summary
              </h2>

              {/* Summary Details */}
              <div className="space-y-4 mb-8">
                <div className="flex justify-between items-center p-4 bg-sky-50/50 rounded-2xl border border-sky-100">
                  <span className="text-lg font-semibold text-gray-700">Subtotal ({cartItems.length} items)</span>
                  <span className="text-2xl font-bold text-gray-900">${getCartTotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100">
                  <span className="text-lg font-semibold text-gray-700">Shipping</span>
                  <span className="text-lg font-bold text-emerald-600">Free</span>
                </div>
              </div>

              {/* Total */}
              <div className="bg-gradient-to-r from-emerald-500 via-emerald-600 to-sky-500 text-white p-8 rounded-3xl shadow-2xl mb-8">
                <div className="flex items-center justify-between text-2xl">
                  <span className="font-bold">Total Amount</span>
                  <span className="text-4xl font-bold">${getCartTotal().toFixed(2)}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-4">
                <button 
                  onClick={handleCheckout}
                  className="w-full bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 text-white font-bold py-5 px-8 rounded-3xl shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 hover:scale-[1.02] transition-all duration-300 text-xl uppercase tracking-wide flex items-center justify-center gap-3"
                >
                  <span>🛒</span>
                  Proceed to Checkout
                </button>
                <button 
                  onClick={clearCart}
                  className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-4 px-8 rounded-2xl border-2 border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 text-lg flex items-center justify-center gap-2"
                >
                  <span>🗑️</span>
                  Clear Cart
                </button>
              </div>

              {/* Security Badge */}
              <div className="mt-8 pt-6 border-t border-sky-100 text-center">
                <p className="text-sm text-gray-500 flex items-center justify-center gap-2">
                  <span>🛡️</span>
                  Secure checkout • Free shipping • Easy returns
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
