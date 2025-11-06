import { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import {
  PhoneIcon,
  EnvelopeIcon as MailIcon,
  MapPinIcon as LocationMarkerIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';
import PageTransition from '../components/ui/PageTransition';
import Button from '../components/ui/Button';

const Contact = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setSubmitSuccess(true);
    setIsSubmitting(false);
    reset();
    // Reset success message after 5 seconds
    setTimeout(() => setSubmitSuccess(false), 5000);
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-clay-50">
        {/* Contact Header */}
        <div className="bg-clay-600 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl font-serif mb-4">Contact Us</h1>
            <p className="text-lg text-clay-100 max-w-2xl mx-auto">
              Have a question about our products or want to collaborate? 
              We'd love to hear from you.
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Contact Information */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-2xl font-serif text-clay-800 mb-6">
                  Get in Touch
                </h2>
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <LocationMarkerIcon className="h-6 w-6 text-clay-600 mt-1" />
                    <div>
                      <h3 className="font-medium text-gray-900">Our Studio</h3>
                      <p className="text-gray-600">
                        123 Pottery Lane<br />
                        Artisan District<br />
                        Craftstown, CT 06510
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <PhoneIcon className="h-6 w-6 text-clay-600 mt-1" />
                    <div>
                      <h3 className="font-medium text-gray-900">Phone</h3>
                      <p className="text-gray-600">+1 (203) 555-0123</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <MailIcon className="h-6 w-6 text-clay-600 mt-1" />
                    <div>
                      <h3 className="font-medium text-gray-900">Email</h3>
                      <p className="text-gray-600">hello@clayaura.com</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <ClockIcon className="h-6 w-6 text-clay-600 mt-1" />
                    <div>
                      <h3 className="font-medium text-gray-900">Hours</h3>
                      <p className="text-gray-600">
                        Monday - Friday: 9am - 6pm<br />
                        Saturday: 10am - 4pm<br />
                        Sunday: Closed
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-2xl font-serif text-clay-800 mb-6">
                  Send us a Message
                </h2>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                        Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        {...register('name', { required: 'Name is required' })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-clay-500 focus:ring-clay-500"
                      />
                      {errors.name && (
                        <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                      )}
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        {...register('email', {
                          required: 'Email is required',
                          pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: 'Invalid email address',
                          },
                        })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-clay-500 focus:ring-clay-500"
                      />
                      {errors.email && (
                        <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                      )}
                    </div>
                  </div>
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
                      Subject
                    </label>
                    <input
                      type="text"
                      id="subject"
                      {...register('subject', { required: 'Subject is required' })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-clay-500 focus:ring-clay-500"
                    />
                    {errors.subject && (
                      <p className="mt-1 text-sm text-red-600">{errors.subject.message}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                      Message
                    </label>
                    <textarea
                      id="message"
                      rows={6}
                      {...register('message', { required: 'Message is required' })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-clay-500 focus:ring-clay-500"
                    />
                    {errors.message && (
                      <p className="mt-1 text-sm text-red-600">{errors.message.message}</p>
                    )}
                  </div>
                  <div>
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full"
                    >
                      {isSubmitting ? 'Sending...' : 'Send Message'}
                    </Button>
                  </div>
                </form>

                {/* Success Message */}
                {submitSuccess && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 p-4 bg-green-50 text-green-700 rounded-md"
                  >
                    Thank you for your message! We'll get back to you soon.
                  </motion.div>
                )}
              </div>
            </div>
          </div>

          {/* Map */}
          <div className="mt-12">
            <div className="bg-white rounded-lg shadow-sm p-1">
              <iframe
                title="Studio Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2996.7276714524307!2d-72.92900268429787!3d41.31095597927154!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89e7d9b5e8684b29%3A0x8f7b1b452d0516d4!2sNew%20Haven%2C%20CT%2006510!5e0!3m2!1sen!2sus!4v1636158766304!5m2!1sen!2sus"
                width="100%"
                height="450"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default Contact;