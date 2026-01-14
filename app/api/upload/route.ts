import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File | null;

        if (!file) {
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Ensure upload directory exists
        const uploadDir = join(process.cwd(), 'public', 'uploads');
        try {
            await mkdir(uploadDir, { recursive: true });
        } catch (error) {
            // Ignore error if directory exists
        }

        // Clean filename for SEO (remove special chars, spaces to dashes)
        const originalName = file.name.split('.')[0].replace(/[^a-z0-9]/gi, '-').toLowerCase();
        const extension = file.name.split('.').pop();
        const timestamp = Date.now();
        const filename = `${originalName}-${timestamp}.${extension}`;

        const filepath = join(uploadDir, filename);

        await writeFile(filepath, buffer);

        // Return the public URL
        const url = `/uploads/${filename}`;

        return NextResponse.json({ url, success: true });
    } catch (error: any) {
        console.error('Upload error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
