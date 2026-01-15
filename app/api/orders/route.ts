import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

async function getConnection() {
    return await mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'ecom_db'
    });
}

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const phone = searchParams.get('phone');
        const limit = parseInt(searchParams.get('limit') || '1000'); // Default limit 1000
        const offset = parseInt(searchParams.get('offset') || '0');
        const deleted = searchParams.get('deleted'); // 'true' for recycle bin

        const connection = await getConnection();

        let query = 'SELECT * FROM orders';
        let params: any[] = [];

        // Filter deleted/active orders
        if (deleted === 'true') {
            query += ' WHERE deleted_at IS NOT NULL';
        } else {
            query += ' WHERE deleted_at IS NULL';
        }

        if (phone) {
            query += ' AND phone = ?';
            params.push(phone);
        }

        query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
        params.push(limit, offset);

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
        const action = searchParams.get('action'); // 'soft', 'restore', 'permanent'

        const connection = await getConnection();

        if (action === 'restore') {
            // Restore from recycle bin
            await connection.execute('UPDATE orders SET deleted_at = NULL WHERE id = ?', [id]);
        } else if (action === 'permanent') {
            // Permanent delete
            await connection.execute('DELETE FROM orders WHERE id = ?', [id]);
        } else {
            // Soft delete (move to recycle bin)
            await connection.execute('UPDATE orders SET deleted_at = NOW() WHERE id = ?', [id]);
        }

        await connection.end();

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('Orders DELETE Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
