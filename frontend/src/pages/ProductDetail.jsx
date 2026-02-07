import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productAPI } from '../services/api';
import { useCart } from '../context/CartContext';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await productAPI.getProductById(id);
      setProduct(response.data);
    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    addToCart(product, quantity);
    navigate('/cart');
  };

  const handleQuantityChange = (delta) => {
    const newQuantity = quantity + delta;
    if (newQuantity >= 1 && newQuantity <= product.stock) {
      setQuantity(newQuantity);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-sky-50 to-blue-50 flex items-center justify-center py-12 px-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-sky-500 mx-auto mb-6"></div>
          <p className="text-2xl font-semibold text-gray-700">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-sky-50 to-blue-50 flex items-center justify-center py-12 px-4">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-8">😢</div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Product not found</h2>
          <p className="text-lg text-gray-600 mb-8">The product you're looking for doesn't exist.</p>
          <button 
            onClick={() => navigate('/')}
            className="bg-sky-500 hover:bg-sky-600 text-white font-bold py-3 px-8 rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
          >
            ← Back to Shop
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-sky-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <button 
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-sky-200 hover:border-sky-300 text-sky-700 font-semibold px-6 py-3 rounded-2xl shadow-lg hover:shadow-xl hover:bg-white transition-all duration-300 mb-12 hover:-translate-y-0.5"
        >
          <span className="text-xl">←</span>
          <span>Back to Products</span>
        </button>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Product Image */}
          <div className="group">
            <div className="relative bg-white/70 backdrop-blur-sm rounded-3xl p-6 shadow-2xl hover:shadow-3xl transition-all duration-500 border border-white/50 overflow-hidden">
              <img 
                src={product.imageUrl} 
                alt={product.name}
                className="w-full h-96 lg:h-[500px] object-cover rounded-2xl group-hover:scale-105 transition-transform duration-700"
              />
              
              {/* Category Badge */}
              {product.category && (
                <div className="absolute top-6 left-6">
                  <span className="bg-sky-500/90 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                    {product.category.name}
                  </span>
                </div>
              )}
              
              {/* Stock Badge */}
              <div className="absolute top-6 right-6">
                {product.stock > 0 ? (
                  <span className="bg-emerald-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg flex items-center gap-1 animate-pulse">
                    ✓ {product.stock} left
                  </span>
                ) : (
                  <span className="bg-red-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                    ✗ Out of Stock
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-8 lg:pt-4">
            {/* Title */}
            <div>
              <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-gray-900 to-sky-600 bg-clip-text text-transparent leading-tight mb-4">
                {product.name}
              </h1>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span>⭐⭐⭐⭐⭐ (127 reviews)</span>
                <span>|</span>
                <span>Ships in 1-2 days</span>
              </div>
            </div>

            {/* Price */}
            <div className="bg-gradient-to-r from-sky-500 to-sky-600 bg-clip-text text-transparent text-5xl lg:text-6xl font-bold py-4">
              ${product.price}
            </div>

            {/* Description */}
            <div className="prose prose-lg max-w-none">
              <p className="text-xl text-gray-700 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Stock Status */}
            <div className="flex items-center gap-3 p-6 bg-white/60 backdrop-blur-sm rounded-2xl border border-sky-100 shadow-lg">
              <div className={`w-4 h-4 rounded-full ${product.stock > 0 ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
              <div>
                <p className={`font-semibold ${product.stock > 0 ? 'text-emerald-700' : 'text-red-700'}`}>
                  {product.stock > 0 
                    ? `✓ In Stock (${product.stock} available)` 
                    : '✗ Out of Stock'
                  }
                </p>
                {product.stock > 0 && product.stock < 5 && (
                  <p className="text-sm text-orange-600 mt-1">⚡ Only a few left! Hurry up!</p>
                )}
              </div>
            </div>

            {/* Quantity Selector */}
            {product.stock > 0 && (
              <div className="p-6 bg-white/60 backdrop-blur-sm rounded-3xl border border-sky-100 shadow-xl">
                <label className="block text-lg font-semibold text-gray-800 mb-4">
                  Quantity
                </label>
                <div className="flex items-center gap-4">
                  <button
                    className="w-14 h-14 bg-sky-100 hover:bg-sky-200 text-sky-600 font-bold text-2xl rounded-2xl shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-sky-100"
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                  >
                    −
                  </button>
                  <span className="text-3xl font-bold text-gray-800 min-w-[3rem] text-center">
                    {quantity}
                  </span>
                  <button
                    className="w-14 h-14 bg-sky-100 hover:bg-sky-200 text-sky-600 font-bold text-2xl rounded-2xl shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-sky-100"
                    onClick={() => handleQuantityChange(1)}
                    disabled={quantity >= product.stock}
                  >
                    +
                  </button>
                  <div className="ml-4 text-lg font-semibold text-gray-700">
                    {quantity * product.price} total
                  </div>
                </div>
              </div>
            )}

            {/* Add to Cart Button */}
            <div className="pt-4">
              <button
                className={`w-full ${
                  product.stock === 0 
                    ? 'bg-gray-300 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 shadow-2xl hover:shadow-3xl transform hover:-translate-y-2 hover:scale-[1.02]'
                } text-white font-bold py-6 px-8 rounded-3xl text-xl transition-all duration-400 flex items-center justify-center gap-4 disabled:opacity-60 disabled:transform-none`}
                onClick={handleAddToCart}
                disabled={product.stock === 0}
              >
                {product.stock === 0 ? (
                  <>
                    <span className="text-2xl">✗</span>
                    <span>Out of Stock</span>
                  </>
                ) : (
                  <>
                    <span className="text-2xl">🛒</span>
                    <span>Add to Cart ({quantity})</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
