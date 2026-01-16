'use client';

import Link from 'next/link';
import { Settings } from '../types';

interface HeaderProps {
    settings: Settings | null;
}

export default function Header({ settings }: HeaderProps) {
    return (
        <header className="fixed top-0 inset-x-0 z-50 bg-[#FAFFFF]/95 backdrop-blur-md border-b border-indigo-100/50 shadow-sm transition-all duration-300">
            <nav className="container mx-auto px-4 md:px-8 h-24 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    {settings?.site_logo ? (
                        <img src={settings.site_logo} alt="Logo" className="h-16 w-auto object-contain hover:scale-105 transition-transform duration-300" />
                    ) : (
                        <div className="w-14 h-14 gradient-primary rounded-2xl shadow-lg flex items-center justify-center transform hover:rotate-3 transition-transform duration-300">
                            <span className="text-white font-bold text-2xl">E</span>
                        </div>
                    )}
                    {settings?.site_name && (
                        <h1 className="sr-only">
                            {settings.site_name}
                        </h1>
                    )}
                </div>
                <Link href="/track-order" className="px-6 py-3 bg-indigo-600 text-white border border-indigo-600 rounded-full hover:bg-indigo-700 hover:shadow-lg hover:-translate-y-0.5 active:scale-95 transition-all duration-300 font-bold text-sm md:text-base shadow-md">
                    Track Order
                </Link>
            </nav>
        </header>
    );
}
