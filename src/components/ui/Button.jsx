import { motion } from 'framer-motion';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  onClick, 
  disabled = false, 
  type = 'button',
  className = '',
  ...props 
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-md transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variants = {
    // Primary uses a richer clay tone for stronger contrast
    primary: 'bg-clay-700 text-white hover:bg-clay-800 focus:ring-clay-500',
    secondary: 'bg-earth-100 text-earth-700 hover:bg-earth-200 focus:ring-earth-500',
    outlined: 'border-2 border-clay-600 text-clay-600 hover:bg-clay-50 focus:ring-clay-500',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className} ${
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      }`}
      // Temporary inline style to ensure visibility while debugging Tailwind build issues.
      // Remove this once Tailwind classes are confirmed to be applied.
      style={{
        ...(props.style || {}),
        backgroundColor: variant === 'primary' ? '#8f5f4f' : props.style?.backgroundColor,
        color: variant === 'primary' ? '#ffffff' : props.style?.color,
        boxShadow: '0 1px 3px rgba(0,0,0,0.08)'
      }}
      {...props}
    >
      {children}
    </motion.button>
  );
};

export default Button;