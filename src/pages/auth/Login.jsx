import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import Button from '../../components/ui/Button';
import PageTransition from '../../components/ui/PageTransition';
import { loginStart, loginSuccess, loginFailure, loginAndHydrate } from '../../store/slices/authSlice';
import { loginUser } from '../../utils/auth';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

const Login = () => {
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.auth);

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: { email: '', password: '' }
  });

  const onSubmit = async (data) => {
    setError('');
    try {
      // Use combined login + cart hydration helper
  const user = await dispatch(loginAndHydrate({ email: data.email, password: data.password }, loginUser));
  // If admin, go to dashboard; otherwise to shop
  const state = user?.payload || null;
  const role = state?.role || null;
  navigate(role === 'ADMIN' ? '/admin' : '/shop');
    } catch (err) {
      const msg = err?.message || 'Invalid email or password';
      setError(msg);
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-clay-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full mx-auto space-y-8">
          <div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 text-center text-3xl font-serif text-gray-900"
            >
              Sign in to your account
            </motion.h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Or{' '}
              <Link
                to="/register"
                className="font-medium text-clay-600 hover:text-clay-700"
              >
                create a new account
              </Link>
            </p>
          </div>

          <motion.form
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="mt-8 space-y-6"
            onSubmit={handleSubmit(onSubmit)}
          >
            {error && (
              <div className="text-red-600 text-sm text-center">{error}</div>
            )}

            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="email" className="sr-only">
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  {...register('email', { required: 'Email is required', pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Enter a valid email' } })}
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-clay-300 placeholder-clay-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-clay-500 focus:border-clay-500 focus:z-10 sm:text-sm"
                  placeholder="Email address"
                />
                {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>}
              </div>
              <div className="relative">
                <label htmlFor="password" className="sr-only">Password</label>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'At least 6 characters' } })}
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-clay-300 placeholder-clay-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-clay-500 focus:border-clay-500 focus:z-10 sm:text-sm"
                  placeholder="Password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                </button>
                {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password.message}</p>}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-clay-600 focus:ring-clay-500 border-clay-300 rounded"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text-gray-900"
                >
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <Link
                  to="/forgot-password"
                  className="font-medium text-clay-600 hover:text-clay-700"
                >
                  Forgot your password?
                </Link>
              </div>
            </div>

            <div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Signing in...' : 'Sign in'}
              </Button>
            </div>
          </motion.form>
        </div>
      </div>
    </PageTransition>
  );
};

export default Login;