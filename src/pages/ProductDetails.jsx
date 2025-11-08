import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { StarIcon } from '@heroicons/react/24/solid';
import { ShoppingBagIcon } from '@heroicons/react/24/outline';
import PageTransition from '../components/ui/PageTransition';
import Button from '../components/ui/Button';
import { addToCart } from '../store/slices/cartSlice';
import { fetchProductById } from '../store/slices/productsSlice';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const productFromStore = useSelector((s) => s.products.byId[id]);
  const [product, setProduct] = useState(productFromStore || null);

  useEffect(() => {
    let isMounted = true;
    async function fetchProduct() {
      setLoading(true);
      setError(null);
      try {
        // If we already have it cached in the store, use it and skip fetch
        if (productFromStore) {
          if (isMounted) {
            setProduct(productFromStore);
            setLoading(false);
          }
          return;
        }
        if (!productFromStore) {
          // dispatch thunk to populate store
          await dispatch(fetchProductById(id)).unwrap();
        }
        if (isMounted) {
          // After dispatch, latest product will be available via productFromStore on next render
          setLoading(false);
        }
      } catch (e) {
        if (isMounted) {
          setError(e.message);
          setLoading(false);
        }
      }
    }
    fetchProduct();
    return () => { isMounted = false; };
  }, [id, API_URL, dispatch, productFromStore]);

  // Loading state
  if (loading) {
    return (
      <PageTransition>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center animate-pulse">
            <p className="text-gray-500">Loading product...</p>
          </div>
        </div>
      </PageTransition>
    );
  }

  // Error state
  if (error && !product) {
    return (
      <PageTransition>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-medium text-gray-900 mb-2">Error</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={() => navigate('/shop')}>Return to Shop</Button>
          </div>
        </div>
      </PageTransition>
    );
  }

  if (!product) {
    return (
      <PageTransition>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-medium text-gray-900 mb-2">Product not found</h2>
            <p className="text-gray-600 mb-4">The product you're looking for doesn't exist.</p>
            <Button onClick={() => navigate('/shop')}>Return to Shop</Button>
          </div>
        </div>
      </PageTransition>
    );
  }

  const handleAddToCart = () => {
    dispatch(addToCart({ product, quantity }));
  };

  return (
    <PageTransition>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="aspect-w-1 aspect-h-1 rounded-lg overflow-hidden"
            >
              {Array.isArray(product.images) && product.images.length > 0 ? (
                <img
                  src={product.images[selectedImage]}
                  alt={product.name}
                  className="w-full h-full object-center object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">
                  No image
                </div>
              )}
            </motion.div>
            {Array.isArray(product.images) && product.images.length > 0 && (
              <div className="grid grid-cols-4 gap-4">
                {product.images.map((image, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`aspect-w-1 aspect-h-1 rounded-md overflow-hidden ${
                      selectedImage === idx ? 'ring-2 ring-clay-500' : ''
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${idx + 1}`}
                      className="w-full h-full object-center object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-serif text-gray-900 mb-2">
                {product.name}
              </h1>
              <p className="text-2xl text-clay-600">${product.price.toFixed(2)}</p>
            </div>

            {/* Rating */}
            <div className="flex items-center space-x-2">
              {product.rating ? (
                <div className="flex items-center">
                  {[...Array(5)].map((_, idx) => (
                    <StarIcon
                      key={idx}
                      className={`h-5 w-5 ${
                        idx < Math.floor(product.rating)
                          ? 'text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
              ) : null}
              {product.reviews ? (
                <span className="text-sm text-gray-600">{product.reviews} reviews</span>
              ) : null}
            </div>

            {/* Description */}
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-2">
                Description
              </h2>
              <p className="text-gray-600">{product.description}</p>
            </div>

            {/* Features */}
            {product.features ? (
              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-2">Features</h2>
                <ul className="list-disc list-inside space-y-1 text-gray-600">
                  {product.features.map((feature, idx) => (
                    <li key={idx}>{feature}</li>
                  ))}
                </ul>
              </div>
            ) : null}

            {/* Add to Cart */}
            <div className="space-y-4 pt-4 border-t border-gray-200 relative z-10 bg-white">
              <div className="flex items-center space-x-4">
                <label htmlFor="quantity" className="text-gray-700">
                  Quantity:
                </label>
                <select
                  id="quantity"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="rounded-md border-gray-300 text-sm focus:ring-clay-500 focus:border-clay-500"
                >
                  {[...Array(10)].map((_, idx) => (
                    <option key={idx + 1} value={idx + 1}>
                      {idx + 1}
                    </option>
                  ))}
                </select>
              </div>
              <Button
                onClick={handleAddToCart}
                className="w-full flex items-center justify-center space-x-2"
              >
                <ShoppingBagIcon className="h-5 w-5" />
                <span>Add to Cart</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default ProductDetails;