'use client';

import { Product, Settings } from '../types';
import { getImages } from '../utils';

interface ProductGridProps {
    productA?: Product;
    productB?: Product;
    settings: Settings | null;
    onSelect: (product: Product) => void;
}

export default function ProductGrid({ productA, productB, settings, onSelect }: ProductGridProps) {
    const renderGallery = (product: Product | undefined) => {
        if (!product) return null;
        const images = getImages(product);

        return (
            <div className="flex flex-wrap gap-4 mt-6 justify-center">
                {images.map((img, idx) => (
                    <div key={idx} className="flex flex-col gap-2 w-24">
                        <div className="w-24 h-24 bg-gray-100 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                            {img.url ? (
                                <img src={img.url} alt={img.name || product.name} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-3xl">🍾</div>
                            )}
                        </div>
                        {img.name && (
                            <p className="text-center text-[10px] font-medium text-gray-700 bg-gray-50 rounded-lg py-1 px-1 border border-gray-100 truncate w-full">
                                {img.name}
                            </p>
                        )}
                    </div>
                ))}
            </div>
        );
    };

    return (
        <section className="bg-rose-50 py-20">
            <div className="container mx-auto px-4">
                <div className="grid lg:grid-cols-2 gap-8 items-start">
                    {[productA, productB].map(product => product && (
                        <div key={product.id} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 h-full">
                            <div className="text-center mb-6">
                                <h2 className="text-2xl font-bold text-gray-900 mb-1">{product.name}</h2>
                                <p className="text-gray-500 text-sm">Premium quality selection.</p>
                            </div>
                            {renderGallery(product)}
                            <div className="mt-6 text-center space-y-4">
                                <div className="text-2xl font-bold text-gray-900">৳{product.offer_price.toFixed(2)}</div>
                                <button
                                    onClick={() => onSelect(product)}
                                    className="w-full py-3 bg-white border-2 border-gray-900 text-gray-900 rounded-xl font-bold hover:bg-gray-900 hover:text-white transition-all shadow-sm"
                                >
                                    {settings?.product_button_text || 'Order Now'}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
