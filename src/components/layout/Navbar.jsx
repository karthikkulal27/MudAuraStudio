import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog } from '@headlessui/react';
import { logout } from '../../store/slices/authSlice';
import { logoutUser } from '../../utils/auth';
import {
  ShoppingBagIcon,
  UserIcon,
  Bars3Icon as MenuIcon,
  XMarkIcon as XIcon,
  MagnifyingGlassIcon as SearchIcon
} from '@heroicons/react/24/outline';

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Shop', href: '/shop' },
  { name: 'About', href: '/about' },
  { name: 'Blog', href: '/blog' },
  { name: 'Contact', href: '/contact' },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const cartItems = useSelector((state) => state.cart.items);
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const cartItemCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  const handleLogout = () => {
    // Clear local session and redux state, then navigate
    logoutUser();
    dispatch(logout());
    navigate('/');
  };
  return (
    <header className="bg-white shadow-sm fixed w-full top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" aria-label="Top">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="text-2xl font-serif text-clay-700">
              ClayAura
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`text-sm font-medium ${location.pathname === item.href
                  ? 'text-clay-600'
                  : 'text-gray-500 hover:text-clay-600'
                  }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Auth + Icons */}
          <div className="flex items-center space-x-4">
            <button className="text-gray-500 hover:text-clay-600">
              <SearchIcon className="h-6 w-6" />
            </button>
            <Link to="/cart" className="text-gray-500 hover:text-clay-600 relative">
              <ShoppingBagIcon className="h-6 w-6" />
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-clay-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </Link>
            {!isAuthenticated ? (
              <div className="hidden md:flex items-center gap-3">
                <Link to="/login" className="text-sm text-gray-600 hover:text-clay-700">Login</Link>
                <Link to="/register" className="text-sm bg-clay-700 text-white px-3 py-1.5 rounded-md hover:bg-clay-800">Sign up</Link>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-3">
                <span className="text-sm text-gray-700">Hi, {user?.name?.split(' ')[0] || 'User'}</span>
                <button onClick={handleLogout} className="text-sm text-gray-600 hover:text-clay-700">Logout</button>
              </div>
            )}
            <button
              className="md:hidden text-gray-500 hover:text-clay-600"
              onClick={() => setIsOpen(true)}
            >
              <MenuIcon className="h-6 w-6" />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <Dialog
            open={isOpen}
            onClose={() => setIsOpen(false)}
            className="fixed inset-0 z-50 md:hidden"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />


            {/* Animate this container instead */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween' }}
              className="fixed inset-y-0 right-0 w-full max-w-sm bg-white shadow-xl"
            >
              <div className="flex items-center justify-between p-4">
                <Link to="/" className="text-2xl font-serif text-clay-700">
                  ClayAura
                </Link>
                <button
                  className="text-gray-500 hover:text-clay-600"
                  onClick={() => setIsOpen(false)}
                >
                  <XIcon className="h-6 w-6" />
                </button>
              </div>

              <div className="px-2 py-3 divide-y divide-gray-100">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-clay-50 hover:text-clay-600"
                    onClick={() => setIsOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
                <div className="pt-2 px-1">
                  {!isAuthenticated ? (
                    <div className="flex items-center gap-3">
                      <Link to="/login" onClick={() => setIsOpen(false)} className="flex-1 text-center border px-3 py-2 rounded-md text-gray-700 hover:bg-gray-50">Login</Link>
                      <Link to="/register" onClick={() => setIsOpen(false)} className="flex-1 text-center bg-clay-700 text-white px-3 py-2 rounded-md hover:bg-clay-800">Sign up</Link>
                    </div>
                  ) : (
                    <button onClick={() => { handleLogout(); setIsOpen(false); }} className="w-full text-left px-3 py-2 text-gray-700 hover:bg-gray-50">Logout</button>
                  )}
                </div>
              </div>
            </motion.div>
          </Dialog>
        )}
      </AnimatePresence>

    </header>
  );
};

export default Navbar;