import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart(product);
  };

  const handleCardClick = () => {
    navigate(`/product/${product.id}`);
  };

  return (
    <div 
      className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl border border-gray-100 hover:border-sky-200 overflow-hidden transition-all duration-300 hover:-translate-y-2 cursor-pointer max-w-sm mx-auto"
      onClick={handleCardClick}
    >
      {/* Image Container */}
      <div className="relative h-64 overflow-hidden bg-gradient-to-br from-sky-50 to-blue-50">
        <img 
          src={product.imageUrl} 
          alt={product.name} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        
        {/* Low Stock Badge */}
        {product.stock < 10 && product.stock > 0 && (
          <span className="absolute top-3 right-3 bg-orange-400 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg animate-pulse">
            Only {product.stock} left!
          </span>
        )}
        
        {/* Out of Stock Badge */}
        {product.stock === 0 && (
          <span className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
            Out of Stock
          </span>
        )}
        
        {/* Add to Cart Button on Image (Hover) */}
        {product.stock > 0 && (
          <button
            onClick={handleAddToCart}
            className="absolute bottom-3 left-3 right-3 bg-sky-500 hover:bg-sky-600 text-white text-sm font-semibold py-2 px-4 rounded-xl shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 opacity-0 group-hover:opacity-100"
          >
            Add to Cart
          </button>
        )}
      </div>
      
      {/* Product Info */}
      <div className="p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-sky-600 transition-colors duration-200">
          {product.name}
        </h3>
        
        <p className="text-sm text-gray-600 mb-4 line-clamp-2 leading-relaxed">
          {product.description}
        </p>
        
        {/* Price & Add to Cart */}
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-sky-600">
            ${product.price}
          </span>
          
          {product.stock === 0 ? (
            <span className="px-4 py-2 bg-gray-100 text-gray-500 text-sm font-medium rounded-lg">
              Out of Stock
            </span>
          ) : (
            <button
              onClick={handleAddToCart}
              className="px-6 py-2 bg-sky-500 hover:bg-sky-600 text-white text-sm font-semibold rounded-xl shadow-sm hover:shadow-md transition-all duration-200 transform hover:-translate-y-0.5"
              disabled={product.stock === 0}
            >
              Add to Cart
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
