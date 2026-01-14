import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

async function getConnection() {
    return await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '1234',
        database: 'ecom_db'
    });
}

function formatProduct(row: any) {
    return {
        id: row.id,
        name: row.name,
        original_price: parseFloat(row.original_price),
        offer_price: parseFloat(row.offer_price),
        type: row.type,
        bottle_quantity: parseInt(row.bottle_quantity),
        description: row.description || '',
        images: typeof row.images === 'string' ? JSON.parse(row.images) : (row.images || []),
        is_active: Boolean(row.is_active)
    };
}

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const active = searchParams.get('active');

        const connection = await getConnection();

        let query = 'SELECT * FROM products';
        if (active === 'true') {
            query += ' WHERE is_active = TRUE';
        }

        const [rows] = await connection.execute(query);
        await connection.end();

        const formattedProducts = (rows as any[]).map(formatProduct);

        return NextResponse.json(formattedProducts);
    } catch (error: any) {
        console.error('Products API Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        const body = await request.json();
        const { id, name, original_price, offer_price, bottle_quantity, description, images, is_active } = body;

        const connection = await getConnection();

        await connection.execute(
            'UPDATE products SET name = ?, original_price = ?, offer_price = ?, bottle_quantity = ?, description = ?, images = ?, is_active = ? WHERE id = ?',
            [name, original_price, offer_price, bottle_quantity, description || '', JSON.stringify(images || []), is_active, id]
        );

        await connection.end();

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('Products Update Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
