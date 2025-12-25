import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { username, password } = body;

        const user = await prisma.user.findUnique({
            where: { username }
        });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return NextResponse.json({ error: 'Invalid username or password' }, { status: 401 });
        }

        // Set session cookie
        const cookieStore = await cookies();
        cookieStore.set('session', JSON.stringify({
            id: user.id,
            username: user.username,
            role: user.role
        }), {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 60 * 60 * 24 * 7 // 1 week
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
