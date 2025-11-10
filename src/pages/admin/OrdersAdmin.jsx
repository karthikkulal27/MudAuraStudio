import { useEffect, useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function OrdersAdmin() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/admin/orders`, { credentials: 'include' });
      const data = await res.json();
      setOrders(data.orders || []);
    } finally { setLoading(false); }
  }
  useEffect(()=>{load();},[]);

  async function updateStatus(id, status) {
    await fetch(`${API_URL}/admin/orders/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ status })
    });
    load();
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-2xl font-serif mb-4">Orders</h1>
      {loading ? 'Loading...' : (
        <div className="space-y-4">
          {orders.map(o => (
            <div key={o.id} className="border rounded p-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Order {o.id.slice(0,8)}...</div>
                  <div className="text-sm text-gray-600">{o.user?.email} • {new Date(o.createdAt).toLocaleString()}</div>
                </div>
                <div className="flex items-center gap-2">
                  <select value={o.status} onChange={e=>updateStatus(o.id, e.target.value)} className="border p-1 rounded text-sm">
                    {['pending','processing','completed','cancelled'].map(s=> <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              <ul className="mt-2 text-sm list-disc pl-5">
                {o.items?.map(it => (
                  <li key={it.id}>{it.product?.name} × {it.quantity} — ${it.price.toFixed(2)}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}