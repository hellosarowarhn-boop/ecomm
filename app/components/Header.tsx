'use client';

import Link from 'next/link';
import { Settings } from '../types';

interface HeaderProps {
    settings: Settings | null;
}

export default function Header({ settings }: HeaderProps) {
    return (
        <header className="fixed top-0 inset-x-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 transition-all duration-300">
            <nav className="container mx-auto px-4 h-20 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                    {settings?.site_logo ? (
                        <img src={settings.site_logo} alt="Logo" className="h-10 w-auto object-contain" />
                    ) : (
                        <div className="w-10 h-10 gradient-primary rounded-xl shadow-lg flex items-center justify-center">
                            <span className="text-white font-bold text-xl">E</span>
                        </div>
                    )}
                </div>
                <Link href="/track-order" className="px-6 py-2.5 bg-gray-900 text-white rounded-full hover:bg-black font-semibold text-sm shadow-lg">
                    Track Order
                </Link>
            </nav>
        </header>
    );
}
