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
                <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="flex flex-col items-center md:items-start gap-2">
                        {(settings?.footer_logo || settings?.site_logo) ? (
                            <img src={settings?.footer_logo || settings?.site_logo} alt="Logo" className="h-10 w-auto brightness-0 invert object-contain" />
                        ) : (
                            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-gray-900 font-bold">E</div>
                        )}
                        <span className="text-lg font-bold tracking-wide">{settings?.site_name}</span>
                    </div>
                    <div className="text-gray-500 text-sm text-center">
                        <p>© {new Date().getFullYear()} {settings?.site_name}.</p>
                        <p>All rights reserved.</p>
                        <p className="text-xs mt-1">Version 2.0</p>
                    </div>
                    <div className="flex gap-6 text-sm font-medium text-gray-400">
                        <Link href="#" className="hover:text-white transition-colors">Terms</Link>
                        <Link href="#" className="hover:text-white transition-colors">Privacy</Link>
                        <Link href="#" className="hover:text-white transition-colors">Returns</Link>
                        <Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link>
                        <Link href="/admin/login" className="hover:text-white transition-colors">Admin</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
