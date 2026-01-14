'use client';

import { useState, useEffect } from 'react';
import { Product, Settings } from '../types';
import Header from './Header';
import Hero from './Hero';
import ProductGrid from './ProductGrid';
import ComboDeal from './ComboDeal';
import OrderForm from './OrderForm';
import FAQ from './FAQ';
import FooterSection from './FooterSection';

interface HomeClientProps {
    products: Product[];
    settings: Settings | null;
}

export default function HomeClient({ products, settings }: HomeClientProps) {
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

    const productA = products.find(p => p.type === 'single' && p.name.includes('A')) || products.find(p => p.type === 'single');
    const productB = products.find(p => p.type === 'single' && p.name.includes('B')) || products.filter(p => p.type === 'single')[1];
    const comboProduct = products.find(p => p.type === 'combo');

    // Set default selected product to Combo
    useEffect(() => {
        if (comboProduct) {
            setSelectedProduct(comboProduct);
        } else if (products.length > 0) {
            setSelectedProduct(products[0]);
        }
    }, [products, comboProduct]);

    const handleProductSelect = (product: Product) => {
        setSelectedProduct(product);
        document.getElementById('order-form')?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div className="min-h-screen bg-white">
            <Header settings={settings} />

            <Hero
                settings={settings}
                onShopClick={() => document.getElementById('order-form')?.scrollIntoView({ behavior: 'smooth' })}
            />

            <ProductGrid
                productA={productA}
                productB={productB}
                settings={settings}
                onSelect={handleProductSelect}
            />

            <ComboDeal
                comboProduct={comboProduct}
                productA={productA}
                productB={productB}
                settings={settings}
                onSelect={handleProductSelect}
            />

            <OrderForm
                products={products}
                selectedProduct={selectedProduct}
                setSelectedProduct={setSelectedProduct}
            />

            <FAQ settings={settings} />

            <FooterSection settings={settings} />
        </div>
    );
}
