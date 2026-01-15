'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/AdminLayout';

interface AdminUser {
    id: number;
    name: string;
    email: string;
    role: 'super_admin' | 'co_admin';
    createdAt: string;
}

export default function AdminManagementPage() {
    const [admins, setAdmins] = useState<AdminUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        id: 0,
        name: '',
        email: '',
        password: '',
        role: 'co_admin',
    });
    const [isEditing, setIsEditing] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchAdmins();
    }, []);

    const fetchAdmins = async () => {
        try {
            const res = await fetch('/api/admin/admins');
            if (res.ok) {
                const data = await res.json();
                setAdmins(data);
            }
        } catch (error) {
            console.error('Error fetching admins:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            const url = isEditing
                ? `/api/admin/admins/${formData.id}`
                : '/api/admin/admins';
            const method = isEditing ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                setShowModal(false);
                fetchAdmins();
                resetForm();
            } else {
                const data = await res.json();
                setError(data.error || 'Operation failed');
            }
        } catch (error) {
            setError('An error occurred');
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this admin?')) return;

        try {
            const res = await fetch(`/api/admin/admins/${id}`, {
                method: 'DELETE',
            });

            if (res.ok) {
                fetchAdmins();
            } else {
                alert('Failed to delete admin');
            }
        } catch (error) {
            console.error('Error deleting admin:', error);
        }
    };

    const resetForm = () => {
        setFormData({
            id: 0,
            name: '',
            email: '',
            password: '',
            role: 'co_admin',
        });
        setIsEditing(false);
        setError('');
    };

    const openEditModal = (admin: AdminUser) => {
        setFormData({
            id: admin.id,
            name: admin.name || '',
            email: admin.email,
            password: '', // Don't show password
            role: admin.role as 'super_admin' | 'co_admin',
        });
        setIsEditing(true);
        setShowModal(true);
    };

    if (loading) {
        return (
            <AdminLayout>
                <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-purple-600"></div>
                    </div>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Co-Admins</h1>
                    <p className="text-gray-600">Manage access and roles</p>
                </div>
                <button
                    onClick={() => {
                        resetForm();
                        setShowModal(true);
                    }}
                    className="px-6 py-3 gradient-primary text-white rounded-lg hover:shadow-lg transition-all font-semibold flex items-center gap-2"
                >
                    <span>+</span> Add Admin
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th className="text-left py-4 px-6 text-gray-600 font-semibold">Name</th>
                            <th className="text-left py-4 px-6 text-gray-600 font-semibold">Email</th>
                            <th className="text-left py-4 px-6 text-gray-600 font-semibold">Role</th>
                            <th className="text-left py-4 px-6 text-gray-600 font-semibold">Created</th>
                            <th className="text-right py-4 px-6 text-gray-600 font-semibold">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {admins.map((admin) => (
                            <tr key={admin.id} className="hover:bg-gray-50 transition-colors">
                                <td className="py-4 px-6 font-medium text-gray-800">{admin.name || '-'}</td>
                                <td className="py-4 px-6 text-gray-600">{admin.email}</td>
                                <td className="py-4 px-6">
                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${admin.role === 'super_admin'
                                        ? 'bg-purple-100 text-purple-800'
                                        : 'bg-blue-100 text-blue-800'
                                        }`}>
                                        {admin.role === 'super_admin' ? 'Super Admin' : 'Co-Admin'}
                                    </span>
                                </td>
                                <td className="py-4 px-6 text-gray-500 text-sm">
                                    {new Date(admin.createdAt).toLocaleDateString()}
                                </td>
                                <td className="py-4 px-6 text-right space-x-2">
                                    <button
                                        onClick={() => openEditModal(admin)}
                                        className="text-blue-600 hover:text-blue-800 font-medium"
                                    >
                                        Edit
                                    </button>
                                    {admin.role !== 'super_admin' && (
                                        <button
                                            onClick={() => handleDelete(admin.id)}
                                            className="text-red-500 hover:text-red-700 font-medium ml-2"
                                        >
                                            Delete
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                        {admins.length === 0 && (
                            <tr>
                                <td colSpan={5} className="py-8 text-center text-gray-500">
                                    No admins found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
                        <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                            <h3 className="text-xl font-bold text-gray-800">
                                {isEditing ? 'Edit Admin' : 'Add New Admin'}
                            </h3>
                            <button
                                onClick={() => setShowModal(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                ✕
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Name</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                                    placeholder="Full Name"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
                                <input
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                                    placeholder="admin@example.com"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">
                                    {isEditing ? 'New Password (leave blank to keep)' : 'Password'}
                                </label>
                                <input
                                    type="password"
                                    required={!isEditing}
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                                    placeholder="********"
                                    minLength={6}
                                />
                            </div>

                            {/* Only Super Admin can assign roles, but since this page is Super Admin only, we can show it */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Role</label>
                                <select
                                    value={formData.role}
                                    onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                                >
                                    <option value="co_admin">Co-Admin</option>
                                    <option value="super_admin">Super Admin</option>
                                </select>
                            </div>

                            {error && (
                                <div className="text-red-500 text-sm bg-red-50 p-2 rounded">
                                    {error}
                                </div>
                            )}

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-2 gradient-primary text-white rounded-lg hover:shadow-lg transition-all font-medium"
                                >
                                    {isEditing ? 'Update' : 'Create'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
