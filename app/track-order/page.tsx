'use client';

import { useState } from 'react';
import Link from 'next/link';

interface Order {
    id: number;
    customer_name: string;
    phone: string;
    city: string;
    address: string;
    product_name_snapshot: string;
    price_snapshot: number;
    order_status: string;
    created_at: string;
}

export default function TrackOrderPage() {
    const [phone, setPhone] = useState('');
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(false);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setSearched(true);

        try {
            const res = await fetch(`/api/orders?phone=${encodeURIComponent(phone)}`);
            const data = await res.json();
            setOrders(data);
        } catch (error) {
            console.error('Error fetching orders:', error);
            setOrders([]);
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending':
                return 'bg-yellow-100 text-yellow-800 border-yellow-300';
            case 'processing':
                return 'bg-blue-100 text-blue-800 border-blue-300';
            case 'delivered_to_courier':
                return 'bg-purple-100 text-purple-800 border-purple-300';
            case 'complete':
                return 'bg-green-100 text-green-800 border-green-300';
            case 'waiting':
                return 'bg-orange-100 text-orange-800 border-orange-300';
            case 'canceled':
                return 'bg-red-100 text-red-800 border-red-300';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-300';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'pending':
                return '⏳';
            case 'processing':
                return '📦';
            case 'delivered_to_courier':
                return '🚚';
            case 'complete':
                return '✅';
            case 'waiting':
                return '⏸️';
            case 'canceled':
                return '❌';
            default:
                return '📋';
        }
    };

    const formatStatus = (status: string) => {
        return status
            .split('_')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 py-12">
            <div className="container mx-auto px-4">
                <div className="max-w-4xl mx-auto">
                    <Link
                        href="/"
                        className="inline-flex items-center text-purple-600 hover:text-purple-700 mb-8 font-medium transition-colors"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Back to Home
                    </Link>

                    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                        <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-8 text-white text-center">
                            <div className="text-5xl mb-4">📦</div>
                            <h1 className="text-4xl font-bold mb-2">Track Your Order</h1>
                            <p className="text-purple-100 text-lg">Enter your phone number to see your order status</p>
                        </div>

                        <div className="p-8">
                            <form onSubmit={handleSearch} className="mb-8">
                                <div className="flex gap-4">
                                    <input
                                        type="tel"
                                        required
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        className="flex-1 px-6 py-4 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-colors text-lg"
                                        placeholder="Enter your phone number"
                                    />
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="px-8 py-4 gradient-primary text-white rounded-xl font-bold text-lg hover:shadow-lg transition-all disabled:opacity-50"
                                    >
                                        {loading ? 'Searching...' : 'Track'}
                                    </button>
                                </div>
                            </form>

                            {loading && (
                                <div className="text-center py-12">
                                    <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-600"></div>
                                    <p className="mt-4 text-gray-600 font-medium">Searching for your orders...</p>
                                </div>
                            )}

                            {!loading && searched && orders.length === 0 && (
                                <div className="text-center py-12">
                                    <div className="text-6xl mb-4">🔍</div>
                                    <h3 className="text-2xl font-bold text-gray-800 mb-2">No Orders Found</h3>
                                    <p className="text-gray-600 mb-6">We couldn't find any orders with this phone number</p>
                                    <Link
                                        href="/"
                                        className="inline-block px-6 py-3 gradient-primary text-white rounded-lg hover:shadow-lg transition-all font-semibold"
                                    >
                                        Place an Order
                                    </Link>
                                </div>
                            )}

                            {!loading && orders.length > 0 && (
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <h2 className="text-2xl font-bold text-gray-800">
                                            Your Orders ({orders.length})
                                        </h2>
                                        <p className="text-gray-600">Phone: {phone}</p>
                                    </div>

                                    {orders.map((order) => (
                                        <div
                                            key={order.id}
                                            className="border-2 border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all bg-white"
                                        >
                                            <div className="flex items-start justify-between mb-4">
                                                <div>
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <h3 className="text-xl font-bold text-gray-800">
                                                            Order #{order.id}
                                                        </h3>
                                                        <div className={`px-4 py-1 rounded-full border-2 font-semibold flex items-center gap-2 ${getStatusColor(order.order_status)}`}>
                                                            <span>{getStatusIcon(order.order_status)}</span>
                                                            <span>{formatStatus(order.order_status)}</span>
                                                        </div>
                                                    </div>
                                                    <p className="text-gray-600 text-sm">
                                                        Placed on {new Date(order.created_at).toLocaleDateString('en-US', {
                                                            year: 'numeric',
                                                            month: 'long',
                                                            day: 'numeric',
                                                            hour: '2-digit',
                                                            minute: '2-digit',
                                                        })}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg p-4 mb-4">
                                                <div className="grid md:grid-cols-2 gap-4">
                                                    <div>
                                                        <p className="text-sm text-gray-600 mb-1">Product</p>
                                                        <p className="font-bold text-gray-800 text-lg">{order.product_name_snapshot}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm text-gray-600 mb-1">Price</p>
                                                        <p className="font-bold text-gray-800 text-xl gradient-primary bg-clip-text text-transparent">
                                                            ${parseFloat(order.price_snapshot.toString()).toFixed(2)}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="grid md:grid-cols-2 gap-4 mb-4">
                                                <div>
                                                    <p className="text-sm text-gray-600 mb-1">Customer Name</p>
                                                    <p className="font-semibold text-gray-800">{order.customer_name}</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-600 mb-1">City</p>
                                                    <p className="font-semibold text-gray-800">{order.city}</p>
                                                </div>
                                            </div>

                                            <div className="mb-4">
                                                <p className="text-sm text-gray-600 mb-1">Delivery Address</p>
                                                <p className="text-gray-800">{order.address}</p>
                                            </div>

                                            {/* Order Status Timeline */}
                                            <div className="pt-4 border-t-2 border-gray-200">
                                                <p className="text-sm font-semibold text-gray-700 mb-4">Order Progress</p>
                                                <div className="flex items-center justify-between">
                                                    {['pending', 'processing', 'delivered_to_courier', 'complete'].map((status, index) => {
                                                        const statusOrder = ['pending', 'processing', 'delivered_to_courier', 'complete', 'waiting', 'canceled'];
                                                        const currentIndex = statusOrder.indexOf(order.order_status);
                                                        const thisIndex = statusOrder.indexOf(status);

                                                        const isActive = order.order_status === 'canceled'
                                                            ? false
                                                            : currentIndex >= thisIndex;
                                                        const isCurrent = order.order_status === status;

                                                        return (
                                                            <div key={status} className="flex-1 flex items-center">
                                                                <div className="flex flex-col items-center flex-1">
                                                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${isActive
                                                                            ? 'gradient-primary text-white shadow-lg'
                                                                            : 'bg-gray-200 text-gray-400'
                                                                        } ${isCurrent ? 'ring-4 ring-purple-200 scale-110' : ''}`}>
                                                                        {getStatusIcon(status)}
                                                                    </div>
                                                                    <p className={`text-xs mt-2 font-medium text-center ${isActive ? 'text-purple-600' : 'text-gray-400'
                                                                        }`}>
                                                                        {formatStatus(status)}
                                                                    </p>
                                                                </div>
                                                                {index < 3 && (
                                                                    <div className={`h-1 flex-1 ${isActive ? 'bg-purple-600' : 'bg-gray-200'
                                                                        }`} />
                                                                )}
                                                            </div>
                                                        );
                                                    })}
                                                </div>

                                                {/* Show canceled/waiting status separately */}
                                                {(order.order_status === 'canceled' || order.order_status === 'waiting') && (
                                                    <div className="mt-4 p-4 bg-gray-50 rounded-lg border-2 border-gray-200">
                                                        <div className="flex items-center gap-3">
                                                            <div className={`px-4 py-2 rounded-full border-2 font-semibold flex items-center gap-2 ${getStatusColor(order.order_status)}`}>
                                                                <span className="text-2xl">{getStatusIcon(order.order_status)}</span>
                                                                <span className="text-lg">{formatStatus(order.order_status)}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
