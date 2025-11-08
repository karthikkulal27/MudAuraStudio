import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const MotionLink = motion(Link);

const Button = ({
  children,
  variant = "primary",
  size = "md",
  onClick,
  disabled = false,
  type = "button",
  to,
  className = "",
  ...props
}) => {
  const baseStyles =
    "inline-flex items-center justify-center font-medium rounded-md transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2";

  const variants = {
    primary:
      "bg-clay-700 text-white hover:bg-clay-800 focus:ring-clay-500",
    secondary:
      "bg-earth-100 text-earth-700 hover:bg-earth-200 focus:ring-earth-500",
    outlined:
      "border-2 border-clay-600 text-clay-600 hover:bg-clay-50 focus:ring-clay-500",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  };

  const Comp = to ? MotionLink : motion.button;

  return (
    <Comp
      whileTap={{ scale: 0.95 }}
      type={to ? undefined : type}
      to={to}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className} ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      }`}
      {...props}
    >
      {children}
    </Comp>
  );
};

export default Button;
