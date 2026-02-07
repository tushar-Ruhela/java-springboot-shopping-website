import React, { useState, useEffect } from 'react';
import { productAPI, categoryAPI } from '../services/api';
import ProductCard from '../components/ProductCard';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await categoryAPI.getAllCategories();
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await productAPI.getAllProducts();
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryFilter = async (categoryId) => {
    try {
      setLoading(true);
      setSelectedCategory(categoryId);
      setSearchQuery('');
      
      if (categoryId === null) {
        const response = await productAPI.getAllProducts();
        setProducts(response.data);
      } else {
        const response = await productAPI.getProductsByCategory(categoryId);
        setProducts(response.data);
      }
    } catch (error) {
      console.error('Error filtering products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      fetchProducts();
      return;
    }

    try {
      setLoading(true);
      setSelectedCategory(null);
      const response = await productAPI.searchProducts(searchQuery);
      setProducts(response.data);
    } catch (error) {
      console.error('Error searching products:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-sky-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-sky-600 via-sky-500 to-blue-500 text-white py-24 px-4 sm:py-32">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-sky-100 bg-clip-text text-transparent drop-shadow-lg">
            Welcome to ShopHub
          </h1>
          <p className="text-xl md:text-2xl mb-12 max-w-2xl mx-auto opacity-95 leading-relaxed">
            Discover amazing products at unbeatable prices
          </p>
          
          {/* Search Bar */}
         {/* Search Bar - FIXED */}
<form onSubmit={handleSearch} className="max-w-2xl mx-auto flex flex-col sm:flex-row gap-3">
  <input
    type="text"
    placeholder="Search for products..."
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
    className="flex-1 px-6 py-4 text-lg text-gray-900 font-medium rounded-2xl bg-white/95 backdrop-blur-sm border-2 border-white/70 focus:border-sky-300 focus:outline-none focus:ring-4 focus:ring-sky-100/70 shadow-2xl hover:shadow-3xl transition-all duration-300 placeholder-gray-500"
  />
  <button 
    type="submit" 
    className="px-8 py-4 bg-white text-sky-700 font-bold text-lg rounded-2xl hover:bg-sky-50 hover:shadow-3xl hover:scale-[1.02] hover:border-sky-300 transition-all duration-300 shadow-xl border-2 border-white/70 flex items-center justify-center gap-2 whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
    disabled={loading}
  >
    <span className="text-xl">🔍</span>
    <span>Search</span>
  </button>
</form>

        </div>
      </section>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Category Filter */}
        <div className="mb-12">
          <div className="flex flex-wrap gap-3 justify-center sm:justify-start lg:gap-4 xl:gap-6 -mb-2">
            <button
              onClick={() => handleCategoryFilter(null)}
              className={`px-6 py-3 rounded-2xl font-semibold text-sm transition-all duration-300 shadow-sm ${
                selectedCategory === null
                  ? 'bg-sky-500 text-white shadow-lg hover:shadow-xl hover:scale-105 hover:bg-sky-600'
                  : 'bg-white text-gray-700 hover:bg-sky-50 hover:text-sky-600 hover:shadow-md'
              }`}
            >
              All Products
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategoryFilter(category.id)}
                className={`px-6 py-3 rounded-2xl font-semibold text-sm transition-all duration-300 shadow-sm ${
                  selectedCategory === category.id
                    ? 'bg-sky-500 text-white shadow-lg hover:shadow-xl hover:scale-105 hover:bg-sky-600'
                    : 'bg-white text-gray-700 hover:bg-sky-50 hover:text-sky-600 hover:shadow-md'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Products Section */}
        <div className="space-y-8">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-24">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-sky-500 mb-6"></div>
              <p className="text-xl font-medium text-gray-600">Loading products...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-24">
              <div className="text-6xl mb-6">😢</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">No products found</h3>
              <p className="text-lg text-gray-600 max-w-md mx-auto">
                Try adjusting your search or filter criteria
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
