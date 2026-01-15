import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { Admin } from '@/models';

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key';

export interface AdminPayload {
    id: number;
    email: string;
    role: 'super_admin' | 'co_admin';
    name: string;
}

export const verifyAdmin = async (email: string, password: string): Promise<AdminPayload | null> => {
    try {
        const admin = await Admin.findOne({ where: { email } });

        if (!admin) {
            return null;
        }

        const isValidPassword = await bcrypt.compare(password, admin.password);

        if (!isValidPassword) {
            return null;
        }

        return {
            id: admin.id,
            email: admin.email,
            role: admin.role,
            name: admin.name || 'Admin',
        };
    } catch (error) {
        console.error('Error verifying admin:', error);
        return null;
    }
};

export const generateToken = (payload: AdminPayload): string => {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
};

export const verifyToken = (token: string): AdminPayload | null => {
    try {
        const decoded = jwt.verify(token, JWT_SECRET) as AdminPayload;
        return decoded;
    } catch (error) {
        return null;
    }
};

export const hashPassword = async (password: string): Promise<string> => {
    return await bcrypt.hash(password, 10);
};

export const comparePassword = async (password: string, hash: string): Promise<boolean> => {
    return await bcrypt.compare(password, hash);
};
