import { NextResponse } from 'next/server';
import { Admin } from '@/models';

export async function GET() {
    try {
        const email = 'admin@ecomstore.com';

        const admin = await Admin.findOne({ where: { email } });

        if (!admin) {
            return NextResponse.json({ status: 'User not found in DB' });
        }

        // Return the RAW object structure to see what's inside
        return NextResponse.json({
            status: 'User found',
            keys: Object.keys(admin),
            dataValues: admin.dataValues, // Sequelize stores data here
            password_prop: admin.password,
            json: admin.toJSON()
        });

    } catch (e: any) {
        return NextResponse.json({ status: 'DB Error', message: e.message, stack: e.stack });
    }
}
