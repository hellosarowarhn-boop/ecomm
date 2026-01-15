'use client';

import { useEffect, useState } from 'react';
import AdminLayout from '@/components/AdminLayout';

interface Order {
    id: number;
    customer_name: string;
    phone: string;
    city: string;
    address: string;
    product_name_snapshot: string;
    price_snapshot: number;
    order_status: 'pending' | 'processing' | 'delivered_to_courier' | 'complete' | 'waiting' | 'canceled';
    created_at: string;
}

export default function AdminOrders() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [searchPhone, setSearchPhone] = useState('');
    const [dateFilter, setDateFilter] = useState<string>('today'); // Default to today
    const [showFilters, setShowFilters] = useState(false); // Toggle for filters

    useEffect(() => {
        fetchOrders();
    }, []);

    useEffect(() => {
        filterOrders();
    }, [statusFilter, searchPhone, dateFilter, orders]);

    const fetchOrders = async () => {
        try {
            const res = await fetch('/api/orders');
            const data = await res.json();
            setOrders(data);
            setFilteredOrders(data);
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
        }
    };

    const isToday = (dateString: string) => {
        const orderDate = new Date(dateString);
        const today = new Date();
        return orderDate.toDateString() === today.toDateString();
    };

    const isThisWeek = (dateString: string) => {
        const orderDate = new Date(dateString);
        const today = new Date();
        const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
        return orderDate >= weekAgo && orderDate <= today;
    };

    const isThisMonth = (dateString: string) => {
        const orderDate = new Date(dateString);
        const today = new Date();
        return orderDate.getMonth() === today.getMonth() &&
            orderDate.getFullYear() === today.getFullYear();
    };

    const filterOrders = () => {
        let filtered = [...orders];

        // Filter by date (default: today)
        if (dateFilter === 'today') {
            filtered = filtered.filter(order => isToday(order.created_at));
        } else if (dateFilter === 'week') {
            filtered = filtered.filter(order => isThisWeek(order.created_at));
        } else if (dateFilter === 'month') {
            filtered = filtered.filter(order => isThisMonth(order.created_at));
        }
        // 'all' shows all orders

        // Filter by status
        if (statusFilter !== 'all') {
            filtered = filtered.filter(order => order.order_status === statusFilter);
        }

        // Filter by phone number
        if (searchPhone.trim() !== '') {
            filtered = filtered.filter(order =>
                order.phone.toLowerCase().includes(searchPhone.toLowerCase())
            );
        }

        setFilteredOrders(filtered);
    };

    const handleUpdateOrder = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedOrder) return;

        try {
            const res = await fetch('/api/orders', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: selectedOrder.id,
                    order_status: selectedOrder.order_status,
                }),
            });

            if (res.ok) {
                await fetchOrders();
                setShowModal(false);
                setSelectedOrder(null);
                alert('✅ Order status updated successfully!');
            } else {
                alert('❌ Failed to update order');
            }
        } catch (error) {
            console.error('Error updating order:', error);
            alert('❌ Failed to update order');
        }
    };

    const handleDeleteOrder = async (orderId: number) => {
        if (!confirm('Are you sure you want to delete this order? This action cannot be undone.')) return;

        try {
            const res = await fetch(`/api/orders?id=${orderId}`, {
                method: 'DELETE',
            });

            if (res.ok) {
                await fetchOrders();
                alert('✅ Order deleted successfully!');
            } else {
                alert('❌ Failed to delete order');
            }
        } catch (error) {
            console.error('Error deleting order:', error);
            alert('❌ Failed to delete order');
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
            case 'processing': return 'bg-blue-100 text-blue-800 border-blue-300';
            case 'delivered_to_courier': return 'bg-purple-100 text-purple-800 border-purple-300';
            case 'complete': return 'bg-green-100 text-green-800 border-green-300';
            case 'waiting': return 'bg-orange-100 text-orange-800 border-orange-300';
            case 'canceled': return 'bg-red-100 text-red-800 border-red-300';
            default: return 'bg-gray-100 text-gray-800 border-gray-300';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'pending': return '⏳';
            case 'processing': return '📦';
            case 'delivered_to_courier': return '🚚';
            case 'complete': return '✅';
            case 'waiting': return '⏸️';
            case 'canceled': return '❌';
            default: return '📋';
        }
    };

    const formatStatus = (status: string) => {
        return status.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    };

    const handleExportCSV = () => {
        const headers = [
            'ItemType', 'StoreName', 'MerchantOrderId', 'RecipientName', 'RecipientPhone',
            'RecipientAddress', 'RecipientCity', 'RecipientZone', 'RecipientArea', 'AmountToCollect',
            'ItemQuantity', 'ItemWeight', 'ItemDesc', 'SpecialInstruction'
        ];

        const escapeCsv = (str: any) => {
            if (str === null || str === undefined) return '';
            const stringValue = String(str);
            if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
                return `"${stringValue.replace(/"/g, '""')}"`;
            }
            return stringValue;
        };

        const csvContent = [
            headers.join(','),
            ...filteredOrders.map(order => [
                'parcel',
                '',
                '',
                escapeCsv(order.customer_name),
                escapeCsv(order.phone),
                escapeCsv(order.address),
                escapeCsv(order.city),
                escapeCsv(order.city),
                '',
                escapeCsv(order.price_snapshot),
                '1',
                '0.5',
                escapeCsv(order.product_name_snapshot),
                ''
            ].join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        if (link.download !== undefined) {
            const now = new Date();
            const day = String(now.getDate()).padStart(2, '0');
            const month = now.toLocaleString('en-US', { month: 'short' });
            const year = now.getFullYear();
            const hours = String(now.getHours()).padStart(2, '0');
            const minutes = String(now.getMinutes()).padStart(2, '0');
            const seconds = String(now.getSeconds()).padStart(2, '0');
            const filename = `orders_${day}_${month}_${year}_${hours}_${minutes}_${seconds}.csv`;

            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', filename);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    if (loading) {
        return (
            <AdminLayout>
                <div className="flex items-center justify-center h-96">
                    <div className="text-center">
                        <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-600"></div>
                        <p className="mt-4 text-gray-600 font-medium">Loading orders...</p>
                    </div>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="space-y-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-4xl font-bold text-gray-800 mb-2">Order Management</h1>
                        <p className="text-gray-600">View and manage all customer orders</p>
                    </div>
                    <button
                        onClick={handleExportCSV}
                        className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all font-bold shadow-md flex items-center gap-2"
                    >
                        <span>📄</span> Export to CSV
                    </button>
                </div>

                {/* Date Filter (Always Visible) */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold text-gray-800">📅 Date Filter</h2>
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-all font-semibold flex items-center gap-2"
                        >
                            {showFilters ? '▼' : '▶'} More Filters
                        </button>
                    </div>

                    {/* Date Filter Buttons */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {[
                            { value: 'today', label: '📆 Today', icon: '🔥' },
                            { value: 'week', label: '📅 This Week', icon: '📊' },
                            { value: 'month', label: '📆 This Month', icon: '📈' },
                            { value: 'all', label: '🗂️ All Time', icon: '∞' }
                        ].map((filter) => (
                            <button
                                key={filter.value}
                                onClick={() => setDateFilter(filter.value)}
                                className={`px-6 py-4 rounded-xl font-bold transition-all border-2 ${dateFilter === filter.value
                                        ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white border-purple-600 shadow-lg scale-105'
                                        : 'bg-white text-gray-700 border-gray-200 hover:border-purple-300 hover:shadow-md'
                                    }`}
                            >
                                <div className="text-2xl mb-1">{filter.icon}</div>
                                <div className="text-sm">{filter.label}</div>
                            </button>
                        ))}
                    </div>

                    {/* Collapsible Filters */}
                    {showFilters && (
                        <div className="mt-6 pt-6 border-t-2 border-gray-200">
                            <div className="grid md:grid-cols-2 gap-6">
                                {/* Status Filter */}
                                <div>
                                    <label className="block text-gray-700 font-semibold mb-3">Filter by Status</label>
                                    <select
                                        value={statusFilter}
                                        onChange={(e) => setStatusFilter(e.target.value)}
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none font-semibold text-gray-700 bg-white cursor-pointer hover:border-purple-300 transition-all"
                                    >
                                        <option value="all">All Orders ({orders.length})</option>
                                        {['pending', 'processing', 'delivered_to_courier', 'complete', 'waiting', 'canceled'].map((status) => (
                                            <option key={status} value={status}>
                                                {formatStatus(status)} ({orders.filter(o => o.order_status === status).length})
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Phone Search */}
                                <div>
                                    <label className="block text-gray-700 font-semibold mb-3">Search by Phone Number</label>
                                    <div className="flex gap-3">
                                        <input
                                            type="text"
                                            value={searchPhone}
                                            onChange={(e) => setSearchPhone(e.target.value)}
                                            className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none"
                                            placeholder="Enter phone number..."
                                        />
                                        {searchPhone && (
                                            <button
                                                onClick={() => setSearchPhone('')}
                                                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
                                            >
                                                Clear
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Results Count */}
                    <div className="mt-4 pt-4 border-t border-gray-200">
                        <p className="text-gray-600">
                            Showing <strong className="text-purple-600">{filteredOrders.length}</strong> of <strong>{orders.length}</strong> orders
                        </p>
                    </div>
                </div>

                {/* Orders List */}
                {filteredOrders.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                        <div className="text-6xl mb-4">🔍</div>
                        <h3 className="text-2xl font-bold text-gray-800 mb-2">No Orders Found</h3>
                        <p className="text-gray-600">Try adjusting your filters or search criteria</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filteredOrders.map((order) => (
                            <div
                                key={order.id}
                                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all"
                            >
                                <div className="p-6">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-16 h-16 gradient-primary rounded-xl flex items-center justify-center text-white font-bold text-xl">
                                                #{order.id}
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-bold text-gray-800 mb-1">
                                                    {order.customer_name}
                                                </h3>
                                                <p className="text-gray-600 text-sm">
                                                    {new Date(order.created_at).toLocaleDateString('en-US', {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit',
                                                    })}
                                                </p>
                                            </div>
                                        </div>
                                        <div className={`px-4 py-2 rounded-lg border-2 font-semibold flex items-center gap-2 ${getStatusColor(order.order_status)}`}>
                                            <span>{getStatusIcon(order.order_status)}</span>
                                            <span>{formatStatus(order.order_status)}</span>
                                        </div>
                                    </div>

                                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                                        <div className="bg-gray-50 rounded-lg p-4">
                                            <p className="text-sm text-gray-600 mb-1">Phone</p>
                                            <p className="font-semibold text-gray-800">{order.phone}</p>
                                        </div>
                                        <div className="bg-gray-50 rounded-lg p-4">
                                            <p className="text-sm text-gray-600 mb-1">City</p>
                                            <p className="font-semibold text-gray-800">{order.city}</p>
                                        </div>
                                        <div className="bg-gray-50 rounded-lg p-4">
                                            <p className="text-sm text-gray-600 mb-1">Product</p>
                                            <p className="font-semibold text-gray-800">{order.product_name_snapshot}</p>
                                        </div>
                                        <div className="bg-gray-50 rounded-lg p-4">
                                            <p className="text-sm text-gray-600 mb-1">Price</p>
                                            <p className="font-bold text-xl gradient-primary bg-clip-text text-transparent">
                                                ${parseFloat(order.price_snapshot.toString()).toFixed(2)}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 mb-4">
                                        <p className="text-sm text-gray-600 mb-1">Delivery Address</p>
                                        <p className="text-gray-800">{order.address}</p>
                                    </div>

                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => {
                                                setSelectedOrder(order);
                                                setShowModal(true);
                                            }}
                                            className="flex-1 px-6 py-3 gradient-primary text-white rounded-lg hover:shadow-lg transition-all font-semibold"
                                        >
                                            Update Status
                                        </button>
                                        <button
                                            onClick={() => handleDeleteOrder(order.id)}
                                            className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-semibold"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Update Status Modal */}
            {showModal && selectedOrder && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full">
                        <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-6 text-white">
                            <h2 className="text-3xl font-bold">Update Order Status</h2>
                            <p className="text-purple-100">Order #{selectedOrder.id}</p>
                        </div>
                        <form onSubmit={handleUpdateOrder} className="p-8 space-y-6">
                            {/* Customer Info Summary */}
                            <div className="bg-gray-50 rounded-xl p-4">
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-gray-600">Customer</p>
                                        <p className="font-semibold text-gray-800">{selectedOrder.customer_name}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Phone</p>
                                        <p className="font-semibold text-gray-800">{selectedOrder.phone}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Product</p>
                                        <p className="font-semibold text-gray-800">{selectedOrder.product_name_snapshot}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Price</p>
                                        <p className="font-semibold text-gray-800">${parseFloat(selectedOrder.price_snapshot.toString()).toFixed(2)}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Status Selection */}
                            <div>
                                <label className="block text-gray-700 font-semibold mb-3 text-lg">Select New Status</label>
                                <div className="grid grid-cols-2 gap-3">
                                    {['pending', 'processing', 'delivered_to_courier', 'complete', 'waiting', 'canceled'].map((status) => (
                                        <button
                                            key={status}
                                            type="button"
                                            onClick={() => setSelectedOrder({ ...selectedOrder, order_status: status as any })}
                                            className={`p-4 rounded-xl border-2 font-semibold transition-all ${selectedOrder.order_status === status
                                                ? getStatusColor(status) + ' border-current shadow-lg scale-105'
                                                : 'bg-white border-gray-200 text-gray-700 hover:border-purple-300'
                                                }`}
                                        >
                                            <div className="flex items-center gap-2">
                                                <span className="text-2xl">{getStatusIcon(status)}</span>
                                                <span>{formatStatus(status)}</span>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Current Status Indicator */}
                            <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
                                <p className="text-sm text-gray-600 mb-2">Current Status:</p>
                                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border-2 font-semibold ${getStatusColor(selectedOrder.order_status)}`}>
                                    <span className="text-xl">{getStatusIcon(selectedOrder.order_status)}</span>
                                    <span>{formatStatus(selectedOrder.order_status)}</span>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-4 pt-4 border-t-2 border-gray-200">
                                <button
                                    type="submit"
                                    className="flex-1 px-6 py-4 gradient-primary text-white rounded-xl font-bold text-lg hover:shadow-2xl transition-all"
                                >
                                    Update Status
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowModal(false);
                                        setSelectedOrder(null);
                                    }}
                                    className="flex-1 px-6 py-4 bg-gray-200 text-gray-700 rounded-xl font-bold text-lg hover:bg-gray-300 transition-all"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
