import { NextResponse } from 'next/server';
import { Order } from '@/models';
import { Op } from 'sequelize';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const phone = searchParams.get('phone');
        const limit = parseInt(searchParams.get('limit') || '1000');
        const offset = parseInt(searchParams.get('offset') || '0');
        const deleted = searchParams.get('deleted');

        const whereClause: any = {};

        // Filter deleted/active orders
        if (deleted === 'true') {
            whereClause.deleted_at = { [Op.ne]: null };
        } else {
            whereClause.deleted_at = null;
        }

        if (phone) {
            whereClause.phone = phone;
        }

        const orders = await Order.findAll({
            where: whereClause,
            order: [['created_at', 'DESC']],
            limit: limit,
            offset: offset,
        });

        return NextResponse.json(orders);
    } catch (error: any) {
        console.error('Orders GET Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { customer_name, phone, city, address, product_id, product_name_snapshot, price_snapshot } = body;

        const newOrder = await Order.create({
            customer_name,
            phone,
            city,
            address,
            product_id,
            product_name_snapshot,
            price_snapshot,
            order_status: 'pending',
        });

        return NextResponse.json({
            success: true,
            id: newOrder.id
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

        await Order.update(
            { order_status },
            { where: { id } }
        );

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

        if (!id) {
            return NextResponse.json({ error: 'Order ID is required' }, { status: 400 });
        }

        if (action === 'restore') {
            await Order.update(
                { deleted_at: null },
                { where: { id } }
            );
        } else if (action === 'permanent') {
            await Order.destroy({
                where: { id }
            });
        } else {
            // Soft delete
            await Order.update(
                { deleted_at: new Date() },
                { where: { id } }
            );
        }

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('Orders DELETE Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
