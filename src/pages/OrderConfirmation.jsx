import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircleIcon } from '@heroicons/react/24/outline';
import PageTransition from '../components/ui/PageTransition';
import Button from '../components/ui/Button';

const OrderConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { orderId, total, shippingDetails } = location.state || {};

  useEffect(() => {
    if (!orderId) {
      navigate('/');
    }
  }, [orderId, navigate]);

  if (!orderId) return null;

  return (
    <PageTransition>
      <div className="min-h-screen bg-clay-50 py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="bg-white rounded-lg shadow-sm p-8">
            <div className="text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', duration: 0.5 }}
              >
                <CheckCircleIcon className="mx-auto h-16 w-16 text-green-500" />
              </motion.div>
              
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mt-4 text-3xl font-serif text-gray-900"
              >
                Thank you for your order!
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mt-2 text-lg text-gray-600"
              >
                Your order #{orderId} has been confirmed
              </motion.p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-8 border-t border-gray-200 pt-8"
            >
              <h2 className="text-xl font-medium text-gray-900 mb-4">
                Order Details
              </h2>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">
                      Shipping Address
                    </h3>
                    <p className="mt-1 text-sm text-gray-600">
                      {shippingDetails.firstName} {shippingDetails.lastName}<br />
                      {shippingDetails.address}<br />
                      {shippingDetails.city}, {shippingDetails.zipCode}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">
                      Contact Information
                    </h3>
                    <p className="mt-1 text-sm text-gray-600">
                      {shippingDetails.email}
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-900">
                    Payment Total
                  </h3>
                  <p className="mt-1 text-2xl font-medium text-clay-600">
                    ${total.toFixed(2)}
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-8 space-y-4"
            >
              <p className="text-sm text-gray-600">
                We'll email you an order confirmation with details and tracking information.
              </p>

              <div className="flex justify-center space-x-4">
                <Button onClick={() => navigate('/shop')}>
                  Continue Shopping
                </Button>
                <Button 
                  onClick={() => {/* TODO: Implement order tracking */}}
                  variant="secondary"
                >
                  Track Order
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default OrderConfirmation;