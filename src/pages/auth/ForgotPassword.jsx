import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Button from '../../components/ui/Button';
import PageTransition from '../../components/ui/PageTransition';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState({ type: '', message: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: '', message: '' });

    try {
      // TODO: Implement actual password reset logic here
      console.log('Password reset requested for:', email);
      setStatus({
        type: 'success',
        message: 'If an account exists with this email, you will receive password reset instructions.',
      });
      setEmail('');
    } catch (err) {
      setStatus({
        type: 'error',
        message: 'Something went wrong. Please try again.',
      });
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
              Reset your password
            </motion.h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Enter your email address and we'll send you instructions to reset your password.
            </p>
          </div>

          <motion.form
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="mt-8 space-y-6"
            onSubmit={handleSubmit}
          >
            {status.message && (
              <div
                className={`text-sm text-center ${
                  status.type === 'error' ? 'text-red-600' : 'text-green-600'
                }`}
              >
                {status.message}
              </div>
            )}

            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none relative block w-full px-3 py-2 border border-clay-300 placeholder-clay-500 text-gray-900 rounded-md focus:outline-none focus:ring-clay-500 focus:border-clay-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
              />
            </div>

            <div>
              <Button type="submit" className="w-full">
                Send reset instructions
              </Button>
            </div>

            <div className="text-sm text-center">
              <Link
                to="/login"
                className="font-medium text-clay-600 hover:text-clay-700"
              >
                Back to sign in
              </Link>
            </div>
          </motion.form>
        </div>
      </div>
    </PageTransition>
  );
};

export default ForgotPassword;