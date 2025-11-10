import { Link } from 'react-router-dom';

export default function AdminDashboard() {
  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-2xl font-serif mb-6">Admin Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Link to="/admin/products" className="p-4 border rounded hover:bg-gray-50">Manage Products</Link>
        <Link to="/admin/orders" className="p-4 border rounded hover:bg-gray-50">View Orders</Link>
        <Link to="/admin/users" className="p-4 border rounded hover:bg-gray-50">Manage Users</Link>
      </div>
    </div>
  );
}