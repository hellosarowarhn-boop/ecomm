import mysql from 'mysql2/promise';
import { Product, Settings } from '@/app/types';

async function getConnection() {
    return await mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '1234',
        database: process.env.DB_NAME || 'ecom_db'
    });
}

export async function getSettings(): Promise<Settings | null> {
    try {
        const connection = await getConnection();
        const [rows] = await connection.execute('SELECT * FROM site_settings LIMIT 1');
        await connection.end();

        if ((rows as any[]).length === 0) return null;

        const row = (rows as any[])[0];
        const settings: Settings = {
            site_name: row.site_name,
            site_logo: row.site_logo,
            favicon: row.favicon,
            footer_logo: row.footer_logo,
            hero_title: row.hero_title,
            hero_description: row.hero_description,
            hero_button_text: row.hero_button_text,
            product_button_text: row.product_button_text,
            combo_button_text: row.combo_button_text,
            hero_images: typeof row.hero_images === 'string' ? JSON.parse(row.hero_images) : (row.hero_images || []),
            faqs: typeof row.faqs === 'string' ? JSON.parse(row.faqs) : (row.faqs || [])
        };

        // Ensure arrays
        if (!Array.isArray(settings.hero_images)) settings.hero_images = [];
        if (!Array.isArray(settings.faqs)) settings.faqs = [];

        return settings;
    } catch (error) {
        console.error('Error fetching settings:', error);
        return null;
    }
}

export async function getProducts(): Promise<Product[]> {
    try {
        const connection = await getConnection();
        const [rows] = await connection.execute('SELECT * FROM products WHERE is_active = TRUE');
        await connection.end();

        const rawProducts = (rows as any[]).map(row => ({
            id: row.id,
            name: row.name,
            original_price: parseFloat(row.original_price),
            offer_price: parseFloat(row.offer_price),
            type: row.type as 'single' | 'combo',
            bottle_quantity: parseInt(row.bottle_quantity),
            description: row.description || '',
            images: typeof row.images === 'string' ? JSON.parse(row.images) : (row.images || []),
            is_active: Boolean(row.is_active)
        }));

        // Combo Logic
        const singleProducts = rawProducts.filter(p => p.type === 'single');
        let comboImages: any[] = [];
        singleProducts.forEach(p => {
            const imgs = p.images ? p.images.map((img: any) => typeof img === 'string' ? { url: img, name: '' } : img) : [];
            comboImages = [...comboImages, ...imgs];
        });

        const products = rawProducts.map(p => {
            if (p.type === 'combo') {
                return { ...p, images: comboImages };
            }
            return p;
        });

        return products;
    } catch (error) {
        console.error('Error fetching products:', error);
        return [];
    }
}
