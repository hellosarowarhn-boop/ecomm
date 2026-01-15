'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const [loading, setLoading] = useState(true);
    const [adminInfo, setAdminInfo] = useState<{ name: string; role: string } | null>(null);

    useEffect(() => {
        const verifyAuth = async () => {
            try {
                const res = await fetch('/api/admin/verify');
                if (!res.ok) {
                    router.push('/admin/login');
                    return;
                }
                const data = await res.json();
                if (data.user) {
                    setAdminInfo(data.user);
                }
            } catch (error) {
                router.push('/admin/login');
            } finally {
                setLoading(false);
            }
        };

        verifyAuth();
    }, [router]);

    const handleLogout = async () => {
        try {
            await fetch('/api/admin/logout', { method: 'POST' });
            router.push('/admin/login');
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-600"></div>
                    <p className="mt-4 text-gray-600 font-medium">Loading...</p>
                </div>
            </div>
        );
    }

    const navItems = [
        { href: '/admin/dashboard', label: 'Dashboard', icon: '📊', roles: ['super_admin', 'co_admin'] },
        { href: '/admin/orders', label: 'Orders', icon: '🛒', roles: ['super_admin', 'co_admin'] },
        { href: '/admin/customers', label: 'Customers', icon: '👥', roles: ['super_admin', 'co_admin'] },
        { href: '/admin/products', label: 'Products', icon: '📦', roles: ['super_admin'] },
        { href: '/admin/settings', label: 'Settings', icon: '⚙️', roles: ['super_admin'] },
        { href: '/admin/admins', label: 'Co-Admins', icon: '🔐', roles: ['super_admin'] },
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm sticky top-0 z-50">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 gradient-primary rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-xl">A</span>
                            </div>
                            <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                                Admin Panel
                            </span>
                        </div>
                        <div className="flex items-center space-x-4">
                            <Link
                                href="/"
                                className="text-gray-600 hover:text-purple-600 transition-colors font-medium"
                            >
                                View Site
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <div className="flex">
                {/* Sidebar */}
                <aside className="w-64 bg-white shadow-lg min-h-[calc(100vh-73px)] sticky top-[73px] flex flex-col">
                    <nav className="p-4 space-y-2 flex-grow">
                        {navItems.filter(item => adminInfo && item.roles.includes(adminInfo.role)).map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${isActive
                                        ? 'gradient-primary text-white shadow-lg'
                                        : 'text-gray-700 hover:bg-purple-50 hover:text-purple-600'
                                        }`}
                                >
                                    <span className="text-2xl">{item.icon}</span>
                                    <span className="font-semibold">{item.label}</span>
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Admin Info Footer */}
                    {adminInfo && (
                        <div className="p-4 border-t border-gray-100 bg-gray-50">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-bold">
                                    {adminInfo.name ? adminInfo.name.charAt(0).toUpperCase() : 'A'}
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-800 text-sm">{adminInfo.name}</p>
                                    <p className="text-xs text-gray-500 capitalize">{adminInfo.role.replace('_', ' ')}</p>
                                </div>
                            </div>
                        </div>
                    )}
                </aside>

                {/* Main Content */}
                <main className="flex-1 p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
