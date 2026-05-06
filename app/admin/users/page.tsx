'use client';

import { useEffect, useState } from 'react';
import api from '@/services/api';
import toast from 'react-hot-toast';
import { Users, Loader2, Trash2, ShieldCheck, RefreshCw } from 'lucide-react';

interface User {
  _id: string;
  email: string;
  role: 'user' | 'admin' | 'superadmin';
  createdAt: string;
}

const ROLE_COLORS: Record<string, string> = {
  superadmin: 'bg-red-50 text-red-600 border border-red-100',
  admin: 'bg-blue-50 text-blue-600 border border-blue-100',
  user: 'bg-gray-100 text-gray-600 border border-gray-200',
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [currentUserEmail, setCurrentUserEmail] = useState('');
  const [currentUserRole, setCurrentUserRole] = useState('');

  useEffect(() => {
    try {
      const stored = localStorage.getItem('user');
      if (stored) {
        const u = JSON.parse(stored);
        setCurrentUserEmail(u.email ?? '');
        setCurrentUserRole(u.role ?? '');
      }
    } catch { /* ignore */ }
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await api.get('/users');
      setUsers(Array.isArray(res.data.users) ? res.data.users : []);
    } catch {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, email: string) => {
    if (!confirm(`Delete user "${email}"? This cannot be undone.`)) return;
    setDeletingId(id);
    try {
      await api.delete(`/users/${id}`);
      setUsers((prev) => prev.filter((u) => u._id !== id));
      toast.success('User deleted');
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(error?.response?.data?.message || 'Failed to delete user');
    } finally {
      setDeletingId(null);
    }
  };

  const handleRoleChange = async (id: string, newRole: string) => {
    setUpdatingId(id);
    try {
      await api.put(`/users/${id}`, { role: newRole });
      setUsers((prev) => prev.map((u) => u._id === id ? { ...u, role: newRole as User['role'] } : u));
      toast.success(`Role updated to ${newRole}`);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(error?.response?.data?.message || 'Failed to update role');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-extrabold text-gray-900 flex items-center gap-2">
            <Users size={22} className="text-[#FF6B00]" /> Users
          </h2>
          <p className="text-sm text-gray-500 mt-0.5">{users.length} total users</p>
        </div>
        <button
          onClick={fetchUsers}
          className="bg-white border border-gray-200 text-gray-600 hover:text-gray-900 p-2 rounded-lg transition"
          title="Refresh"
        >
          <RefreshCw size={16} />
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20 text-gray-400">
            <Loader2 size={28} className="animate-spin" />
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <Users size={40} className="mx-auto mb-3 opacity-30" />
            <p className="font-medium">No users found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left px-5 py-3.5 font-semibold text-gray-600">Email</th>
                  <th className="text-left px-4 py-3.5 font-semibold text-gray-600">Role</th>
                  <th className="text-left px-4 py-3.5 font-semibold text-gray-600 hidden sm:table-cell">Joined</th>
                  <th className="text-right px-5 py-3.5 font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {users.map((u) => {
                  const isSelf = u.email === currentUserEmail;
                  const canChangeRole = currentUserRole === 'superadmin' && !isSelf;
                  const canDelete = !isSelf && u.role !== 'superadmin';

                  return (
                    <tr key={u._id} className="hover:bg-gray-50 transition">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-[#FF6B00]/10 rounded-full flex items-center justify-center shrink-0">
                            <ShieldCheck size={14} className="text-[#FF6B00]" />
                          </div>
                          <span className="font-medium text-gray-800 truncate max-w-[200px]">
                            {u.email}
                            {isSelf && <span className="ml-1.5 text-xs text-gray-400">(you)</span>}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        {canChangeRole ? (
                          <div className="relative">
                            <select
                              value={u.role}
                              onChange={(e) => handleRoleChange(u._id, e.target.value)}
                              disabled={updatingId === u._id}
                              className={`text-xs font-bold px-2.5 py-1 rounded-full border-0 outline-none cursor-pointer ${ROLE_COLORS[u.role]} disabled:opacity-60`}
                            >
                              <option value="user">user</option>
                              <option value="admin">admin</option>
                              <option value="superadmin">superadmin</option>
                            </select>
                            {updatingId === u._id && (
                              <Loader2 size={12} className="animate-spin absolute right-1 top-1/2 -translate-y-1/2 text-gray-400" />
                            )}
                          </div>
                        ) : (
                          <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${ROLE_COLORS[u.role]}`}>
                            {u.role}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3.5 text-gray-500 hidden sm:table-cell">
                        {new Date(u.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        {canDelete ? (
                          <button
                            onClick={() => handleDelete(u._id, u.email)}
                            disabled={deletingId === u._id}
                            className="bg-red-50 hover:bg-red-100 text-red-500 p-2 rounded-lg transition disabled:opacity-50"
                            title="Delete user"
                          >
                            {deletingId === u._id
                              ? <Loader2 size={14} className="animate-spin" />
                              : <Trash2 size={14} />
                            }
                          </button>
                        ) : (
                          <span className="text-gray-300 text-xs">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
