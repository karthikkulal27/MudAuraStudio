import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import Button from '../../components/ui/Button';
import PageTransition from '../../components/ui/PageTransition';
import { loginSuccess } from '../../store/slices/authSlice';
import { registerUser, loginUser } from '../../utils/auth';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

const Register = () => {
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.auth);

  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    defaultValues: { name: '', email: '', password: '', confirmPassword: '' }
  });
  const passwordValue = watch('password');

  const onSubmit = async (data) => {
    setError('');
    if (data.password !== data.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    try {
      const newUser = await registerUser({ name: data.name, email: data.email, password: data.password });
      const loggedIn = await loginUser({ email: newUser.email, password: data.password });
      dispatch(loginSuccess(loggedIn));
      navigate('/shop');
    } catch (err) {
      setError(err?.message || 'Registration failed');
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
              Create your account
            </motion.h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Already have an account?{' '}
              <Link
                to="/login"
                className="font-medium text-clay-600 hover:text-clay-700"
              >
                Sign in
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
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label htmlFor="name" className="sr-only">Name</label>
                <input
                  id="name"
                  type="text"
                  {...register('name', { required: 'Name is required', minLength: { value: 2, message: 'At least 2 characters' } })}
                  className="appearance-none relative block w-full px-3 py-2 border border-clay-300 placeholder-clay-500 text-gray-900 rounded-md focus:outline-none focus:ring-clay-500 focus:border-clay-500 focus:z-10 sm:text-sm"
                  placeholder="Full Name"
                />
                {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>}
              </div>
              <div>
                <label htmlFor="email" className="sr-only">Email address</label>
                <input
                  id="email"
                  type="email"
                  {...register('email', { required: 'Email is required', pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Enter a valid email' } })}
                  className="appearance-none relative block w-full px-3 py-2 border border-clay-300 placeholder-clay-500 text-gray-900 rounded-md focus:outline-none focus:ring-clay-500 focus:border-clay-500 focus:z-10 sm:text-sm"
                  placeholder="Email address"
                />
                {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>}
              </div>
              <div className="relative">
                <label htmlFor="password" className="sr-only">Password</label>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'At least 6 characters' } })}
                  className="appearance-none relative block w-full px-3 py-2 border border-clay-300 placeholder-clay-500 text-gray-900 rounded-md focus:outline-none focus:ring-clay-500 focus:border-clay-500 focus:z-10 sm:text-sm"
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
              <div className="relative">
                <label htmlFor="confirmPassword" className="sr-only">Confirm Password</label>
                <input
                  id="confirmPassword"
                  type={showConfirm ? 'text' : 'password'}
                  {...register('confirmPassword', { required: 'Confirm your password', validate: (val) => val === passwordValue || 'Passwords do not match' })}
                  className="appearance-none relative block w-full px-3 py-2 border border-clay-300 placeholder-clay-500 text-gray-900 rounded-md focus:outline-none focus:ring-clay-500 focus:border-clay-500 focus:z-10 sm:text-sm"
                  placeholder="Confirm Password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((s) => !s)}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
                  aria-label={showConfirm ? 'Hide password' : 'Show password'}
                >
                  {showConfirm ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                </button>
                {errors.confirmPassword && <p className="mt-1 text-xs text-red-600">{errors.confirmPassword.message}</p>}
              </div>
            </div>

            <div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Creating account...' : 'Create account'}
              </Button>
            </div>
          </motion.form>
        </div>
      </div>
    </PageTransition>
  );
};

export default Register;