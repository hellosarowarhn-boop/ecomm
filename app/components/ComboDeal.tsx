'use client';

import { Product, Settings } from '../types';
import { getImages } from '../utils';

interface ComboDealProps {
    comboProduct?: Product;
    productA?: Product;
    productB?: Product;
    settings: Settings | null;
    onSelect: (product: Product) => void;
}

export default function ComboDeal({ comboProduct, productA, productB, settings, onSelect }: ComboDealProps) {
    if (!comboProduct || !productA || !productB) return null;

    return (
        <section className="bg-blue-50 py-20">
            <div className="container mx-auto px-4">
                <div className="bg-gradient-to-br from-purple-700 to-blue-800 rounded-3xl p-8 md:p-12 text-white shadow-2xl relative overflow-hidden">
                    <div className="relative z-10 text-center mb-10">
                        <span className="bg-yellow-400 text-gray-900 font-bold px-4 py-1 rounded-full text-sm inline-block mb-4">BEST DEAL</span>
                        <h2 className="text-4xl md:text-5xl font-black mb-4">{comboProduct.name}</h2>
                        <p className="text-purple-100 text-lg">Includes all items from both products.</p>
                    </div>

                    <div className="flex flex-col md:flex-row items-start justify-center gap-8 md:gap-12 mb-12">
                        <div className="flex-1 text-center bg-white/10 p-6 rounded-2xl backdrop-blur-sm w-full md:max-w-sm border border-white/10 hover:bg-white/20 transition-all">
                            <h3 className="text-2xl font-bold mb-6 text-white h-16 flex items-center justify-center">{productA.name}</h3>

                            <div className="flex flex-wrap justify-center gap-3 mb-6">
                                {getImages(productA).slice(0, 5).map((img, idx) => (
                                    <div key={idx} className="w-20 h-20 bg-white rounded-lg overflow-hidden shadow-md">
                                        <img src={img.url || ''} className="w-full h-full object-cover" alt={img.name || productA.name} />
                                    </div>
                                ))}
                            </div>

                            {productA.description && (
                                <p className="text-sm text-purple-100 opacity-90 leading-relaxed min-h-[3rem]">{productA.description}</p>
                            )}
                        </div>

                        <div className="self-center text-6xl font-black text-yellow-400 animate-pulse drop-shadow-md select-none transform rotate-45 md:rotate-0">+</div>

                        <div className="flex-1 text-center bg-white/10 p-6 rounded-2xl backdrop-blur-sm w-full md:max-w-sm border border-white/10 hover:bg-white/20 transition-all">
                            <h3 className="text-2xl font-bold mb-6 text-white h-16 flex items-center justify-center">{productB.name}</h3>

                            <div className="flex flex-wrap justify-center gap-3 mb-6">
                                {getImages(productB).slice(0, 5).map((img, idx) => (
                                    <div key={idx} className="w-20 h-20 bg-white rounded-lg overflow-hidden shadow-md">
                                        <img src={img.url || ''} className="w-full h-full object-cover" alt={img.name || productB.name} />
                                    </div>
                                ))}
                            </div>

                            {productB.description && (
                                <p className="text-sm text-purple-100 opacity-90 leading-relaxed min-h-[3rem]">{productB.description}</p>
                            )}
                        </div>
                    </div>

                    <div className="text-center mt-8">
                        <button
                            onClick={() => onSelect(comboProduct)}
                            className="w-full md:w-auto px-12 py-5 bg-white text-gray-900 rounded-xl font-bold text-xl hover:bg-gray-50 transition-all shadow-xl"
                        >
                            {settings?.combo_button_text || 'Get This Combo Deal'} - ৳{comboProduct.offer_price.toFixed(2)}
                        </button>
                        <p className="mt-3 text-purple-200 text-sm">You Save ৳{(comboProduct.original_price - comboProduct.offer_price).toFixed(2)}</p>
                    </div>
                </div>
            </div>
        </section>
    );
}
