import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { orderAPI } from '../services/api';

const Orders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(null);
  
  // Filter states
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchOrders();
    fetchStats();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [orders, statusFilter, searchQuery]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await orderAPI.getAllOrders();
      setOrders(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await orderAPI.getOrderStatistics();
      setStats(response.data);
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  const applyFilters = () => {
    let filtered = [...orders];

    // Apply status filter
    if (statusFilter !== 'ALL') {
      filtered = filtered.filter(order => order.status === statusFilter);
    }

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(order =>
        order.id.toString().includes(query) ||
        order.customerName.toLowerCase().includes(query) ||
        order.customerEmail.toLowerCase().includes(query)
      );
    }

    setFilteredOrders(filtered);
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
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-sky-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col items-center justify-center py-24">
            <div className="animate-spin rounded-full h-20 w-20 border-b-2 border-sky-500 mb-8"></div>
            <p className="text-2xl font-semibold text-gray-700">Loading orders...</p>
            <p className="text-gray-500 mt-2">Please wait while we fetch your data</p>
          </div>
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-sky-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-3xl shadow-2xl border border-red-100 p-12 text-center max-w-2xl mx-auto">
            <div className="text-6xl mb-6">⚠️</div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">{error}</h2>
            <p className="text-lg text-gray-600 mb-8">Something went wrong while loading orders</p>
            <button 
              onClick={fetchOrders}
              className="bg-sky-500 hover:bg-sky-600 text-white font-bold py-4 px-8 rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 text-lg"
            >
              🔄 Retry Loading Orders
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-sky-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header & Stats */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 p-8 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
            <div>
              <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-gray-900 to-sky-600 bg-clip-text text-transparent">
                Orders Management
              </h1>
              <p className="text-xl text-gray-600 mt-2">Manage all your customer orders</p>
            </div>
            
            {/* Stats Cards */}
            {stats && (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 flex-wrap">
                <div className="bg-gradient-to-br from-sky-500 to-sky-600 text-white p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 text-center">
                  <div className="text-3xl font-bold">{stats.total}</div>
                  <div className="text-sm opacity-90 mt-1">Total Orders</div>
                </div>
                <div className="bg-gradient-to-br from-yellow-400 to-yellow-500 text-white p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 text-center">
                  <div className="text-3xl font-bold">{stats.pending}</div>
                  <div className="text-sm opacity-90 mt-1">Pending</div>
                </div>
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 text-center">
                  <div className="text-3xl font-bold">{stats.confirmed}</div>
                  <div className="text-sm opacity-90 mt-1">Confirmed</div>
                </div>
                <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 text-center">
                  <div className="text-3xl font-bold">{stats.shipped}</div>
                  <div className="text-sm opacity-90 mt-1">Shipped</div>
                </div>
                <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 text-center">
                  <div className="text-3xl font-bold">{stats.delivered}</div>
                  <div className="text-sm opacity-90 mt-1">Delivered</div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-6 lg:items-end">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <span className="text-2xl text-sky-400">🔍</span>
                </div>
                <input
                  type="text"
                  placeholder="Search by Order ID, Name, or Email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-6 py-4 bg-white/60 backdrop-blur-sm border-2 border-sky-100 rounded-2xl focus:border-sky-400 focus:outline-none focus:ring-4 focus:ring-sky-100/50 transition-all duration-300 text-lg placeholder-gray-400 shadow-lg"
                />
              </div>
            </div>

            {/* Status Filters */}
            <div className="flex flex-wrap gap-3">
              {['ALL', 'PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED'].map(status => (
                <button
                  key={status}
                  className={`px-6 py-3 rounded-2xl font-semibold text-sm transition-all duration-300 shadow-sm ${
                    statusFilter === status
                      ? 'bg-sky-500 text-white shadow-lg hover:shadow-xl hover:scale-105 hover:bg-sky-600'
                      : 'bg-white/60 text-gray-700 hover:bg-sky-50 hover:text-sky-600 hover:shadow-md border border-sky-100'
                  }`}
                  onClick={() => setStatusFilter(status)}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Orders Table */}
        {filteredOrders.length === 0 ? (
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 p-16 text-center">
            <div className="text-7xl mb-8">📦</div>
            <h3 className="text-3xl font-bold text-gray-800 mb-4">No orders found</h3>
            <p className="text-xl text-gray-600 mb-8 max-w-md mx-auto">
              {statusFilter !== 'ALL' ? `No ${statusFilter.toLowerCase()} orders match your criteria` : 'No orders available'}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => setStatusFilter('ALL')}
                className="bg-sky-500 hover:bg-sky-600 text-white font-bold py-3 px-8 rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
              >
                Clear Filters
              </button>
              <button 
                onClick={fetchOrders}
                className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-8 rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
              >
                Refresh
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-sky-50/50">
                  <tr className="border-b border-sky-100">
                    <th className="px-6 py-6 text-left text-lg font-bold text-gray-800 uppercase tracking-wider">Order ID</th>
                    <th className="px-6 py-6 text-left text-lg font-bold text-gray-800 uppercase tracking-wider">Customer</th>
                    <th className="px-6 py-6 text-left text-lg font-bold text-gray-800 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-6 text-left text-lg font-bold text-gray-800 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-6 text-left text-lg font-bold text-gray-800 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-6 text-left text-lg font-bold text-gray-800 uppercase tracking-wider">Payment</th>
                    <th className="px-6 py-6 text-left text-lg font-bold text-gray-800 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-6 text-left text-lg font-bold text-gray-800 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-sky-50">
                  {filteredOrders.map(order => (
                    <tr key={order.id} className="hover:bg-sky-50/50 transition-colors duration-200">
                      <td className="px-6 py-6 font-mono font-semibold text-sky-600 text-xl">
                        #{order.id}
                      </td>
                      <td className="px-6 py-6 font-semibold text-gray-900">
                        {order.customerName}
                      </td>
                      <td className="px-6 py-6 text-gray-700 max-w-xs truncate">
                        {order.customerEmail}
                      </td>
                      <td className="px-6 py-6 text-gray-700">
                        {formatDate(order.orderDate)}
                      </td>
                      <td className="px-6 py-6">
                        <span className="text-2xl font-bold text-emerald-600">
                          ${order.totalAmount.toFixed(2)}
                        </span>
                      </td>
                      <td className="px-6 py-6">
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold border ${getPaymentColor(order.paymentStatus)}`}>
                          {order.paymentStatus}
                        </span>
                      </td>
                      <td className="px-6 py-6">
                        <span className={`px-4 py-2 rounded-2xl text-sm font-bold border ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-6">
                        <button
                          className="bg-sky-500 hover:bg-sky-600 text-white font-semibold py-3 px-8 rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 whitespace-nowrap"
                          onClick={() => navigate(`/orders/${order.id}`)}
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
