'use client';

import { useState } from 'react';
import { Product, OrderFormData } from '../types';
import { getImages } from '../utils';

interface OrderFormProps {
    products: Product[];
    selectedProduct: Product | null;
    setSelectedProduct: (product: Product) => void;
}

export default function OrderForm({ products, selectedProduct, setSelectedProduct }: OrderFormProps) {
    const [formData, setFormData] = useState<OrderFormData>({
        customer_name: '',
        phone: '',
        city: '',
        address: '',
    });
    const [submitting, setSubmitting] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [orderDetails, setOrderDetails] = useState<{ id: number; name: string; price: number; phone: string } | null>(null);
    const [agreedToTerms, setAgreedToTerms] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedProduct) return;
        setShowConfirmModal(true);
    };

    const confirmOrder = async () => {
        if (!selectedProduct || !agreedToTerms) return;

        setSubmitting(true);

        try {
            const res = await fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    product_id: selectedProduct.id,
                    product_name_snapshot: selectedProduct.name,
                    price_snapshot: selectedProduct.offer_price,
                }),
            });

            if (res.ok) {
                const order = await res.json();
                setShowConfirmModal(false);
                setAgreedToTerms(false);

                // Show success modal
                setOrderDetails({
                    id: order.id,
                    name: selectedProduct.name,
                    price: selectedProduct.offer_price,
                    phone: formData.phone
                });
                setShowSuccessModal(true);

                setFormData({ customer_name: '', phone: '', city: '', address: '' });

                // Reset to combo if available
                const combo = products.find(p => p.type === 'combo');
                if (combo) setSelectedProduct(combo);
            } else {
                const data = await res.json();
                alert('❌ ' + (data.error || 'Failed to place order'));
            }
        } catch (err) {
            alert('❌ Failed to place order. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <section id="order-form" className="bg-white py-20">
            <div className="container mx-auto px-4">
                <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl border-2 border-gray-100 overflow-hidden">
                    <div className="bg-gray-900 p-6 text-white text-center">
                        <h2 className="text-2xl md:text-3xl font-black mb-2 uppercase tracking-wide">অর্ডার করুন</h2>
                        <p className="text-sm md:text-base font-medium opacity-90">অর্ডার করতে আপনার নাম, মোবাইল নাম্বার ও ঠিকানা লিখুন</p>
                    </div>
                    <div className="p-8">
                        {/* Selected Product Display / Dropdown */}
                        {selectedProduct && (
                            <div className="relative mb-8">
                                <label className="block font-bold text-gray-700 mb-2">Selected Product</label>
                                {!isDropdownOpen ? (
                                    <div
                                        onClick={() => setIsDropdownOpen(true)}
                                        className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border-2 border-gray-200 cursor-pointer hover:border-purple-600 transition-all relative"
                                    >
                                        <div className="w-20 h-20 bg-white rounded-lg border border-gray-200 flex items-center justify-center overflow-hidden" style={{ minWidth: '80px' }}>
                                            {getImages(selectedProduct)[0]?.url ? (
                                                <img src={getImages(selectedProduct)[0].url} className="w-full h-full object-cover" />
                                            ) : (
                                                <span className="text-2xl">📦</span>
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-bold text-gray-900">{selectedProduct.name}</h3>
                                            <p className="text-sm text-gray-500">{selectedProduct.bottle_quantity} items included</p>
                                        </div>
                                        <div className="text-right mr-8">
                                            <div className="text-2xl font-black text-gray-900">৳{selectedProduct.offer_price.toFixed(2)}</div>
                                            <div className="text-sm text-gray-400 line-through">৳{selectedProduct.original_price.toFixed(2)}</div>
                                        </div>
                                        <div className="absolute top-1/2 right-4 -translate-y-1/2 text-gray-400">
                                            ▼
                                        </div>
                                    </div>
                                ) : (
                                    <div className="bg-white rounded-xl border-2 border-purple-600 overflow-hidden shadow-xl animate-in fade-in zoom-in-95 duration-200">
                                        <div className="flex justify-between items-center p-4 bg-gray-50 border-b border-gray-100">
                                            <span className="font-bold text-gray-800">Select a Product</span>
                                            <button
                                                type="button"
                                                onClick={() => setIsDropdownOpen(false)}
                                                className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 hover:bg-red-100 hover:text-red-600 transition-all font-bold text-gray-500"
                                            >
                                                ✕
                                            </button>
                                        </div>
                                        <div className="max-h-96 overflow-y-auto p-2 space-y-2 bg-gray-50/50">
                                            {products.map(p => (
                                                <div
                                                    key={p.id}
                                                    onClick={() => { setSelectedProduct(p); setIsDropdownOpen(false); }}
                                                    className={`p-3 flex items-center gap-4 cursor-pointer rounded-xl border transition-all hover:shadow-md ${selectedProduct?.id === p.id
                                                        ? 'bg-purple-50 border-purple-200 shadow-sm ring-1 ring-purple-100'
                                                        : 'bg-white border-gray-100 hover:border-purple-200'
                                                        }`}
                                                >
                                                    <div className="w-16 h-16 bg-white rounded-lg border border-gray-200 flex items-center justify-center overflow-hidden shrink-0">
                                                        {getImages(p)[0]?.url ? (
                                                            <img src={getImages(p)[0].url} className="w-full h-full object-cover" />
                                                        ) : (
                                                            <span className="text-xl">📦</span>
                                                        )}
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="font-bold text-gray-900">{p.name}</div>
                                                        <div className="text-purple-600 font-bold">৳{p.offer_price.toFixed(2)}</div>
                                                        {p.type === 'combo' && <span className="text-xs text-yellow-600 font-bold">★ Best Value</span>}
                                                    </div>
                                                    {selectedProduct?.id === p.id && (
                                                        <span className="text-purple-600 font-bold">✓</span>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block font-bold text-gray-700 mb-1">Full Name</label>
                                <input required type="text" value={formData.customer_name} onChange={e => setFormData({ ...formData, customer_name: e.target.value })} className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-purple-600 outline-none" placeholder="Your Name" />
                            </div>
                            <div>
                                <label className="block font-bold text-gray-700 mb-1">Phone Number</label>
                                <input required type="tel" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-purple-600 outline-none" placeholder="0123456789" />
                            </div>
                            <div>
                                <label className="block font-bold text-gray-700 mb-1">City</label>
                                <input required type="text" value={formData.city} onChange={e => setFormData({ ...formData, city: e.target.value })} className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-purple-600 outline-none" placeholder="Your City" />
                            </div>
                            <div>
                                <label className="block font-bold text-gray-700 mb-1">Address</label>
                                <textarea required value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })} className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-purple-600 outline-none" rows={3} placeholder="Full Address" />
                            </div>
                            <button type="submit" className="w-full py-4 bg-gray-900 text-white rounded-xl font-bold text-xl hover:bg-black transition-all shadow-lg mt-6">
                                Place Order
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            {showConfirmModal && selectedProduct && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
                        <h3 className="text-2xl font-bold mb-4">Confirm Order</h3>
                        <p className="mb-6 text-gray-600">
                            You are about to order <strong>{selectedProduct.name}</strong> for <strong>৳{selectedProduct.offer_price.toFixed(2)}</strong> via Cash on Delivery.
                        </p>
                        <label className="flex items-start gap-3 mb-8 cursor-pointer bg-gray-50 p-4 rounded-xl">
                            <input type="checkbox" checked={agreedToTerms} onChange={e => setAgreedToTerms(e.target.checked)} className="mt-1 w-5 h-5 text-purple-600" />
                            <span className="text-sm font-medium">I agree to the terms of service and confirm my order details are correct.</span>
                        </label>
                        <div className="flex gap-4">
                            <button onClick={() => setShowConfirmModal(false)} className="flex-1 py-3 bg-gray-100 font-bold rounded-xl text-gray-700">Cancel</button>
                            <button onClick={confirmOrder} disabled={!agreedToTerms || submitting} className="flex-1 py-3 bg-purple-600 text-white font-bold rounded-xl hover:bg-purple-700 disabled:opacity-50">
                                {submitting ? 'Processing...' : 'Confirm'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Success Modal */}
            {showSuccessModal && orderDetails && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl animate-in">
                        <div className="text-center mb-6">
                            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-5xl">✅</span>
                            </div>
                            <h3 className="text-3xl font-bold text-gray-900 mb-2">Order Placed Successfully!</h3>
                            <p className="text-gray-600">Order ID: <span className="font-bold text-purple-600">#{orderDetails.id}</span></p>
                        </div>

                        <div className="bg-gray-50 rounded-xl p-6 mb-6 space-y-3">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Product:</span>
                                <span className="font-bold text-gray-900">{orderDetails.name}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Amount:</span>
                                <span className="font-bold text-green-600">৳{orderDetails.price.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Phone:</span>
                                <span className="font-bold text-gray-900">{orderDetails.phone}</span>
                            </div>
                        </div>

                        <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6 mb-6">
                            <p className="text-gray-800 leading-relaxed">
                                <strong className="text-blue-900">Wait for our confirmation call!</strong><br />
                                We will call you soon to confirm your order. If you need any help, please contact us.
                            </p>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowSuccessModal(false)}
                                className="flex-1 py-4 bg-gray-900 text-white rounded-xl font-bold text-lg hover:bg-black transition-all"
                            >
                                Continue Shopping
                            </button>
                            <a
                                href="/contact"
                                className="flex-1 py-4 bg-purple-600 text-white rounded-xl font-bold text-lg hover:bg-purple-700 transition-all text-center"
                            >
                                Contact Us
                            </a>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}
