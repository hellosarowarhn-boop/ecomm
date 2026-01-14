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

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const phone = searchParams.get('phone');

        const connection = await getConnection();

        let query = 'SELECT * FROM orders';
        let params: any[] = [];

        if (phone) {
            query += ' WHERE phone = ? ORDER BY created_at DESC';
            params = [phone];
        } else {
            query += ' ORDER BY created_at DESC';
        }

        const [rows] = await connection.execute(query, params);
        await connection.end();

        return NextResponse.json(rows);
    } catch (error: any) {
        console.error('Orders GET Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { customer_name, phone, city, address, product_id, product_name_snapshot, price_snapshot } = body;

        const connection = await getConnection();

        const [result] = await connection.execute(
            'INSERT INTO orders (customer_name, phone, city, address, product_id, product_name_snapshot, price_snapshot, order_status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [customer_name, phone, city, address, product_id, product_name_snapshot, price_snapshot, 'pending']
        );

        await connection.end();

        return NextResponse.json({
            success: true,
            id: (result as any).insertId
        });
    } catch (error: any) {
        console.error('Orders POST Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        const body = await request.json();
        const { id, order_status } = body;

        const connection = await getConnection();

        await connection.execute(
            'UPDATE orders SET order_status = ? WHERE id = ?',
            [order_status, id]
        );

        await connection.end();

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('Orders PUT Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        const connection = await getConnection();

        await connection.execute('DELETE FROM orders WHERE id = ?', [id]);

        await connection.end();

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('Orders DELETE Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
