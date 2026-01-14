import Link from 'next/link';
import { promises as fs } from 'fs';
import path from 'path';

export default async function ContactPage() {
    // Default values
    let contactInfo = {
        phone: '+880 1234-567890',
        email: 'support@example.com',
        address: 'Dhaka, Bangladesh',
        working_hours: 'Saturday - Thursday: 9:00 AM - 9:00 PM'
    };

    // Try to load from file
    try {
        const filePath = path.join(process.cwd(), 'public', 'uploads', 'contact.json');
        const fileContents = await fs.readFile(filePath, 'utf8');
        const loadedInfo = JSON.parse(fileContents);
        contactInfo = { ...contactInfo, ...loadedInfo };
    } catch (error) {
        // Use defaults if file missing
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
            {/* Header */}
            <header className="bg-white shadow-sm">
                <div className="container mx-auto px-4 py-6">
                    <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                        ← Back to Home
                    </Link>
                </div>
            </header>

            {/* Contact Content */}
            <div className="container mx-auto px-4 py-20">
                <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-2xl p-8 md:p-12">
                    <div className="text-center mb-10">
                        <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <span className="text-5xl">📞</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">Contact Us</h1>
                        <p className="text-gray-600 text-lg">We're here to help! Reach out to us anytime.</p>
                    </div>

                    <div className="space-y-6">
                        {/* Phone */}
                        <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-6 border-2 border-purple-100">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center text-white text-2xl">
                                    📱
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900 mb-1">Phone</h3>
                                    <a href={`tel:${contactInfo.phone.replace(/[^0-9+]/g, '')}`} className="text-purple-600 font-semibold hover:underline">
                                        {contactInfo.phone}
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Email */}
                        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border-2 border-blue-100">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl">
                                    ✉️
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900 mb-1">Email</h3>
                                    <a href={`mailto:${contactInfo.email}`} className="text-blue-600 font-semibold hover:underline">
                                        {contactInfo.email}
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Working Hours */}
                        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border-2 border-green-100">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center text-white text-2xl">
                                    🕐
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900 mb-1">Working Hours</h3>
                                    <p className="text-gray-700 font-medium">{contactInfo.working_hours}</p>
                                    <p className="text-gray-600 text-sm">Friday: Closed</p>
                                </div>
                            </div>
                        </div>

                        {/* Address */}
                        <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl p-6 border-2 border-orange-100">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-orange-600 rounded-full flex items-center justify-center text-white text-2xl">
                                    📍
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900 mb-1">Address</h3>
                                    <p className="text-gray-700 font-medium">{contactInfo.address}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Call to Action */}
                    <div className="mt-10 text-center">
                        <Link
                            href="/"
                            className="inline-block px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-bold text-lg hover:shadow-2xl transition-all"
                        >
                            Return to Shopping
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
