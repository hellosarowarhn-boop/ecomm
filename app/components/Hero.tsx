'use client';

import { useEffect, useState } from 'react';
import { Settings } from '../types';

interface HeroProps {
    settings: Settings | null;
    onShopClick: () => void;
}

export default function Hero({ settings, onShopClick }: HeroProps) {
    const [activeHeroIndex, setActiveHeroIndex] = useState(0);
    const heroImages = (settings?.hero_images && Array.isArray(settings.hero_images)) ? settings.hero_images.filter(url => url) : [];

    useEffect(() => {
        if (heroImages.length <= 1) return;
        const interval = setInterval(() => {
            setActiveHeroIndex(prev => (prev + 1) % heroImages.length);
        }, 4000);
        return () => clearInterval(interval);
    }, [heroImages.length]);

    return (
        <section className="relative pt-32 pb-20 overflow-hidden bg-purple-50">
            <div className="container mx-auto px-4 relative z-10">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div className="text-center md:text-left">
                        <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight text-gray-900 leading-tight">
                            {settings?.hero_title}
                        </h1>
                        <p className="text-lg text-gray-600 mb-8 max-w-lg mx-auto md:mx-0">
                            {settings?.hero_description}
                        </p>
                        <button
                            onClick={onShopClick}
                            className="px-10 py-5 bg-gray-900 text-white rounded-full font-bold text-lg hover:shadow-2xl transition-all shadow-xl shadow-purple-900/20"
                        >
                            {settings?.hero_button_text}
                        </button>
                    </div>

                    <div className="relative">
                        <div className="aspect-[4/3] bg-white rounded-3xl overflow-hidden shadow-2xl mb-6 relative border-4 border-white">
                            {heroImages.length > 0 ? (
                                <div className="w-full h-full relative">
                                    {heroImages.map((img, idx) => (
                                        <img
                                            key={idx}
                                            src={img}
                                            alt="Hero"
                                            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-in-out ${idx === activeHeroIndex ? 'opacity-100' : 'opacity-0'}`}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400 font-bold text-xl">
                                    {settings?.site_name || 'Loading...'}
                                </div>
                            )}
                        </div>

                        {heroImages.length > 1 && (
                            <div className="flex justify-center md:justify-start gap-3">
                                {heroImages.map((img, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setActiveHeroIndex(idx)}
                                        className={`w-32 h-20 rounded-xl overflow-hidden border-2 transition-all duration-300 ${idx === activeHeroIndex ? 'border-gray-900 scale-105 shadow-md' : 'border-transparent opacity-60 hover:opacity-100'}`}
                                    >
                                        <img src={img} className="w-full h-full object-cover" alt="Thumbnail" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
