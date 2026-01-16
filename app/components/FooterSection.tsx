'use client';

import Link from 'next/link';
import { Settings } from '../types';

interface FooterProps {
    settings: Settings | null;
}

export default function FooterSection({ settings }: FooterProps) {
    return (
        <footer className="bg-gray-900 text-white py-12 border-t border-gray-800">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-0">
                    {/* Logo Section */}
                    <div className="w-full md:w-auto flex flex-col items-center md:items-start gap-4 pb-8 md:pb-0 border-b border-gray-800 md:border-none">
                        {(settings?.footer_logo || settings?.site_logo) ? (
                            <div className="p-3 bg-gray-800 rounded-xl">
                                <img src={settings?.footer_logo || settings?.site_logo} alt="Logo" className="h-16 w-auto brightness-0 invert object-contain" />
                            </div>
                        ) : (
                            <div className="w-12 h-12 bg-gray-800 rounded-xl flex items-center justify-center text-white font-bold text-xl">E</div>
                        )}
                        <span className="text-xl font-bold tracking-wide">{settings?.site_name}</span>
                    </div>

                    {/* Copyright Section (Desktop: Center, Mobile: Bottom) */}
                    <div className="text-gray-500 text-sm text-center order-3 md:order-2 mt-8 md:mt-0 pt-8 md:pt-0 border-t border-gray-800 md:border-none w-full md:w-auto">
                        <p>© {new Date().getFullYear()} {settings?.site_name}.</p>
                        <p>All rights reserved.</p>
                        <p className="text-xs mt-1">Version 2.0</p>
                    </div>

                    {/* Links Section */}
                    <div className="flex flex-col gap-4 text-sm font-medium text-gray-400 text-center w-full md:w-auto order-2 md:order-3">
                        <Link href="#" className="hover:text-white transition-colors py-1">Terms & Condition</Link>
                        <Link href="#" className="hover:text-white transition-colors py-1">Privacy Policy</Link>
                        <Link href="#" className="hover:text-white transition-colors py-1">Returns Policy</Link>
                        <Link href="/contact" className="hover:text-white transition-colors py-1">Contact Us</Link>
                        <Link href="/admin/login" className="hover:text-white transition-colors py-1">Admin</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
