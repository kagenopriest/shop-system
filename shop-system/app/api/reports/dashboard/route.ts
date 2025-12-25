import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { startOfDay, subDays, format } from 'date-fns';

export async function GET() {
    try {
        const today = startOfDay(new Date());
        const sevenDaysAgo = subDays(today, 7);

        // 1. Total revenue & orders (All time)
        const totalStats = await prisma.sale.aggregate({
            _sum: { totalAmount: true },
            _count: { id: true }
        });

        // 2. Today's revenue
        const todayStats = await prisma.sale.aggregate({
            where: { date: { gte: today } },
            _sum: { totalAmount: true },
            _count: { id: true }
        });

        // 3. Low stock items
        const lowStockCount = await prisma.product.count({
            where: { stock: { lt: 10 } }
        });

        // 4. Sales over last 7 days (for Chart)
        const recentSales = await prisma.sale.findMany({
            where: { date: { gte: sevenDaysAgo } },
            select: { date: true, totalAmount: true }
        });

        // Group by day
        const chartData = [];
        for (let i = 6; i >= 0; i--) {
            const d = subDays(today, i);
            const label = format(d, 'MMM dd');
            const daySales = recentSales.filter(s =>
                format(s.date, 'yyyy-MM-dd') === format(d, 'yyyy-MM-dd')
            );
            const total = daySales.reduce((sum, s) => sum + s.totalAmount, 0);
            chartData.push({ name: label, total });
        }

        // 5. Recent Sales
        const recentTransactions = await prisma.sale.findMany({
            take: 5,
            orderBy: { date: 'desc' },
            select: { id: true, buyerName: true, totalAmount: true, date: true, receiptId: true }
        });

        return NextResponse.json({
            totalRevenue: totalStats._sum.totalAmount || 0,
            totalOrders: totalStats._count.id || 0,
            todayRevenue: todayStats._sum.totalAmount || 0,
            lowStock: lowStockCount,
            chartData,
            recentTransactions
        });

    } catch (error) {
        console.error('Reports error:', error);
        return NextResponse.json({ error: 'Failed to fetch reports' }, { status: 500 });
    }
}
