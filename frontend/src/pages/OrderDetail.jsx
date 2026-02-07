import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { orderAPI } from '../services/api';

const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOrderDetails();
  }, [id]);

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      const response = await orderAPI.getOrderById(id);
      setOrder(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching order details:', err);
      setError('Failed to load order details');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      PENDING: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      CONFIRMED: 'bg-blue-100 text-blue-800 border-blue-200',
      SHIPPED: 'bg-purple-100 text-purple-800 border-purple-200',
      DELIVERED: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      CANCELLED: 'bg-red-100 text-red-800 border-red-200',
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getPaymentColor = (status) => {
    const colors = {
      PAID: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      PENDING: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      FAILED: 'bg-red-100 text-red-800 border-red-200',
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusSteps = () => {
    const allSteps = ['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED'];
    const currentIndex = allSteps.indexOf(order?.status);
    return allSteps.map((step, index) => ({
      name: step,
      completed: index <= currentIndex,
      active: index === currentIndex,
    }));
  };

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-sky-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col items-center justify-center py-24">
            <div className="animate-spin rounded-full h-20 w-20 border-b-2 border-sky-500 mb-8 shadow-lg"></div>
            <p className="text-2xl font-semibold text-gray-700">Loading order details...</p>
            <p className="text-gray-500 mt-2">Fetching order information</p>
          </div>
        </div>
      </div>
    );
  }

  // Error State
  if (error || !order) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-sky-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-3xl shadow-2xl border border-red-100 p-12 text-center max-w-2xl mx-auto">
            <div className="text-6xl mb-6">📦</div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              {error || 'Order not found'}
            </h2>
            <p className="text-lg text-gray-600 mb-8">The order you're looking for doesn't exist</p>
            <button 
              onClick={() => navigate('/orders')}
              className="bg-sky-500 hover:bg-sky-600 text-white font-bold py-4 px-8 rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 text-lg"
            >
              ← Back to Orders
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
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 p-8 mb-8 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <button 
              onClick={() => navigate('/orders')}
              className="flex items-center gap-2 bg-sky-500/90 hover:bg-sky-600 text-white font-semibold px-6 py-3 rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 whitespace-nowrap"
            >
              <span className="text-xl">←</span>
              Back to Orders
            </button>
            <div>
              <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-gray-900 to-sky-600 bg-clip-text text-transparent">
                Order #{order.id}
              </h1>
              <span className={`inline-flex px-6 py-3 rounded-2xl font-bold text-lg border-2 shadow-lg ${getStatusColor(order.status)}`}>
                {order.status}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column: Timeline & Customer Info */}
          <div className="space-y-8">
            {/* Order Timeline */}
            {order.status !== 'CANCELLED' && (
              <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-8 flex items-center gap-3">
                  <span className="text-3xl">📊</span>
                  Order Progress
                </h2>
                <div className="relative">
                  <div className="flex items-center justify-between mb-2">
                    {getStatusSteps().map((step, index) => (
                      <div key={step.name} className="flex flex-col items-center flex-1 relative">
                        <div 
                          className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg transition-all duration-300 text-xl font-bold ${
                            step.completed 
                              ? 'bg-emerald-500 text-white shadow-emerald-200' 
                              : step.active 
                              ? 'bg-sky-500 text-white shadow-sky-200 ring-4 ring-sky-200' 
                              : 'bg-gray-200 text-gray-500 shadow-gray-200 hover:bg-sky-100'
                          }`}
                        >
                          {step.completed ? '✓' : index + 1}
                        </div>
                        <span className="text-sm font-semibold mt-3 text-gray-700 capitalize">{step.name.toLowerCase()}</span>
                      </div>
                    ))}
                  </div>
                  {/* Timeline Lines */}
                  <div className="absolute top-8 left-20 right-20 h-1 bg-gradient-to-r from-gray-200 via-sky-200 to-emerald-200">
                    <div 
                      className="h-full bg-gradient-to-r from-emerald-400 via-sky-400 to-emerald-400 rounded-full transition-all duration-700"
                      style={{ width: `${((getStatusSteps().findIndex(s => s.active) + 1) / 4) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Customer Information */}
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                <span className="text-3xl">👤</span>
                Customer Information
              </h2>
              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 bg-sky-50/50 rounded-2xl border border-sky-100">
                  <span className="text-2xl text-sky-400 mt-1">👤</span>
                  <div>
                    <span className="block text-sm font-semibold text-gray-600">Name</span>
                    <span className="text-xl font-bold text-gray-900">{order.customerName}</span>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 bg-sky-50/50 rounded-2xl border border-sky-100">
                  <span className="text-2xl text-sky-400 mt-1">📧</span>
                  <div>
                    <span className="block text-sm font-semibold text-gray-600">Email</span>
                    <span className="text-lg text-gray-900 font-medium">{order.customerEmail}</span>
                  </div>
                </div>
                {order.customerPhone && (
                  <div className="flex items-start gap-4 p-4 bg-sky-50/50 rounded-2xl border border-sky-100">
                    <span className="text-2xl text-sky-400 mt-1">📱</span>
                    <div>
                      <span className="block text-sm font-semibold text-gray-600">Phone</span>
                      <span className="text-lg text-gray-900 font-medium">{order.customerPhone}</span>
                    </div>
                  </div>
                )}
                <div className="p-4 bg-sky-50/50 rounded-2xl border border-sky-100">
                  <span className="block text-sm font-semibold text-gray-600 mb-2">Shipping Address</span>
                  <span className="text-lg text-gray-900 font-medium leading-relaxed">{order.shippingAddress}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Order Info & Items */}
          <div className="space-y-8">
            {/* Order Information */}
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                <span className="text-3xl">📋</span>
                Order Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 bg-sky-50/50 rounded-xl border border-sky-100">
                    <span className="text-sm font-semibold text-gray-600">Order Date</span>
                    <span className="font-bold text-gray-900">{formatDate(order.orderDate)}</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-sky-50/50 rounded-xl border border-sky-100">
                    <span className="text-sm font-semibold text-gray-600">Last Updated</span>
                    <span className="font-bold text-gray-900">{formatDate(order.lastUpdated)}</span>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 bg-sky-50/50 rounded-xl border border-sky-100">
                    <span className="text-sm font-semibold text-gray-600">Payment Method</span>
                    <span className="font-bold text-gray-900 capitalize">{order.paymentMethod}</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-sky-50/50 rounded-xl border border-sky-100">
                    <span className="text-sm font-semibold text-gray-600">Payment Status</span>
                    <span className={`px-4 py-2 rounded-xl font-bold text-sm border-2 shadow-md ${getPaymentColor(order.paymentStatus)}`}>
                      {order.paymentStatus}
                    </span>
                  </div>
                </div>
              </div>
              {order.trackingNumber && (
                <div className="mt-6 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">📦</span>
                    <span className="font-bold text-emerald-800">Tracking Number: </span>
                    <span className="font-mono bg-white px-4 py-2 rounded-xl border border-emerald-300 text-emerald-700 font-semibold">
                      {order.trackingNumber}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Order Items */}
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                <span className="text-3xl">🛍️</span>
                Order Items ({order.orderItems.length})
              </h2>
              <div className="space-y-4">
                {order.orderItems.map((item) => (
                  <div key={item.id} className="flex gap-4 p-6 bg-sky-50/50 rounded-2xl border border-sky-100 hover:shadow-md transition-all duration-200">
                    <img 
                      src={item.productImageUrl} 
                      alt={item.productName}
                      className="w-20 h-20 object-cover rounded-xl shadow-lg flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-lg text-gray-900 mb-1 truncate">{item.productName}</h4>
                      <p className="text-sm text-gray-600 mb-2">${item.price.toFixed(2)} × {item.quantity}</p>
                    </div>
                    <div className="flex flex-col items-end justify-center text-right">
                      <span className="text-2xl font-bold text-emerald-600">
                        ${item.subtotal.toFixed(2)}
                      </span>
                      <span className="text-sm text-gray-500">Subtotal</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white p-8 rounded-3xl shadow-2xl">
              <h3 className="text-2xl font-bold mb-4 flex items-center gap-3">
                <span className="text-3xl">💰</span>
                Order Summary
              </h3>
              <div className="text-4xl font-bold text-center py-4">
                Total: ${order.totalAmount.toFixed(2)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
