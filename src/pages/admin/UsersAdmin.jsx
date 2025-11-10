import { useEffect, useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function UsersAdmin() {
  const [users, setUsers] = useState([]);
  async function load() {
    const res = await fetch(`${API_URL}/admin/users`, { credentials: 'include' });
    const data = await res.json();
    setUsers(data.users || []);
  }
  useEffect(()=>{load();},[]);

  async function promote(id) {
    await fetch(`${API_URL}/admin/users/${id}/promote`, { method: 'POST', credentials: 'include' });
    load();
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-2xl font-serif mb-4">Users</h1>
      <table className="w-full text-sm border">
        <thead>
          <tr className="bg-gray-50 text-left"><th className="p-2">Email</th><th className="p-2">Name</th><th className="p-2">Role</th><th className="p-2">Action</th></tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u.id} className="border-t">
              <td className="p-2">{u.email}</td>
              <td className="p-2">{u.name}</td>
              <td className="p-2">{u.role}</td>
              <td className="p-2">
                {u.role !== 'ADMIN' && (
                  <button onClick={()=>promote(u.id)} className="text-xs text-clay-700 hover:underline">Promote to Admin</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}