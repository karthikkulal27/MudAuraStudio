import { useInView } from 'react-intersection-observer';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import PageTransition from '../components/ui/PageTransition';
import Button from '../components/ui/Button';
import ProductCard from '../components/ui/ProductCard';
import { useEffect, useState } from 'react';

const Home = () => {
  const [heroRef, heroInView] = useInView({ triggerOnce: true });
  const [featuredRef, featuredInView] = useInView({ triggerOnce: true });
  const [testimonialsRef, testimonialsInView] = useInView({ triggerOnce: true });
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [testimonials, setTestimonials] = useState([]);
  const [tError, setTError] = useState(null);
  const [tLoading, setTLoading] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    let isMounted = true;
    async function loadFeatured() {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`${API_URL}/products?featured=true&limit=3`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to load featured products');
        if (isMounted) setFeaturedProducts(data.products || []);
      } catch (e) {
        if (isMounted) setError(e.message);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    async function loadTestimonials() {
      try {
        setTLoading(true);
        setTError(null);
        const res = await fetch(`${API_URL}/testimonials`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to load testimonials');
        if (isMounted) setTestimonials(data.testimonials || []);
      } catch (e) {
        if (isMounted) setTError(e.message);
      } finally {
        if (isMounted) setTLoading(false);
      }
    }
    loadFeatured();
    loadTestimonials();
    return () => { isMounted = false; };
  }, [API_URL]);

  return (
    <PageTransition>
      {/* Hero Section */}
      <section
        ref={heroRef}
        className="relative h-[90vh] flex items-center justify-center overflow-hidden"
      >
        <div className="absolute inset-0">
          <LazyLoadImage
            src="https://images.unsplash.com/photo-1565193229798-c5f891ace8bf"
            alt="Hero"
            effect="blur"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-40" />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={heroInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="relative text-center text-white max-w-4xl mx-auto px-4"
        >
          <h1 className="text-5xl md:text-6xl font-serif mb-6">
            Handcrafted Ceramics for Your Home
          </h1>
          <p className="text-xl mb-8">
            Each piece tells a story of artisanal craftsmanship and timeless beauty
          </p>
          <Button
            as={Link}
            to="/shop"
            size="lg"
            // className="backdrop-blur-sm bg-white/20 hover:bg-white/30 border-2 border-white"
          >
            Shop Collection
          </Button>
        </motion.div>
      </section>

      {/* Featured Products */}
      <section
        ref={featuredRef}
        className="py-24 bg-clay-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={featuredInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-serif text-clay-800 mb-4">
              Featured Collection
            </h2>
            <p className="text-lg text-gray-600">
              Discover our most loved pieces
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {loading && (
              <div className="col-span-3 text-center text-sm text-gray-500">Loading featured products...</div>
            )}
            {!loading && !error && featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
            {!loading && error && (
              <div className="col-span-3 text-center text-sm text-red-600">{error}</div>
            )}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section
        ref={testimonialsRef}
        className="py-24 bg-white"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={testimonialsInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-serif text-clay-800 mb-4">
              What Our Customers Say
            </h2>
            <p className="text-lg text-gray-600">
              Read about experiences from our satisfied customers
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {tLoading && (
              <div className="col-span-3 text-center text-sm text-gray-500">Loading testimonials...</div>
            )}
            {!tLoading && tError && (
              <div className="col-span-3 text-center text-sm text-red-600">{tError}</div>
            )}
            {!tLoading && !tError && testimonials.map((testimonial) => (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, y: 20 }}
                animate={testimonialsInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: testimonial.id * 0.2 }}
                className="bg-white p-6 rounded-lg shadow-sm"
              >
                <div className="flex items-center mb-4">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div className="ml-4">
                    <h3 className="font-medium text-gray-900">{testimonial.name}</h3>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-gray-600">{testimonial.content}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-24 bg-earth-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-serif text-clay-800 mb-4">
              Join Our Newsletter
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Stay updated with our latest collections and ceramic care tips
            </p>
            <form className="flex flex-col sm:flex-row gap-4 justify-center">
              <input
                type="email"
                placeholder="Enter your email"
                className="px-4 py-2 rounded-md border-gray-300 focus:ring-clay-500 focus:border-clay-500"
              />
              <Button type="submit">Subscribe</Button>
            </form>
          </div>
        </div>
      </section>
    </PageTransition>
  );
};

export default Home;