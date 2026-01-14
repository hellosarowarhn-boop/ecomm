import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';
import { writeFile } from 'fs/promises';
import { join } from 'path';

async function getConnection() {
    return await mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '1234',
        database: process.env.DB_NAME || 'ecom_db'
    });
}

export async function GET() {
    try {
        const connection = await getConnection();

        const [rows] = await connection.execute('SELECT * FROM site_settings LIMIT 1');
        await connection.end();

        if ((rows as any).length === 0) {
            // Create default settings if none exist
            const conn = await getConnection();

            // Default FAQs
            const defaultFaqs = JSON.stringify([]);

            await conn.execute(
                'INSERT INTO site_settings (site_name, site_logo, favicon, footer_logo, hero_title, hero_description, hero_button_text, product_button_text, combo_button_text, hero_images, faqs) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
                ['E-Commerce Store', '', '', '', 'Elevate Your Everyday.', 'Discover our premium collection.', 'Shop Now', 'Order Now', 'Get This Combo Deal', '[]', defaultFaqs]
            );
            await conn.end();

            return NextResponse.json({
                id: 1,
                site_name: 'E-Commerce Store',
                site_logo: '',
                favicon: '',
                footer_logo: '',
                hero_title: 'Elevate Your Everyday.',
                hero_description: 'Discover our premium collection.',
                hero_button_text: 'Shop Now',
                product_button_text: 'Order Now',
                combo_button_text: 'Get This Combo Deal',
                hero_images: [],
                faqs: JSON.parse(defaultFaqs)
            });
        }

        return NextResponse.json((rows as any)[0]);
    } catch (error: any) {
        console.error('Settings API Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        const body = await request.json();
        const { site_name, site_logo, favicon, footer_logo, hero_title, hero_description, hero_button_text, product_button_text, combo_button_text, hero_images, faqs, contact_phone, contact_email, contact_address } = body;

        const connection = await getConnection();

        await connection.execute(
            'UPDATE site_settings SET site_name = ?, site_logo = ?, favicon = ?, footer_logo = ?, hero_title = ?, hero_description = ?, hero_button_text = ?, product_button_text = ?, combo_button_text = ?, hero_images = ?, faqs = ?, contact_phone = ?, contact_email = ?, contact_address = ? WHERE id = 1',
            [
                site_name,
                site_logo || '',
                favicon || '',
                footer_logo || '',
                hero_title || '',
                hero_description || '',
                hero_button_text || 'Shop Now',
                product_button_text || 'Order Now',
                combo_button_text || 'Get This Combo Deal',
                JSON.stringify(hero_images || []),
                JSON.stringify(faqs || []),
                contact_phone || '',
                contact_email || '',
                contact_address || ''
            ]
        );

        await connection.end();

        // Write to public/settings.json for static access
        try {
            const settingsObject = {
                site_name,
                site_logo,
                favicon,
                footer_logo,
                hero_title,
                hero_description,
                hero_button_text: hero_button_text || 'Shop Now',
                product_button_text: product_button_text || 'Order Now',
                combo_button_text: combo_button_text || 'Get This Combo Deal',
                hero_images: hero_images || [],
                faqs: faqs || [],
                contact_phone: contact_phone || '',
                contact_email: contact_email || '',
                contact_address: contact_address || ''
            };
            const filePath = join(process.cwd(), 'public', 'settings.json');
            await writeFile(filePath, JSON.stringify(settingsObject, null, 2));

            // Write contact info to public/uploads/contact.json (User Request)
            const uploadsDir = join(process.cwd(), 'public', 'uploads');
            // Check/Create dir logic is a bit verbose with promises, assuming public/uploads exists or we try best effort
            // A safer way is using mkdir with recursive: true
            const fs = require('fs/promises'); // Dynamic import or use existing import if updated
            await fs.mkdir(uploadsDir, { recursive: true });

            const contactObject = {
                phone: contact_phone || '',
                email: contact_email || '',
                address: contact_address || '',
                working_hours: 'Saturday - Thursday: 9:00 AM - 9:00 PM' // Could be dynamic later
            };
            await writeFile(join(uploadsDir, 'contact.json'), JSON.stringify(contactObject, null, 2));

        } catch (fileError) {
            console.error('Failed to write settings files:', fileError);
            // Continue settings update
        }

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('Settings Update Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
