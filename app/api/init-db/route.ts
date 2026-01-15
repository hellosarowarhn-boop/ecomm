import { NextRequest, NextResponse } from 'next/server';
import { initDb, Admin } from '@/models';
import bcrypt from 'bcryptjs';

export async function GET(request: NextRequest) {
    try {
        const success = await initDb();

        if (success) {
            // Security Fix: Only create admin if one doesn't exist.
            // NEVER reset the password of an existing admin via this public route.
            const existingAdmin = await Admin.findOne({ where: { email: 'admin@ecomstore.com' } });

            let msg = 'Database initialized successfully';

            if (!existingAdmin) {
                const hashedPassword = await bcrypt.hash('admin123', 10);
                await Admin.create({
                    email: 'admin@ecomstore.com',
                    password: hashedPassword,
                    name: 'Super Admin',
                    role: 'super_admin',
                });
                msg += '. Default admin created: admin@ecomstore.com / admin123';
            } else {
                msg += '. Admin account already exists (password unchanged).';
            }

            return NextResponse.json(
                { success: true, message: msg },
                { status: 200 }
            );
        } else {
            return NextResponse.json(
                { error: 'Failed to initialize database (Reason: initDb returned false)' },
                { status: 500 }
            );
        }
    } catch (error) {
        console.error('Database initialization error:', error);
        return NextResponse.json(
            {
                error: 'Failed to initialize database',
                details: error instanceof Error ? error.message : String(error)
            },
            { status: 500 }
        );
    }
}
