import { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import PageTransition from '../components/ui/PageTransition';
import ProductCard from '../components/ui/ProductCard';
import { setFilters } from '../store/slices/productsSlice';
import { fetchProducts } from '../store/slices/productsSlice';

const Shop = () => {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('latest');
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const { items: remoteProducts, loading, error } = useSelector((s) => s.products);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  // Initial fetch of remote products
  useEffect(() => {
    dispatch(fetchProducts({}));
  }, [dispatch]);

  // Get category from URL params
  useEffect(() => {
    const category = searchParams.get('category') || 'all';
    setSelectedCategory(category);
  }, [searchParams]);

  // Derive categories dynamically from backend products
  const derivedCategories = useMemo(() => {
    const set = new Set(remoteProducts.map(p => p.category).filter(Boolean));
    const list = Array.from(set).sort();
    return [
      { id: 'all', name: 'All Products' },
      ...list.map((c) => ({ id: c, name: c }))
    ];
  }, [remoteProducts]);

  // Filter and sort products
  useEffect(() => {
  // Use only backend products
  const source = remoteProducts || [];
  let filtered = [...source];

    // Apply category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    // Apply price filter
    filtered = filtered.filter(
      product => product.price >= priceRange[0] && product.price <= priceRange[1]
    );

    // Apply sorting
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      default: // 'latest'
        // Assuming products may not have numeric incremental id from backend; fallback to createdAt or name
        filtered.sort((a, b) => {
          if (a.createdAt && b.createdAt) return new Date(b.createdAt) - new Date(a.createdAt);
          return (b.id || 0) - (a.id || 0);
        });
    }

    setFilteredProducts(filtered);
    dispatch(setFilters({ category: selectedCategory, priceRange, sortBy }));
  }, [selectedCategory, sortBy, priceRange, remoteProducts, dispatch]);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setSearchParams({ category });
  };

  return (
    <PageTransition>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-serif text-clay-800 mb-4">
            Our Collection
          </h1>
          <p className="text-lg text-gray-600">
            Discover our handcrafted ceramic pieces
          </p>
        </div>

        {/* Filters and Sorting */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-8">
          <div className="lg:col-span-1 space-y-6">
            {/* Categories */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-medium text-gray-900 mb-4">Categories</h3>
              <div className="space-y-2">
                {derivedCategories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => handleCategoryChange(category.id)}
                    className={`block w-full text-left px-2 py-1 rounded-md ${
                      selectedCategory === category.id
                        ? 'bg-clay-100 text-clay-800'
                        : 'text-gray-600 hover:bg-clay-50'
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-medium text-gray-900 mb-4">Price Range</h3>
              <div className="space-y-4">
                <input
                  type="range"
                  min="0"
                  max="1000"
                  step="10"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([0, Number(e.target.value)])}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-gray-600">
                  <span>$0</span>
                  <span>${priceRange[1]}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Product Grid */}
          <div className="lg:col-span-3">
            {/* Sort Options */}
            <div className="flex justify-end mb-6">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="rounded-md border-gray-300 text-sm focus:ring-clay-500 focus:border-clay-500"
              >
                <option value="latest">Latest</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>

            {/* Products */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </div>

            {/* Empty State */}
            {loading && (
              <div className="text-center py-8 text-sm text-gray-600">Loading products...</div>
            )}
            {error && (
              <div className="text-center py-8 text-sm text-red-600">{error}</div>
            )}
            {filteredProducts.length === 0 && !loading && !error && (
              <div className="text-center py-12">
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No products found
                </h3>
                <p className="text-gray-600">
                  Try adjusting your filters to find what you're looking for.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default Shop;