import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const mysql = require('mysql2/promise');

        const connection = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '1234',
            database: 'ecom_db'
        });

        const [rows] = await connection.execute('SELECT COUNT(*) as count FROM products');
        await connection.end();

        return NextResponse.json({
            success: true,
            productCount: rows[0].count,
            message: 'Direct MySQL connection works!'
        });
    } catch (error: any) {
        return NextResponse.json({
            success: false,
            error: error.message,
            stack: error.stack
        }, { status: 500 });
    }
}
