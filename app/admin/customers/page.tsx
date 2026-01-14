'use client';

import { useEffect, useState } from 'react';
import AdminLayout from '@/components/AdminLayout';

interface Order {
    id: number;
    customer_name: string;
    phone: string;
    city: string;
    address: string;
    price_snapshot: number;
    created_at: string;
}

interface Customer {
    name: string;
    phone: string;
    city: string;
    address: string;
    totalOrders: number;
    totalSpent: number;
    lastOrderDate: string;
}

export default function AdminCustomers() {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => {
        fetchCustomers();
    }, []);

    const fetchCustomers = async () => {
        try {
            const res = await fetch('/api/orders');
            const orders: Order[] = await res.json();

            const customerMap = new Map<string, Customer>();

            orders.forEach(order => {
                const existing = customerMap.get(order.phone);

                if (existing) {
                    existing.totalOrders += 1;
                    existing.totalSpent += Number(order.price_snapshot);
                    if (new Date(order.created_at) > new Date(existing.lastOrderDate)) {
                        existing.lastOrderDate = order.created_at;
                        existing.address = order.address; // Update to latest address
                        existing.city = order.city;
                    }
                } else {
                    customerMap.set(order.phone, {
                        name: order.customer_name,
                        phone: order.phone,
                        city: order.city,
                        address: order.address,
                        totalOrders: 1,
                        totalSpent: Number(order.price_snapshot),
                        lastOrderDate: order.created_at
                    });
                }
            });

            setCustomers(Array.from(customerMap.values()));
        } catch (error) {
            console.error('Error fetching customers:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredCustomers = customers.filter(c =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.phone.includes(search)
    );

    if (loading) {
        return (
            <AdminLayout>
                <div className="flex items-center justify-center h-96">
                    <div className="text-center">
                        <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-600"></div>
                        <p className="mt-4 text-gray-600 font-medium">Loading customers...</p>
                    </div>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="space-y-8">
                <div>
                    <h1 className="text-4xl font-bold text-gray-800 mb-2">Customers</h1>
                    <p className="text-gray-600">Overview of your customer base</p>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-6">
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search by name or phone..."
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-purple-500 outline-none"
                    />
                    <div className="mt-4 text-sm text-gray-500">
                        Total Customers: <span className="font-bold text-gray-900">{filteredCustomers.length}</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCustomers.map((customer, idx) => (
                        <div key={idx} className="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-xl transition-shadow">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center text-purple-700 font-bold text-xl">
                                    {customer.name.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg text-gray-800">{customer.name}</h3>
                                    <p className="text-gray-500 text-sm">{customer.phone}</p>
                                </div>
                            </div>

                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Total Orders</span>
                                    <span className="font-bold text-gray-900">{customer.totalOrders}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Total Spent</span>
                                    <span className="font-bold text-green-600">৳{customer.totalSpent.toFixed(2)}</span>
                                </div>
                                <div className="pt-3 border-t border-gray-100">
                                    <p className="text-gray-500 mb-1">Latest Address</p>
                                    <p className="text-gray-800">{customer.address}, {customer.city}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {filteredCustomers.length === 0 && (
                    <div className="text-center py-20 bg-white rounded-xl shadow-sm">
                        <span className="text-6xl">👥</span>
                        <h3 className="text-2xl font-bold text-gray-600 mt-4">No Customers Found</h3>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
