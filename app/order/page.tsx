'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';

interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    image: string;
    stock: number;
}

function OrderForm() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const productId = searchParams.get('productId');

    const [product, setProduct] = useState<Product | null>(null);
    const [quantity, setQuantity] = useState(1);
    const [formData, setFormData] = useState({
        customerName: '',
        customerPhone: '',
        customerAddress: '',
    });
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchProduct = async () => {
            if (!productId) {
                setError('No product selected');
                setLoading(false);
                return;
            }

            try {
                const res = await fetch('/api/products');
                const products = await res.json();
                const selectedProduct = products.find((p: Product) => p.id === parseInt(productId));

                if (selectedProduct) {
                    setProduct(selectedProduct);
                } else {
                    setError('Product not found');
                }
            } catch (err) {
                setError('Failed to load product');
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [productId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setError('');

        if (!product) {
            setError('No product selected');
            setSubmitting(false);
            return;
        }

        if (quantity > product.stock) {
            setError(`Only ${product.stock} items available in stock`);
            setSubmitting(false);
            return;
        }

        try {
            const res = await fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    productId: product.id,
                    productName: product.name,
                    quantity,
                    totalPrice: product.price * quantity,
                }),
            });

            if (res.ok) {
                const order = await res.json();
                alert(`Order placed successfully! Order ID: ${order.id}\n\nYou can track your order using your phone number: ${formData.customerPhone}`);
                router.push('/track-order');
            } else {
                const data = await res.json();
                setError(data.error || 'Failed to place order');
            }
        } catch (err) {
            setError('Failed to place order. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-blue-50">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-600"></div>
                    <p className="mt-4 text-gray-600 font-medium">Loading...</p>
                </div>
            </div>
        );
    }

    if (error && !product) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-blue-50">
                <div className="text-center">
                    <div className="text-6xl mb-4">😕</div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">{error}</h2>
                    <Link
                        href="/"
                        className="inline-block px-6 py-3 gradient-primary text-white rounded-lg hover:shadow-lg transition-all"
                    >
                        Back to Home
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 py-12">
            <div className="container mx-auto px-4">
                <div className="max-w-4xl mx-auto">
                    <Link
                        href="/"
                        className="inline-flex items-center text-purple-600 hover:text-purple-700 mb-8 font-medium"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Back to Home
                    </Link>

                    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                        <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-8 text-white">
                            <h1 className="text-4xl font-bold mb-2">Place Your Order</h1>
                            <p className="text-purple-100">Fill in your details for Cash on Delivery</p>
                        </div>

                        <div className="p-8">
                            {product && (
                                <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-6 mb-8">
                                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Order Summary</h2>
                                    <div className="flex items-center justify-between mb-4">
                                        <div>
                                            <h3 className="text-xl font-semibold text-gray-800">{product.name}</h3>
                                            <p className="text-gray-600">{product.description}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-3xl font-bold gradient-primary bg-clip-text text-transparent">
                                                ${product.price.toFixed(2)}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4 mb-4">
                                        <label className="font-semibold text-gray-700">Quantity:</label>
                                        <div className="flex items-center gap-2">
                                            <button
                                                type="button"
                                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                                className="w-10 h-10 rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition-colors font-bold"
                                            >
                                                -
                                            </button>
                                            <input
                                                type="number"
                                                min="1"
                                                max={product.stock}
                                                value={quantity}
                                                onChange={(e) => setQuantity(Math.max(1, Math.min(product.stock, parseInt(e.target.value) || 1)))}
                                                className="w-20 text-center border-2 border-purple-200 rounded-lg py-2 font-semibold"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                                                className="w-10 h-10 rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition-colors font-bold"
                                            >
                                                +
                                            </button>
                                        </div>
                                        <span className="text-gray-600">({product.stock} available)</span>
                                    </div>

                                    <div className="border-t-2 border-purple-200 pt-4">
                                        <div className="flex justify-between items-center">
                                            <span className="text-xl font-semibold text-gray-800">Total:</span>
                                            <span className="text-4xl font-bold gradient-primary bg-clip-text text-transparent">
                                                ${(product.price * quantity).toFixed(2)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-gray-700 font-semibold mb-2">Full Name *</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.customerName}
                                        onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none transition-colors"
                                        placeholder="Enter your full name"
                                    />
                                </div>

                                <div>
                                    <label className="block text-gray-700 font-semibold mb-2">Phone Number *</label>
                                    <input
                                        type="tel"
                                        required
                                        value={formData.customerPhone}
                                        onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none transition-colors"
                                        placeholder="Enter your phone number"
                                    />
                                    <p className="text-sm text-gray-500 mt-1">You'll use this to track your order</p>
                                </div>

                                <div>
                                    <label className="block text-gray-700 font-semibold mb-2">Delivery Address *</label>
                                    <textarea
                                        required
                                        rows={4}
                                        value={formData.customerAddress}
                                        onChange={(e) => setFormData({ ...formData, customerAddress: e.target.value })}
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none transition-colors resize-none"
                                        placeholder="Enter your complete delivery address"
                                    />
                                </div>

                                {error && (
                                    <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-lg">
                                        {error}
                                    </div>
                                )}

                                <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
                                    <div className="flex items-start gap-3">
                                        <div className="text-2xl">💰</div>
                                        <div>
                                            <h3 className="font-semibold text-gray-800 mb-1">Cash on Delivery</h3>
                                            <p className="text-gray-600 text-sm">Pay when you receive your order at your doorstep</p>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={submitting || !product}
                                    className="w-full py-4 gradient-primary text-white rounded-xl font-bold text-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                                >
                                    {submitting ? 'Placing Order...' : 'Place Order'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function OrderPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-blue-50">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-600"></div>
                    <p className="mt-4 text-gray-600 font-medium">Loading...</p>
                </div>
            </div>
        }>
            <OrderForm />
        </Suspense>
    );
}
