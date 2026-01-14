'use client';

import { useEffect, useState } from 'react';
import AdminLayout from '@/components/AdminLayout';

interface ProductImage {
    url: string;
    name: string;
}

interface Product {
    id: number;
    name: string;
    original_price: number;
    offer_price: number;
    type: 'single' | 'combo';
    bottle_quantity: number;
    description: string;
    images: ProductImage[] | string[];
    is_active: boolean;
}

// Helper to normalize images from DB (string[] or Object[])
const normalizeImages = (images: (ProductImage | string)[] | undefined): ProductImage[] => {
    if (!images) return [];
    return images.map(img =>
        typeof img === 'string' ? { url: img, name: '' } : img
    );
};

export default function AdminProducts() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [showModal, setShowModal] = useState(false);

    // State for the 5 image slots (URL + Name)
    const [imageInputs, setImageInputs] = useState<ProductImage[]>(
        Array(5).fill({ url: '', name: '' })
    );

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const res = await fetch('/api/products');
            const data = await res.json();
            setProducts(data);
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (product: Product) => {
        setEditingProduct(product);
        // Normalize existing images and pad to 5 slots
        const normalized = normalizeImages(product.images);
        const padded = [...normalized];
        while (padded.length < 5) padded.push({ url: '', name: '' });
        setImageInputs(padded.slice(0, 5));
        setShowModal(true);
    };

    const handleImageChange = (index: number, field: 'url' | 'name', value: string) => {
        const newInputs = [...imageInputs];
        newInputs[index] = { ...newInputs[index], [field]: value };
        setImageInputs(newInputs);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingProduct) return;

        // If combo, we don't save images (backend/frontend handles sync).
        // BUT strict rule: "Admin CANNOT upload images for combo product".
        // Use empty array for Combo to be safe or keep existing?
        // Actually, if we clear it, the frontend sync logic still works (it ignores combo.images from DB and uses A+B).
        // Let's send [] for combo to clean DB.

        let validImages: ProductImage[] = [];

        if (editingProduct.type === 'combo') {
            validImages = [];
        } else {
            // Filter out entries where URL is empty
            validImages = imageInputs.filter(img => img.url.trim() !== '');
        }

        if (validImages.length > 5) {
            alert('Maximum 5 images allowed');
            return;
        }

        try {
            const res = await fetch('/api/products', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...editingProduct,
                    images: validImages,
                }),
            });

            if (res.ok) {
                await fetchProducts();
                setShowModal(false);
                setEditingProduct(null);
                setImageInputs(Array(5).fill({ url: '', name: '' }));
                alert('✅ Product updated successfully!');
            } else {
                alert('❌ Failed to update product');
            }
        } catch (error) {
            console.error('Error updating product:', error);
            alert('❌ Failed to update product');
        }
    };

    const handleToggleActive = async (product: Product) => {
        try {
            const res = await fetch('/api/products', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...product, is_active: !product.is_active }),
            });

            if (res.ok) {
                await fetchProducts();
            }
        } catch (error) {
            console.error('Error toggling product status:', error);
        }
    };

    if (loading) {
        return (
            <AdminLayout>
                <div className="flex items-center justify-center h-96">
                    <div className="text-center">
                        <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-600"></div>
                        <p className="mt-4 text-gray-600 font-medium">Loading products...</p>
                    </div>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="space-y-8">
                <div>
                    <h1 className="text-4xl font-bold text-gray-800 mb-2">Product Management</h1>
                    <p className="text-gray-600">Manage your product catalog</p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {products.map((product) => {
                        const displayImages = normalizeImages(product.images);

                        return (
                            <div
                                key={product.id}
                                className={`bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all ${!product.is_active ? 'opacity-60' : ''
                                    }`}
                            >
                                {/* Product Visual Header */}
                                <div className={`p-6 ${product.type === 'combo'
                                    ? 'bg-gradient-to-r from-purple-600 to-blue-600'
                                    : 'bg-gradient-to-br from-blue-100 to-purple-100'
                                    }`}>
                                    {product.type === 'combo' ? (
                                        <div className="flex justify-center items-center gap-4">
                                            <div className="text-center text-white">
                                                <span className="font-bold">Combo Sync</span>
                                                <p className="text-xs opacity-75">Auto-synced from A+B</p>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex justify-center items-center gap-1">
                                            <div className="text-4xl">🍾</div>
                                        </div>
                                    )}
                                </div>

                                {/* Product Images Preview in List */}
                                {/* Only show for single products as combo is dynamic */}
                                {product.type !== 'combo' && displayImages.length > 0 && (
                                    <div className="grid grid-cols-5 gap-1 p-2 bg-gray-50">
                                        {displayImages.slice(0, 5).map((img, idx) => (
                                            <div key={idx} className="aspect-square bg-gray-200 rounded overflow-hidden relative group">
                                                <img src={img.url} alt={`${product.name} ${idx + 1}`} className="w-full h-full object-cover" />
                                                {/* Tooltip for name */}
                                                {img.name && (
                                                    <div className="absolute bottom-0 inset-x-0 bg-black/60 text-white text-[9px] truncate px-1">
                                                        {img.name}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}

                                <div className="p-6">
                                    <div className="flex items-center justify-between mb-3">
                                        <h3 className="text-xl font-bold text-gray-800">{product.name}</h3>
                                        {product.type === 'combo' && (
                                            <span className="px-2 py-1 bg-yellow-400 text-gray-900 text-xs font-bold rounded">
                                                COMBO
                                            </span>
                                        )}
                                    </div>

                                    <div className="space-y-2 mb-4">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">Price:</span>
                                            <span className="font-bold text-gray-900">৳{product.offer_price.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">Images:</span>
                                            <span className="font-semibold text-gray-800">
                                                {product.type === 'combo' ? 'Auto-Sync' : `${displayImages.length} / 5`}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex gap-2 mb-4">
                                        <button
                                            onClick={() => handleToggleActive(product)}
                                            className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-all ${product.is_active
                                                ? 'bg-green-500 text-white hover:bg-green-600'
                                                : 'bg-gray-400 text-white hover:bg-gray-500'
                                                }`}
                                        >
                                            {product.is_active ? '✓ Active' : '✗ Disabled'}
                                        </button>
                                    </div>

                                    <button
                                        onClick={() => handleEdit(product)}
                                        className="w-full px-4 py-3 gradient-primary text-white rounded-lg hover:shadow-lg transition-all font-semibold"
                                    >
                                        Edit Product
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Edit Modal */}
            {showModal && editingProduct && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full my-8">
                        <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-6 text-white">
                            <h2 className="text-3xl font-bold">Edit {editingProduct.name}</h2>
                        </div>
                        <form onSubmit={handleSave} className="p-8 space-y-6 max-h-[80vh] overflow-y-auto">

                            {/* Basic Info */}
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-gray-700 font-semibold mb-2">Product Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={editingProduct.name}
                                        onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700 font-semibold mb-2">Description</label>
                                    <textarea
                                        value={editingProduct.description || ''}
                                        onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none"
                                        rows={2}
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700 font-semibold mb-2">Bottle Quantity</label>
                                    <input
                                        type="number"
                                        required
                                        min="1"
                                        value={editingProduct.bottle_quantity}
                                        onChange={(e) => setEditingProduct({ ...editingProduct, bottle_quantity: parseInt(e.target.value) })}
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none"
                                    />
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-gray-700 font-semibold mb-2">Original Price (৳)</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        required
                                        value={editingProduct.original_price}
                                        onChange={(e) => setEditingProduct({ ...editingProduct, original_price: parseFloat(e.target.value) })}
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700 font-semibold mb-2">Offer Price (৳)</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        required
                                        value={editingProduct.offer_price}
                                        onChange={(e) => setEditingProduct({ ...editingProduct, offer_price: parseFloat(e.target.value) })}
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none"
                                    />
                                </div>
                            </div>

                            {/* IMAGE SECTION */}
                            <div className="border-t pt-6">
                                <h3 className="text-xl font-bold text-gray-800 mb-4">Product Images & Names</h3>

                                {editingProduct.type === 'combo' ? (
                                    <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded text-blue-700">
                                        <div className="font-bold flex items-center gap-2">
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                            Combo Product Mode
                                        </div>
                                        <p className="mt-1">
                                            Images for the Combo Product are <strong>automatically synced</strong> from "Product A" and "Product B".
                                            You cannot manually upload images here. Please edit Product A or B to update their images.
                                        </p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {imageInputs.map((img, index) => (
                                            <div key={index} className="flex gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100 items-start">
                                                <div className="w-8 pt-3 font-bold text-gray-400">#{index + 1}</div>

                                                <div className="flex-1 space-y-3">
                                                    <div>
                                                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Image URL</label>
                                                        <input
                                                            type="url"
                                                            value={img.url}
                                                            onChange={(e) => handleImageChange(index, 'url', e.target.value)}
                                                            className="w-full px-3 py-2 border border-gray-300 rounded focus:border-purple-500 focus:outline-none"
                                                            placeholder="https://example.com/image.jpg"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Image Name (displayed under image)</label>
                                                        <input
                                                            type="text"
                                                            value={img.name}
                                                            onChange={(e) => handleImageChange(index, 'name', e.target.value)}
                                                            className="w-full px-3 py-2 border border-gray-300 rounded focus:border-purple-500 focus:outline-none"
                                                            placeholder="e.g. Front View"
                                                        />
                                                    </div>
                                                </div>

                                                {/* Preview */}
                                                <div className="w-24 h-24 bg-white border border-gray-200 rounded-lg flex items-center justify-center overflow-hidden shrink-0">
                                                    {img.url ? (
                                                        <img src={img.url} className="w-full h-full object-cover" alt="Preview" />
                                                    ) : (
                                                        <span className="text-gray-300 text-xs">No Image</span>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                        <p className="text-sm text-gray-500">
                                            Fill in the URL and Name for up to 5 images. Empty slots will be ignored.
                                        </p>
                                    </div>
                                )}
                            </div>

                            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg mt-4">
                                <input
                                    type="checkbox"
                                    id="isActive"
                                    checked={editingProduct.is_active}
                                    onChange={(e) => setEditingProduct({ ...editingProduct, is_active: e.target.checked })}
                                    className="w-5 h-5 text-purple-600"
                                />
                                <label htmlFor="isActive" className="text-gray-700 font-semibold">
                                    Product is active (visible to customers)
                                </label>
                            </div>

                            <div className="flex gap-4 pt-4 border-t-2 border-gray-200">
                                <button
                                    type="submit"
                                    className="flex-1 px-6 py-4 gradient-primary text-white rounded-xl font-bold text-lg hover:shadow-2xl transition-all"
                                >
                                    Save Changes
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowModal(false);
                                        setEditingProduct(null);
                                    }}
                                    className="flex-1 px-6 py-4 bg-gray-200 text-gray-700 rounded-xl font-bold text-lg hover:bg-gray-300 transition-all"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
