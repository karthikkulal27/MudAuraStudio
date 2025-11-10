import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';

export default function AdminRoute({ children }) {
  const { isAuthenticated, user } = useSelector((s) => s.auth);
  const location = useLocation();
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  if (user?.role !== 'ADMIN') {
    return <Navigate to="/" replace />;
  }
  return children;
}