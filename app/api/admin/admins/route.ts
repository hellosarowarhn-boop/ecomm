import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, hashPassword } from '@/lib/auth';
import { Admin } from '@/models';

export async function GET(request: NextRequest) {
    try {
        const token = request.cookies.get('admin_token')?.value;
        const payload = token ? verifyToken(token) : null;

        if (!payload || payload.role !== 'super_admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        const admins = await Admin.findAll({
            attributes: ['id', 'name', 'email', 'role', 'createdAt'],
            order: [['createdAt', 'DESC']],
        });

        return NextResponse.json(admins);
    } catch (error) {
        console.error('Error fetching admins:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const token = request.cookies.get('admin_token')?.value;
        const payload = token ? verifyToken(token) : null;

        if (!payload || payload.role !== 'super_admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        const body = await request.json();
        let { name, email, password, role } = body;

        if (!email || !password) {
            return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
        }

        // Normalize inputs
        name = name?.trim();
        email = email.trim().toLowerCase();
        password = password.trim();

        const existingAdmin = await Admin.findOne({ where: { email } });
        if (existingAdmin) {
            return NextResponse.json({ error: 'Email already exists' }, { status: 400 });
        }

        const hashedPassword = await hashPassword(password);

        const newAdmin = await Admin.create({
            name,
            email,
            password: hashedPassword,
            role: role || 'co_admin',
        });

        return NextResponse.json({
            id: newAdmin.id,
            name: newAdmin.name,
            email: newAdmin.email,
            role: newAdmin.role,
        }, { status: 201 });

    } catch (error) {
        console.error('Error creating admin:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
