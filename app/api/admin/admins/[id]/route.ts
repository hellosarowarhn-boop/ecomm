import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, hashPassword } from '@/lib/auth';
import { Admin } from '@/models';

export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const token = request.cookies.get('admin_token')?.value;
        const payload = token ? verifyToken(token) : null;

        if (!payload || payload.role !== 'super_admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        const id = parseInt(params.id);
        const body = await request.json();
        const { name, email, password, role } = body;

        const adminToUpdate = await Admin.findByPk(id);
        if (!adminToUpdate) {
            return NextResponse.json({ error: 'Admin not found' }, { status: 404 });
        }

        // Prepare update data
        const updateData: any = { name, email, role };
        if (password && password.trim() !== '') {
            updateData.password = await hashPassword(password);
        }

        await adminToUpdate.update(updateData);

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error('Error updating admin:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const token = request.cookies.get('admin_token')?.value;
        const payload = token ? verifyToken(token) : null;

        if (!payload || payload.role !== 'super_admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        const id = parseInt(params.id);

        // Prevent self-deletion
        if (id === payload.id) {
            return NextResponse.json({ error: 'Cannot delete yourself' }, { status: 400 });
        }

        const adminToDelete = await Admin.findByPk(id);
        if (!adminToDelete) {
            return NextResponse.json({ error: 'Admin not found' }, { status: 404 });
        }

        await adminToDelete.destroy();

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error('Error deleting admin:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
