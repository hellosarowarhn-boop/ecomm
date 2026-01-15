'use client';

import { useEffect, useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import Link from 'next/link';

interface OrderStats {
    total: number;
    pending: number;
    processing: number;
    delivered_to_courier: number;
    complete: number;
    waiting: number;
    canceled: number;
}

interface ProductStats {
    productA: number;
    productB: number;
    combo: number;
}

interface Order {
    id: number;
    product_name_snapshot: string;
    order_status: string;
    created_at: string;
}

export default function AdminDashboard() {
    const [orderStats, setOrderStats] = useState<OrderStats>({
        total: 0,
        pending: 0,
        processing: 0,
        delivered_to_courier: 0,
        complete: 0,
        waiting: 0,
        canceled: 0,
    });
    const [productStats, setProductStats] = useState<ProductStats>({
        productA: 0,
        productB: 0,
        combo: 0,
    });
    const [recentOrders, setRecentOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const ordersRes = await fetch('/api/orders');
                let orders: Order[] = [];
                if (ordersRes.ok) {
                    const data = await ordersRes.json();
                    if (Array.isArray(data)) {
                        orders = data;
                    } else {
                        console.error('Invalid orders format:', data);
                    }
                } else {
                    console.error('Failed to fetch orders:', ordersRes.statusText);
                }

                // Calculate order statistics
                const stats: OrderStats = {
                    total: orders.length,
                    pending: orders.filter(o => o.order_status === 'pending').length,
                    processing: orders.filter(o => o.order_status === 'processing').length,
                    delivered_to_courier: orders.filter(o => o.order_status === 'delivered_to_courier').length,
                    complete: orders.filter(o => o.order_status === 'complete').length,
                    waiting: orders.filter(o => o.order_status === 'waiting').length,
                    canceled: orders.filter(o => o.order_status === 'canceled').length,
                };

                // Calculate product-wise statistics
                const prodStats: ProductStats = {
                    productA: orders.filter(o => o.product_name_snapshot === 'Product A').length,
                    productB: orders.filter(o => o.product_name_snapshot === 'Product B').length,
                    combo: orders.filter(o => o.product_name_snapshot.includes('Combo')).length,
                };

                setOrderStats(stats);
                setProductStats(prodStats);
                setRecentOrders(orders.slice(0, 5));
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <AdminLayout>
                <div className="flex items-center justify-center h-96">
                    <div className="text-center">
                        <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-600"></div>
                        <p className="mt-4 text-gray-600 font-medium">Loading dashboard...</p>
                    </div>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="space-y-8">
                <div>
                    <h1 className="text-4xl font-bold text-gray-800 mb-2">Dashboard</h1>
                    <p className="text-gray-600">Overview of your e-commerce store</p>
                </div>

                {/* Total Orders Card */}
                <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl shadow-xl p-8 text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-purple-100 text-lg mb-2">Total Orders</p>
                            <h2 className="text-6xl font-bold">{orderStats.total}</h2>
                        </div>
                        <div className="text-8xl opacity-20">📦</div>
                    </div>
                </div>

                {/* Orders by Status */}
                <div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Orders by Status</h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Pending */}
                        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-yellow-500 hover:shadow-xl transition-shadow">
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="text-gray-600 font-semibold">Pending</h3>
                                <span className="text-3xl">⏳</span>
                            </div>
                            <p className="text-4xl font-bold text-gray-800">{orderStats.pending}</p>
                            <p className="text-sm text-gray-500 mt-2">Awaiting confirmation</p>
                        </div>

                        {/* Processing */}
                        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500 hover:shadow-xl transition-shadow">
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="text-gray-600 font-semibold">Processing</h3>
                                <span className="text-3xl">📦</span>
                            </div>
                            <p className="text-4xl font-bold text-gray-800">{orderStats.processing}</p>
                            <p className="text-sm text-gray-500 mt-2">Being prepared</p>
                        </div>

                        {/* Delivered to Courier */}
                        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500 hover:shadow-xl transition-shadow">
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="text-gray-600 font-semibold">Delivered to Courier</h3>
                                <span className="text-3xl">🚚</span>
                            </div>
                            <p className="text-4xl font-bold text-gray-800">{orderStats.delivered_to_courier}</p>
                            <p className="text-sm text-gray-500 mt-2">Out for delivery</p>
                        </div>

                        {/* Complete */}
                        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500 hover:shadow-xl transition-shadow">
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="text-gray-600 font-semibold">Complete</h3>
                                <span className="text-3xl">✅</span>
                            </div>
                            <p className="text-4xl font-bold text-gray-800">{orderStats.complete}</p>
                            <p className="text-sm text-gray-500 mt-2">Successfully delivered</p>
                        </div>

                        {/* Waiting */}
                        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-orange-500 hover:shadow-xl transition-shadow">
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="text-gray-600 font-semibold">Waiting</h3>
                                <span className="text-3xl">⏸️</span>
                            </div>
                            <p className="text-4xl font-bold text-gray-800">{orderStats.waiting}</p>
                            <p className="text-sm text-gray-500 mt-2">On hold</p>
                        </div>

                        {/* Canceled */}
                        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-red-500 hover:shadow-xl transition-shadow">
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="text-gray-600 font-semibold">Canceled</h3>
                                <span className="text-3xl">❌</span>
                            </div>
                            <p className="text-4xl font-bold text-gray-800">{orderStats.canceled}</p>
                            <p className="text-sm text-gray-500 mt-2">Canceled orders</p>
                        </div>
                    </div>
                </div>

                {/* Product-wise Order Count */}
                <div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Orders by Product</h2>
                    <div className="grid md:grid-cols-3 gap-6">
                        {/* Product A */}
                        <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                            <div className="bg-gradient-to-br from-purple-100 to-blue-100 p-6">
                                <div className="flex justify-center gap-1 mb-4">
                                    {[...Array(5)].map((_, i) => (
                                        <div key={i} className="text-2xl">🍾</div>
                                    ))}
                                </div>
                            </div>
                            <div className="p-6">
                                <h3 className="text-xl font-bold text-gray-800 mb-2">Product A</h3>
                                <div className="flex items-baseline gap-2">
                                    <p className="text-5xl font-bold gradient-primary bg-clip-text text-transparent">
                                        {productStats.productA}
                                    </p>
                                    <p className="text-gray-600">orders</p>
                                </div>
                                <div className="mt-4 pt-4 border-t border-gray-200">
                                    <p className="text-sm text-gray-500">
                                        {orderStats.total > 0
                                            ? `${((productStats.productA / orderStats.total) * 100).toFixed(1)}% of total`
                                            : '0% of total'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Product B */}
                        <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                            <div className="bg-gradient-to-br from-blue-100 to-purple-100 p-6">
                                <div className="flex justify-center gap-1 mb-4">
                                    {[...Array(5)].map((_, i) => (
                                        <div key={i} className="text-2xl">🍾</div>
                                    ))}
                                </div>
                            </div>
                            <div className="p-6">
                                <h3 className="text-xl font-bold text-gray-800 mb-2">Product B</h3>
                                <div className="flex items-baseline gap-2">
                                    <p className="text-5xl font-bold gradient-primary bg-clip-text text-transparent">
                                        {productStats.productB}
                                    </p>
                                    <p className="text-gray-600">orders</p>
                                </div>
                                <div className="mt-4 pt-4 border-t border-gray-200">
                                    <p className="text-sm text-gray-500">
                                        {orderStats.total > 0
                                            ? `${((productStats.productB / orderStats.total) * 100).toFixed(1)}% of total`
                                            : '0% of total'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Combo Product */}
                        <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow border-2 border-purple-200">
                            <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-1">
                                <div className="bg-white rounded-t-lg p-6">
                                    <div className="flex justify-center items-center gap-4">
                                        <div className="flex gap-1">
                                            {[...Array(3)].map((_, i) => (
                                                <div key={i} className="text-xl">🍾</div>
                                            ))}
                                        </div>
                                        <div className="text-2xl font-bold text-purple-600">+</div>
                                        <div className="flex gap-1">
                                            {[...Array(3)].map((_, i) => (
                                                <div key={i} className="text-xl">🍾</div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="p-6">
                                <div className="flex items-center gap-2 mb-2">
                                    <h3 className="text-xl font-bold text-gray-800">Combo Product</h3>
                                    <span className="px-2 py-1 bg-yellow-400 text-gray-900 text-xs font-bold rounded">BEST DEAL</span>
                                </div>
                                <div className="flex items-baseline gap-2">
                                    <p className="text-5xl font-bold gradient-primary bg-clip-text text-transparent">
                                        {productStats.combo}
                                    </p>
                                    <p className="text-gray-600">orders</p>
                                </div>
                                <div className="mt-4 pt-4 border-t border-gray-200">
                                    <p className="text-sm text-gray-500">
                                        {orderStats.total > 0
                                            ? `${((productStats.combo / orderStats.total) * 100).toFixed(1)}% of total`
                                            : '0% of total'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recent Orders */}
                {recentOrders.length > 0 && (
                    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                        <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-6 text-white">
                            <h2 className="text-2xl font-bold">Recent Orders</h2>
                        </div>
                        <div className="p-6">
                            <div className="space-y-4">
                                {recentOrders.map((order) => (
                                    <div
                                        key={order.id}
                                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 gradient-primary rounded-lg flex items-center justify-center text-white font-bold">
                                                #{order.id}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-gray-800">{order.product_name_snapshot}</p>
                                                <p className="text-sm text-gray-600">
                                                    {new Date(order.created_at).toLocaleDateString('en-US', {
                                                        month: 'short',
                                                        day: 'numeric',
                                                        year: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit',
                                                    })}
                                                </p>
                                            </div>
                                        </div>
                                        <div>
                                            <span className={`px-4 py-2 rounded-full text-sm font-semibold ${order.order_status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                order.order_status === 'processing' ? 'bg-blue-100 text-blue-800' :
                                                    order.order_status === 'delivered_to_courier' ? 'bg-purple-100 text-purple-800' :
                                                        order.order_status === 'complete' ? 'bg-green-100 text-green-800' :
                                                            order.order_status === 'waiting' ? 'bg-orange-100 text-orange-800' :
                                                                'bg-red-100 text-red-800'
                                                }`}>
                                                {order.order_status.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-6 text-center">
                                <Link
                                    href="/admin/orders"
                                    className="inline-block px-6 py-3 gradient-primary text-white rounded-lg hover:shadow-lg transition-all font-semibold"
                                >
                                    View All Orders
                                </Link>
                            </div>
                        </div>
                    </div>
                )}

                {/* Empty State */}
                {orderStats.total === 0 && (
                    <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                        <div className="text-6xl mb-4">📭</div>
                        <h3 className="text-2xl font-bold text-gray-800 mb-2">No Orders Yet</h3>
                        <p className="text-gray-600 mb-6">Orders will appear here once customers start placing them</p>
                        <Link
                            href="/"
                            className="inline-block px-6 py-3 gradient-primary text-white rounded-lg hover:shadow-lg transition-all font-semibold"
                        >
                            View Landing Page
                        </Link>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
