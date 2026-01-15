import { NextRequest, NextResponse } from 'next/server';
import { initDb, Admin } from '@/models';
import bcrypt from 'bcryptjs';

export async function GET(request: NextRequest) {
    try {
        const success = await initDb();

        if (success) {
            // Force reset admin password to ensure access
            const hashedPassword = await bcrypt.hash('admin123', 10);
            const [updated] = await Admin.update(
                { password: hashedPassword },
                { where: { email: 'admin@ecomstore.com' } }
            );

            let msg = 'Database initialized successfully';
            if (updated > 0) {
                msg += '. Admin password reset to: admin123';
            } else {
                // If update returned 0, maybe user doesn't exist despite initDb?
                // initDb should have created it.
                // Or maybe email is different?
                // Let's ensure it exists.
                const count = await Admin.count({ where: { email: 'admin@ecomstore.com' } });
                if (count === 0) {
                    await Admin.create({
                        email: 'admin@ecomstore.com',
                        password: hashedPassword,
                    });
                    msg += '. Admin account recreated.';
                }
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
