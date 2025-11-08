import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import ErrorBoundary from './components/ErrorBoundary';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMe } from './store/slices/authSlice';
import { fetchCart, addToCart } from './store/slices/cartSlice';

// Lazy load pages
import { lazy, Suspense } from 'react';
const Home = lazy(() => import('./pages/Home'));
const Shop = lazy(() => import('./pages/Shop'));
const ProductDetails = lazy(() => import('./pages/ProductDetails'));
const Cart = lazy(() => import('./pages/Cart'));
const Checkout = lazy(() => import('./pages/Checkout'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const OrderConfirmation = lazy(() => import('./pages/OrderConfirmation'));
const Blog = lazy(() => import('./pages/Blog'));
const BlogPost = lazy(() => import('./pages/BlogPost'));
const Login = lazy(() => import('./pages/auth/Login'));
const Register = lazy(() => import('./pages/auth/Register'));
const ForgotPassword = lazy(() => import('./pages/auth/ForgotPassword'));
const NotFound = lazy(() => import('./pages/NotFound'));

function AppInner() {
  const dispatch = useDispatch();
  const auth = useSelector(state => state.auth);
  const localCart = useSelector(state => state.cart.items);
  useEffect(() => {
    dispatch(fetchMe());
  }, [dispatch]);

  // When user becomes authenticated, hydrate cart from backend and merge any local items
  useEffect(() => {
    async function hydrateCart() {
      if (auth.isAuthenticated) {
        // 1) Fetch remote cart
        await dispatch(fetchCart());
        // 2) Merge any local-only items by posting them once
        if (localCart && localCart.length) {
          for (const i of localCart) {
            await dispatch(addToCart({ product: i, quantity: i.quantity }));
          }
        }
      }
    }
    hydrateCart();
    // Only re-run when auth state toggles to authenticated
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth.isAuthenticated]);
  return (
    <ErrorBoundary>
      <Router>
          <Suspense fallback={
          <div className="min-h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-clay-600"></div>
          </div>
        }>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="shop" element={<Shop />} />
              <Route path="product/:id" element={<ProductDetails />} />
              <Route path="cart" element={<Cart />} />
              <Route path="checkout" element={<Checkout />} />
              <Route path="about" element={<About />} />
             <Route path="order-confirmation" element={<OrderConfirmation />} />
              <Route path="contact" element={<Contact />} />
              <Route path="blog" element={<Blog />} />
              <Route path="blog/:slug" element={<BlogPost />} />
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
              <Route path="forgot-password" element={<ForgotPassword />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </Suspense>
        </Router>
      </ErrorBoundary>
    );
}

export default function App() {
  return <AppInner />;
}
