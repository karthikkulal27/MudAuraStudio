import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import ErrorBoundary from './components/ErrorBoundary';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMe } from './store/slices/authSlice';
import { fetchCart, addToCart, hydrateCart } from './store/slices/cartSlice';
import AdminRoute from './components/AdminRoute';

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
const AdminDashboard = lazy(() => import('./pages/admin/Dashboard'));
const ProductsAdmin = lazy(() => import('./pages/admin/ProductsAdmin'));
const OrdersAdmin = lazy(() => import('./pages/admin/OrdersAdmin'));
const UsersAdmin = lazy(() => import('./pages/admin/UsersAdmin'));

function AppInner() {
  const dispatch = useDispatch();
  const auth = useSelector(state => state.auth);
  const localCart = useSelector(state => state.cart.items);
  useEffect(() => {
    dispatch(fetchMe());
  }, [dispatch]);

  // When user becomes authenticated, perform hydration via dedicated thunk
  useEffect(() => {
    if (auth.isAuthenticated) {
      dispatch(hydrateCart());
    }
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
              <Route index element={(
                auth.isAuthenticated && auth.user?.role === 'ADMIN'
                  ? <Navigate to="/admin" replace />
                  : <Home />
              )} />
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
              <Route path="admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
              <Route path="admin/products" element={<AdminRoute><ProductsAdmin /></AdminRoute>} />
              <Route path="admin/orders" element={<AdminRoute><OrdersAdmin /></AdminRoute>} />
              <Route path="admin/users" element={<AdminRoute><UsersAdmin /></AdminRoute>} />
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
