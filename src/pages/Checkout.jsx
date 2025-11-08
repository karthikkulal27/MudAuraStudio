import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import PageTransition from '../components/ui/PageTransition';
import Button from '../components/ui/Button';
import { clearCart } from '../store/slices/cartSlice';

const Checkout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { items, total } = useSelector((state) => state.cart);
  const [isProcessing, setIsProcessing] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  const onSubmit = async () => {
    try {
      setIsProcessing(true);
      const res = await fetch(`${API_URL}/stripe/create-checkout-session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ items }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) throw new Error(data.error || 'Failed to start checkout');
      // Redirect to Stripe Checkout
      window.location.href = data.url;
    } catch (e) {
      console.error(e);
      setIsProcessing(false);
      // Optional: surface error to the user
    }
  };

  // ✅ Floating Label Input
  const Input = ({ id, label, type = 'text', error, ...props }) => (
    <div className="relative">
      <input
        id={id}
        type={type}
        placeholder=" "
        className={`peer block w-full rounded-lg border border-gray-300 bg-white px-3.5 pt-5 pb-2 text-sm text-gray-900 
        focus:border-clay-500 focus:ring-2 focus:ring-clay-300 focus:outline-none transition-all duration-200`}
        {...props}
      />
      <label
        htmlFor={id}
        className="absolute left-3.5 top-3 text-gray-500 text-sm transition-all
        peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base
        peer-focus:top-1 peer-focus:text-xs peer-focus:text-clay-600
        peer-[&:not(:placeholder-shown)]:top-1 peer-[&:not(:placeholder-shown)]:text-xs peer-[&:not(:placeholder-shown)]:text-clay-600"
      >
        {label}
      </label>
      {error && <p className="mt-1 text-xs text-red-600">{error.message}</p>}
    </div>
  );

  return (
    <PageTransition>
      <div className="min-h-screen bg-earth-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10">
          
          {/* Checkout Form */}
          <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-md border border-earth-100">
            <h1 className="text-3xl font-serif text-earth-900 mb-6">
              Checkout
            </h1>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              
              {/* Contact Information */}
              <section>
                <h2 className="text-lg font-medium text-earth-800 mb-3 border-l-4 border-clay-500 pl-2">
                  Contact Information
                </h2>
                <Input
                  id="email"
                  label="Email"
                  type="email"
                  {...register('email', { required: 'Email is required' })}
                  error={errors.email}
                />
              </section>

              {/* Shipping Information */}
              <section>
                <h2 className="text-lg font-medium text-earth-800 mb-3 border-l-4 border-clay-500 pl-2">
                  Shipping Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    id="firstName"
                    label="First Name"
                    {...register('firstName', { required: 'First name is required' })}
                    error={errors.firstName}
                  />
                  <Input
                    id="lastName"
                    label="Last Name"
                    {...register('lastName', { required: 'Last name is required' })}
                    error={errors.lastName}
                  />
                </div>
                <Input
                  id="address"
                  label="Address"
                  {...register('address', { required: 'Address is required' })}
                  error={errors.address}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    id="city"
                    label="City"
                    {...register('city', { required: 'City is required' })}
                    error={errors.city}
                  />
                  <Input
                    id="postalCode"
                    label="Postal Code"
                    {...register('postalCode', { required: 'Postal code is required' })}
                    error={errors.postalCode}
                  />
                </div>
              </section>

              {/* Payment handled by Stripe redirect; card inputs removed */}

              <Button
                type="submit"
                className="w-full mt-4 text-lg"
                disabled={isProcessing}
              >
                {isProcessing ? 'Processing...' : `Pay $${total.toFixed(2)}`}
              </Button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-md border border-earth-100 h-fit sticky top-24">
            <h2 className="text-xl font-medium text-earth-900 mb-6">
              Order Summary
            </h2>
            <div className="space-y-5">
              {items.map((item) => (
                <div key={item.id} className="flex items-center space-x-4">
                  <img
                    src={item.images[0]}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-earth-900">
                      {item.name}
                    </h3>
                    <p className="text-xs text-earth-600">
                      Quantity: {item.quantity}
                    </p>
                  </div>
                  <p className="text-sm font-medium text-earth-800">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
              <div className="border-t border-earth-200 pt-4 mt-4">
                <div className="flex justify-between text-base font-semibold text-earth-900">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default Checkout;
