import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';

export async function PUT(request: Request) {
    try {
        const body = await request.json();
        const { currentPassword, newPassword } = body;

        // Get user from session
        const cookieStore = await cookies();
        const session = cookieStore.get('session')?.value;

        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const userData = JSON.parse(session);

        const user = await prisma.user.findUnique({
            where: { id: userData.id }
        });

        if (!user || !(await bcrypt.compare(currentPassword, user.password))) {
            return NextResponse.json({ error: 'Incorrect current password' }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await prisma.user.update({
            where: { id: user.id },
            data: { password: hashedPassword }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Profile update error:', error);
        return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
    }
}
