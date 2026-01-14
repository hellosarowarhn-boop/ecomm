'use client';

import { useEffect, useState } from 'react';
import AdminLayout from '@/components/AdminLayout';

interface Settings {
    id: number;
    site_name: string;
    site_logo: string;
    favicon: string;
    footer_logo: string;
    hero_title: string;
    hero_description: string;
    hero_button_text: string;
    product_button_text: string;
    combo_button_text: string;
    hero_images: string[];
    faqs: { question: string; answer: string }[];
    contact_phone: string;
    contact_email: string;
    contact_address: string;
}

export default function AdminSettings() {
    const [settings, setSettings] = useState<Settings>({
        id: 1,
        site_name: '',
        site_logo: '',
        favicon: '',
        footer_logo: '',
        hero_title: '',
        hero_description: '',
        hero_button_text: '',
        product_button_text: '',
        combo_button_text: '',
        hero_images: [],
        faqs: [],
        contact_phone: '',
        contact_email: '',
        contact_address: '',
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);

    // Collapsible State
    const [expanded, setExpanded] = useState({
        identity: true,
        hero: true,
        faqs: true,
        contact: true
    });

    const toggleSection = (section: keyof typeof expanded) => {
        setExpanded(prev => ({ ...prev, [section]: !prev[section] }));
    };

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const res = await fetch('/api/settings');
            const data = await res.json();

            // Normalize Arrays
            if (typeof data.hero_images === 'string') {
                try { data.hero_images = JSON.parse(data.hero_images); } catch (e) { data.hero_images = []; }
            }
            if (!Array.isArray(data.hero_images)) data.hero_images = [];

            if (data.hero_images.length < 3) {
                const padding = Array(3 - data.hero_images.length).fill('');
                data.hero_images = [...data.hero_images, ...padding];
            }

            if (typeof data.faqs === 'string') {
                try { data.faqs = JSON.parse(data.faqs); } catch (e) { data.faqs = []; }
            }
            if (!Array.isArray(data.faqs)) data.faqs = [];

            setSettings(data);
        } catch (error) {
            console.error('Error fetching settings:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleHeroImageChange = (index: number, value: string) => {
        const newImages = [...settings.hero_images];
        newImages[index] = value;
        setSettings({ ...settings, hero_images: newImages });
    };

    const handleFaqChange = (index: number, field: 'question' | 'answer', value: string) => {
        const newFaqs = [...(settings.faqs || [])];
        newFaqs[index] = { ...newFaqs[index], [field]: value };
        setSettings({ ...settings, faqs: newFaqs });
    };

    const addFaq = () => {
        setSettings({ ...settings, faqs: [...(settings.faqs || []), { question: '', answer: '' }] });
    };

    const removeFaq = (index: number) => {
        const newFaqs = [...(settings.faqs || [])];
        newFaqs.splice(index, 1);
        setSettings({ ...settings, faqs: newFaqs });
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: keyof Settings | { type: 'hero', index: number }) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        try {
            setUploading(true);
            const res = await fetch('/api/upload', { method: 'POST', body: formData });
            const data = await res.json();

            if (data.url) {
                if (typeof field === 'object' && field.type === 'hero') {
                    const newImages = [...settings.hero_images];
                    newImages[field.index] = data.url;
                    setSettings({ ...settings, hero_images: newImages });
                } else {
                    setSettings({ ...settings, [field as string]: data.url });
                }
            } else {
                alert('Upload failed: ' + (data.error || 'Unknown error'));
            }
        } catch (error) {
            console.error('Upload Error:', error);
            alert('Upload failed. Please try again.');
        } finally {
            setUploading(false);
            // Reset input
            e.target.value = '';
        }
    };

    const handleSave = async (e?: React.FormEvent | React.MouseEvent) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        setSaving(true);

        try {
            const res = await fetch('/api/settings', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(settings),
            });

            if (res.ok) {
                alert('✅ Settings updated successfully!\n\nChanges will be visible on the frontend immediately.');
                await fetchSettings();
            } else {
                alert('❌ Failed to update settings');
            }
        } catch (error) {
            console.error('Error updating settings:', error);
            alert('❌ Failed to update settings');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <AdminLayout>
                <div className="flex items-center justify-center h-96">
                    <div className="text-center">
                        <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-600"></div>
                        <p className="mt-4 text-gray-600 font-medium">Loading settings...</p>
                    </div>
                </div>
            </AdminLayout>
        );
    }

    // Helper for Image Input UI
    const ImageInput = ({ label, value, onChange, onUpload, placeholder, darkPreview = false }: any) => (
        <div>
            <label className="block text-gray-700 font-bold mb-2">{label}</label>
            <div className="flex gap-2 mb-2">
                <input
                    type="text"
                    value={value || ''}
                    onChange={onChange}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:border-purple-500 outline-none text-gray-600 text-sm"
                    placeholder={placeholder || "Image URL"}
                    readOnly // Prefer upload, but user can see URL
                />
                <label className={`cursor-pointer px-4 py-3 ${uploading ? 'bg-gray-300' : 'bg-purple-600 hover:bg-purple-700'} text-white font-bold rounded-lg transition-colors flex items-center justify-center min-w-[100px]`}>
                    <input type="file" accept="image/*" className="hidden" onChange={onUpload} disabled={uploading} />
                    {uploading ? '...' : 'Upload'}
                </label>
            </div>
            <div className={`h-24 rounded-lg border border-dashed ${darkPreview ? 'bg-gray-900 border-gray-700' : 'bg-gray-50 border-gray-300'} flex items-center justify-center overflow-hidden relative group`}>
                {value ? (
                    <img src={value} className={`h-full object-contain ${darkPreview ? 'brightness-0 invert' : ''}`} alt="Preview" />
                ) : (
                    <span className="text-xs text-gray-400">No Image Selected</span>
                )}
            </div>
        </div>
    );

    return (
        <AdminLayout>
            <div className="space-y-8 max-w-5xl mx-auto pb-20">
                <div>
                    <h1 className="text-4xl font-bold text-gray-800 mb-2">Site Settings</h1>
                    <p className="text-gray-600">Manage your website configuration</p>
                </div>

                <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>

                    {/* BRAND IDENTITY SECTION */}
                    <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
                        <div
                            className="bg-gradient-to-r from-purple-600 to-blue-600 p-6 text-white flex justify-between items-center cursor-pointer select-none"
                            onClick={() => toggleSection('identity')}
                        >
                            <div className="flex items-center gap-3">
                                <span className={`transform transition-transform duration-300 ${expanded.identity ? 'rotate-90' : ''}`}>▶</span>
                                <h2 className="text-2xl font-bold">Brand Identity</h2>
                            </div>
                            <div className="flex gap-3">
                                <button onClick={handleSave} disabled={saving} className="px-6 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg font-bold text-sm transition-all shadow-sm backdrop-blur-sm z-10">
                                    {saving ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        </div>

                        <div className={`transition-all duration-300 ease-in-out overflow-hidden ${expanded.identity ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                            <div className="p-8 grid md:grid-cols-2 gap-8 border-t border-gray-100">
                                {/* Site Name */}
                                <div className="col-span-2">
                                    <label className="block text-gray-700 font-bold mb-2">Site Title</label>
                                    <input
                                        type="text"
                                        value={settings.site_name}
                                        onChange={(e) => setSettings({ ...settings, site_name: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
                                        placeholder="My Store"
                                    />
                                </div>

                                {/* Site Logo */}
                                <ImageInput
                                    label="Header Logo"
                                    value={settings.site_logo}
                                    onChange={(e: any) => setSettings({ ...settings, site_logo: e.target.value })}
                                    onUpload={(e: any) => handleFileUpload(e, 'site_logo')}
                                    placeholder="Upload or enter URL"
                                />

                                {/* Footer Logo */}
                                <ImageInput
                                    label="Footer Logo"
                                    value={settings.footer_logo}
                                    onChange={(e: any) => setSettings({ ...settings, footer_logo: e.target.value })}
                                    onUpload={(e: any) => handleFileUpload(e, 'footer_logo')}
                                    placeholder="Upload or enter URL (Optional)"
                                    darkPreview={true}
                                />

                                {/* Favicon */}
                                <ImageInput
                                    label="Favicon"
                                    value={settings.favicon}
                                    onChange={(e: any) => setSettings({ ...settings, favicon: e.target.value })}
                                    onUpload={(e: any) => handleFileUpload(e, 'favicon')}
                                    placeholder="Upload or enter URL"
                                />
                            </div>
                        </div>
                    </div>

                    {/* HERO SECTION */}
                    <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
                        <div
                            className="bg-gradient-to-r from-purple-600 to-blue-600 p-6 text-white flex justify-between items-center cursor-pointer select-none"
                            onClick={() => toggleSection('hero')}
                        >
                            <div className="flex items-center gap-3">
                                <span className={`transform transition-transform duration-300 ${expanded.hero ? 'rotate-90' : ''}`}>▶</span>
                                <h2 className="text-2xl font-bold">Hero Section</h2>
                            </div>
                            <button onClick={handleSave} disabled={saving} className="px-6 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg font-bold text-sm transition-all shadow-sm backdrop-blur-sm z-10">
                                {saving ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>

                        <div className={`transition-all duration-300 ease-in-out overflow-hidden ${expanded.hero ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                            <div className="p-8 space-y-6 border-t border-gray-100">
                                <div>
                                    <label className="block text-gray-700 font-bold mb-2">Hero Title</label>
                                    <input
                                        type="text"
                                        value={settings.hero_title || ''}
                                        onChange={(e) => setSettings({ ...settings, hero_title: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-purple-500 outline-none font-bold text-lg"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700 font-bold mb-2">Description</label>
                                    <textarea
                                        value={settings.hero_description || ''}
                                        onChange={(e) => setSettings({ ...settings, hero_description: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-purple-500 outline-none"
                                        rows={3}
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700 font-bold mb-2">Button Text</label>
                                    <input
                                        type="text"
                                        value={settings.hero_button_text || ''}
                                        onChange={(e) => setSettings({ ...settings, hero_button_text: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-purple-500 outline-none"
                                        placeholder="Shop Now"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-gray-700 font-bold mb-2">Product Button Text</label>
                                        <input
                                            type="text"
                                            value={settings.product_button_text || ''}
                                            onChange={(e) => setSettings({ ...settings, product_button_text: e.target.value })}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-purple-500 outline-none"
                                            placeholder="Order Now"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 font-bold mb-2">Combo Button Text</label>
                                        <input
                                            type="text"
                                            value={settings.combo_button_text || ''}
                                            onChange={(e) => setSettings({ ...settings, combo_button_text: e.target.value })}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-purple-500 outline-none"
                                            placeholder="Get This Combo Deal"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-gray-700 font-bold mb-3">Carousel Images</label>
                                    <div className="space-y-4">
                                        {settings.hero_images.map((url, idx) => (
                                            <div key={idx} className="flex gap-4 items-center bg-gray-50 p-3 rounded-lg border border-gray-200">
                                                <span className="text-gray-400 font-bold w-6">#{idx + 1}</span>
                                                <div className="flex-1">
                                                    <div className="flex gap-2">
                                                        <input
                                                            type="text"
                                                            value={url}
                                                            onChange={(e) => handleHeroImageChange(idx, e.target.value)}
                                                            className="flex-1 px-3 py-2 border border-gray-300 rounded focus:border-purple-500 outline-none text-sm"
                                                            placeholder="Image URL"
                                                            readOnly
                                                        />
                                                        <label className="cursor-pointer px-3 py-2 bg-purple-100 text-purple-700 hover:bg-purple-200 font-bold rounded text-sm transition-colors">
                                                            <input
                                                                type="file"
                                                                accept="image/*"
                                                                className="hidden"
                                                                onChange={(e) => handleFileUpload(e, { type: 'hero', index: idx })}
                                                                disabled={uploading}
                                                            />
                                                            {uploading ? '...' : 'Upload'}
                                                        </label>
                                                    </div>
                                                </div>
                                                <div className="w-16 h-16 bg-white rounded border overflow-hidden shrink-0">
                                                    {url && <img src={url} className="w-full h-full object-cover" />}
                                                </div>
                                            </div>
                                        ))}
                                        <button
                                            type="button"
                                            onClick={() => setSettings({ ...settings, hero_images: [...settings.hero_images, ''] })}
                                            className="text-purple-600 font-bold text-sm hover:underline ml-10"
                                        >
                                            + Add Another Slide
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* FAQs SECTION */}
                    <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
                        <div
                            className="bg-gradient-to-r from-purple-600 to-blue-600 p-6 text-white flex justify-between items-center cursor-pointer select-none"
                            onClick={() => toggleSection('faqs')}
                        >
                            <div className="flex items-center gap-3">
                                <span className={`transform transition-transform duration-300 ${expanded.faqs ? 'rotate-90' : ''}`}>▶</span>
                                <h2 className="text-2xl font-bold">FAQs</h2>
                            </div>
                            <div className="flex gap-3">
                                <button onClick={handleSave} disabled={saving} className="px-6 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg font-bold text-sm transition-all shadow-sm backdrop-blur-sm z-10">
                                    {saving ? 'Saving...' : 'Save Changes'}
                                </button>
                                <button
                                    type="button"
                                    onClick={(e) => { e.stopPropagation(); addFaq(); }}
                                    className="bg-white text-purple-600 px-4 py-2 rounded-lg font-bold text-sm hover:bg-gray-100 transition-colors z-10"
                                >
                                    + Add
                                </button>
                            </div>
                        </div>

                        <div className={`transition-all duration-300 ease-in-out overflow-hidden ${expanded.faqs ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                            <div className="p-8 space-y-4 border-t border-gray-100">
                                {(settings.faqs || []).map((faq, index) => (
                                    <div key={index} className="bg-gray-50 p-4 rounded-xl border border-gray-200 relative group">
                                        <button
                                            type="button"
                                            onClick={() => removeFaq(index)}
                                            className="absolute top-2 right-2 text-gray-400 hover:text-red-500 p-1"
                                        >
                                            ✕
                                        </button>
                                        <div className="space-y-3">
                                            <input
                                                type="text"
                                                value={faq.question}
                                                onChange={(e) => handleFaqChange(index, 'question', e.target.value)}
                                                className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:border-purple-500 outline-none font-bold"
                                                placeholder="Question"
                                            />
                                            <textarea
                                                value={faq.answer}
                                                onChange={(e) => handleFaqChange(index, 'answer', e.target.value)}
                                                className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:border-purple-500 outline-none"
                                                rows={2}
                                                placeholder="Answer"
                                            />
                                        </div>
                                    </div>
                                ))}
                                {(settings.faqs || []).length === 0 && (
                                    <p className="text-gray-500 text-center">No FAQs added yet.</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* CONTACT INFORMATION SECTION */}
                    <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
                        <div
                            className="bg-gradient-to-r from-purple-600 to-blue-600 p-6 text-white flex justify-between items-center cursor-pointer select-none"
                            onClick={() => toggleSection('contact')}
                        >
                            <div className="flex items-center gap-3">
                                <span className={`transform transition-transform duration-300 ${expanded.contact ? 'rotate-90' : ''}`}>▶</span>
                                <h2 className="text-2xl font-bold">Contact Information</h2>
                            </div>
                            <div className="flex gap-3">
                                <button onClick={handleSave} disabled={saving} className="px-6 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg font-bold text-sm transition-all shadow-sm backdrop-blur-sm z-10">
                                    {saving ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        </div>

                        <div className={`transition-all duration-300 ease-in-out overflow-hidden ${expanded.contact ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                            <div className="p-8 space-y-6 border-t border-gray-100">
                                <div>
                                    <label className="block text-gray-700 font-bold mb-2">Phone Number</label>
                                    <input
                                        type="text"
                                        value={settings.contact_phone || ''}
                                        onChange={(e) => setSettings({ ...settings, contact_phone: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-purple-500 outline-none"
                                        placeholder="+880 1234-567890"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700 font-bold mb-2">Email Address</label>
                                    <input
                                        type="email"
                                        value={settings.contact_email || ''}
                                        onChange={(e) => setSettings({ ...settings, contact_email: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-purple-500 outline-none"
                                        placeholder="support@example.com"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700 font-bold mb-2">Physical Address</label>
                                    <textarea
                                        value={settings.contact_address || ''}
                                        onChange={(e) => setSettings({ ...settings, contact_address: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-purple-500 outline-none"
                                        rows={3}
                                        placeholder="Dhaka, Bangladesh"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                </form>
            </div>
        </AdminLayout>
    );
}
