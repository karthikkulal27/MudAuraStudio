import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import Button from './Button';
import { useDispatch } from 'react-redux';
import { addItem } from '../../store/slices/cartSlice';

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();

  const imageSrc = product.image || (product.images && product.images[0]) || '';

  const handleAdd = (e) => {
    e.preventDefault();
    // Dispatch addItem with quantity 1
    dispatch(addItem({ ...product, quantity: 1 }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="group relative bg-white rounded-lg shadow-sm overflow-hidden flex flex-col"
    >
      <Link to={`/product/${product.id}`} className="block flex-1">
        <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden">
          <LazyLoadImage
            src={imageSrc}
            alt={product.name}
            effect="blur"
            className="w-full h-full object-center object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        <div className="px-4 py-3">
          <h3 className="text-sm font-medium text-gray-900">{product.name}</h3>
          <p className="mt-1 text-lg font-semibold text-clay-600">${product.price.toFixed(2)}</p>
          <p className="mt-1 text-sm text-gray-500">{product.category}</p>
        </div>
      </Link>
      <div className="p-4 pt-0 z-10 bg-white">
        <Button
          variant="primary"
          size="sm"
          onClick={handleAdd}
          className="w-full"
        >
          Add to Cart
        </Button>
      </div>
    </motion.div>
  );
};

export default ProductCard;