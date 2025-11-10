import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts, createProduct as createProductThunk, updateProduct as updateProductThunk, deleteProduct as deleteProductThunk } from '../../store/slices/productsSlice';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function ProductsAdmin() {
  const dispatch = useDispatch();
  const { user } = useSelector(s => s.auth);
  const products = useSelector(s => s.products.items);
  const loading = useSelector(s => s.products.loading);
  const sliceError = useSelector(s => s.products.error);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ name: '', price: '', category: '', featured: false });
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', price: '', category: '', featured: false });

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  async function createProduct(e) {
    e.preventDefault();
    setError('');
    try {
      await dispatch(createProductThunk({
        name: form.name,
        price: parseFloat(form.price),
        category: form.category,
        images: [],
        stock: 0,
        featured: form.featured,
        description: ''
      })).unwrap();
      setForm({ name: '', price: '', category: '', featured: false });
    } catch (e) { setError(e.message); }
  }

  async function deleteProduct(id) {
    if (!confirm('Delete product?')) return;
    try {
      await dispatch(deleteProductThunk(id)).unwrap();
    } catch (e) { alert(e.message); }
  }

  function beginEdit(p) {
    setEditingId(p.id);
    setEditForm({ name: p.name, price: String(p.price), category: p.category, featured: !!p.featured });
  }

  function cancelEdit() {
    setEditingId(null);
    setEditForm({ name: '', price: '', category: '', featured: false });
  }

  async function saveEdit(id) {
    try {
      await dispatch(updateProductThunk({
        id,
        updates: {
          name: editForm.name,
          price: parseFloat(editForm.price),
          category: editForm.category,
          featured: !!editForm.featured,
        }
      })).unwrap();
      cancelEdit();
    } catch (e) {
      alert(e.message);
    }
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-2xl font-serif mb-4">Products Admin</h1>
      <form onSubmit={createProduct} className="mb-6 grid gap-2 sm:grid-cols-5">
        <input required placeholder="Name" value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} className="border p-2 rounded" />
        <input required type="number" step="0.01" placeholder="Price" value={form.price} onChange={e=>setForm(f=>({...f,price:e.target.value}))} className="border p-2 rounded" />
        <input required placeholder="Category" value={form.category} onChange={e=>setForm(f=>({...f,category:e.target.value}))} className="border p-2 rounded" />
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.featured} onChange={e=>setForm(f=>({...f,featured:e.target.checked}))} /> Featured</label>
        <button className="bg-clay-700 text-white rounded p-2">Add</button>
      </form>
  {(error || sliceError) && <p className="text-red-600 mb-4 text-sm">{error || sliceError}</p>}
      {loading ? <p>Loading...</p> : (
        <table className="w-full text-sm border">
          <thead>
            <tr className="bg-gray-50 text-left">
              <th className="p-2">Name</th>
              <th className="p-2">Category</th>
              <th className="p-2">Price</th>
              <th className="p-2">Featured</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p.id} className="border-t">
                <td className="p-2">
                  {editingId === p.id ? (
                    <input className="border p-1 rounded w-full" value={editForm.name} onChange={e=>setEditForm(f=>({...f,name:e.target.value}))} />
                  ) : p.name}
                </td>
                <td className="p-2">
                  {editingId === p.id ? (
                    <input className="border p-1 rounded w-full" value={editForm.category} onChange={e=>setEditForm(f=>({...f,category:e.target.value}))} />
                  ) : p.category}
                </td>
                <td className="p-2">
                  {editingId === p.id ? (
                    <input type="number" step="0.01" className="border p-1 rounded w-full" value={editForm.price} onChange={e=>setEditForm(f=>({...f,price:e.target.value}))} />
                  ) : `$${p.price.toFixed(2)}`}
                </td>
                <td className="p-2">
                  {editingId === p.id ? (
                    <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={!!editForm.featured} onChange={e=>setEditForm(f=>({...f,featured:e.target.checked}))} /> Featured</label>
                  ) : (p.featured ? 'Yes' : 'No')}
                </td>
                <td className="p-2 space-x-2">
                  {editingId === p.id ? (
                    <>
                      <button onClick={()=>saveEdit(p.id)} className="text-xs text-green-700 hover:underline">Save</button>
                      <button onClick={cancelEdit} className="text-xs text-gray-600 hover:underline">Cancel</button>
                    </>
                  ) : (
                    <>
                      <button onClick={()=>beginEdit(p)} className="text-xs text-blue-700 hover:underline">Edit</button>
                      <button onClick={()=>deleteProduct(p.id)} className="text-xs text-red-600 hover:underline">Delete</button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}