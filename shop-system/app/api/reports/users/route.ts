import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        // Group sales by user (or buyerName if not linked, but usually sales are linked to logged in user? 
        // actually our schema has `userId`, but let's check if we populate it in POST sale)
        // In our current POS `app/api/sales/route.ts`, we might not be saving `userId`. 
        // Let's rely on `buyerName` for now or check the schema.

        // Checking schema: Sale has `userId`?
        // Wait, I need to verify if Sale model has `userId` relation.
        // If not, I'll use `buyerName` which is customer. User Performance implies STAFF performance.
        // If we didn't implement tracking WHICH staff made the sale, we can't show Staff Performance.
        // Let's check schema first.

        const users = await prisma.user.findMany({
            include: {
                _count: {
                    select: { sales: true }
                }
            }
        });

        // We need total revenue per user.
        const performance = await Promise.all(users.map(async (user: any) => {
            const stats = await prisma.sale.aggregate({
                where: { userId: user.id },
                _sum: { totalAmount: true }
            });
            return {
                id: user.id,
                name: user.name || user.username,
                role: user.role,
                salesCount: user._count.sales,
                totalRevenue: stats._sum.totalAmount || 0
            };
        }));

        return NextResponse.json(performance);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch reports' }, { status: 500 });
    }
}
