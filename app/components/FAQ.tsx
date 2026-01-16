'use client';

import { useState } from 'react';
import { Settings } from '../types';

interface FAQProps {
    settings: Settings | null;
}

export default function FAQ({ settings }: FAQProps) {
    const [openFaq, setOpenFaq] = useState<number | null>(null);
    const activeFaqs = settings?.faqs || [];

    if (activeFaqs.length === 0) return null;

    return (
        <section className="py-20 bg-sky-50">
            <div className="container mx-auto px-4 max-w-3xl">
                <h2 className="text-4xl font-black text-center mb-12 text-gray-900 tracking-tight">
                    জিজ্ঞাসিত <span className="text-purple-600">প্রশ্নাবলী</span>
                </h2>
                <div className="space-y-4">
                    {activeFaqs.map((faq, idx) => (
                        <div key={idx} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            <button
                                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                                className="w-full flex items-center justify-between p-6 text-left"
                            >
                                <span className="font-bold text-gray-900 text-lg">{faq.question}</span>
                                <span className={`transform transition-transform duration-300 ${openFaq === idx ? 'rotate-180' : ''}`}>
                                    🔽
                                </span>
                            </button>
                            <div
                                className={`px-6 text-gray-600 overflow-hidden transition-all duration-300 ${openFaq === idx ? 'max-h-48 pb-6 opacity-100' : 'max-h-0 opacity-0'
                                    }`}
                            >
                                <p className="leading-relaxed">{faq.answer}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
