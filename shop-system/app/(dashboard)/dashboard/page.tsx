import { prisma } from '@/lib/prisma';
import { format, subDays, startOfDay } from 'date-fns';
import SalesChart from '@/components/dashboard/SalesChart';
import Link from 'next/link';
import { ArrowRight, Package, ShoppingCart, TrendingUp, AlertTriangle } from 'lucide-react';

async function getDashboardData() {
    const today = startOfDay(new Date());
    const sevenDaysAgo = subDays(today, 6); // Include today

    // 1. Aggregates
    const totalStats = await prisma.sale.aggregate({
        _sum: { totalAmount: true },
        _count: { id: true }
    });

    const todayStats = await prisma.sale.aggregate({
        where: { date: { gte: today } },
        _sum: { totalAmount: true },
        _count: { id: true }
    });

    const lowStockCount = await prisma.product.count({
        where: { stock: { lt: 10 } }
    });

    // 2. Chart Data
    const recentSales = await prisma.sale.findMany({
        where: { date: { gte: sevenDaysAgo } },
        select: { date: true, totalAmount: true }
    });

    const chartData = [];
    for (let i = 6; i >= 0; i--) {
        const d = subDays(today, i);
        const dayStr = format(d, 'yyyy-MM-dd');
        const daySales = recentSales.filter(s => format(s.date, 'yyyy-MM-dd') === dayStr);
        const total = daySales.reduce((sum, s) => sum + s.totalAmount, 0);
        chartData.push({ name: format(d, 'MMM dd'), total });
    }

    // 3. Recent Transactions
    const recentTransactions = await prisma.sale.findMany({
        take: 5,
        orderBy: { date: 'desc' },
        include: { items: { take: 1 } } // Get first item name for summary
    });

    return {
        totalRevenue: totalStats._sum.totalAmount || 0,
        totalOrders: totalStats._count.id || 0,
        todayRevenue: todayStats._sum.totalAmount || 0,
        todayOrders: todayStats._count.id || 0,
        lowStockCount,
        chartData,
        recentTransactions
    };
}

export default async function DashboardPage() {
    const data = await getDashboardData();

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                <div className="text-sm text-muted-foreground">{format(new Date(), 'EEEE, MMMM do, yyyy')}</div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatsCard
                    title="Total Revenue"
                    value={`₹${data.totalRevenue.toFixed(2)}`}
                    icon={<TrendingUp className="text-green-600" size={24} />}
                />
                <StatsCard
                    title="Today's Sales"
                    value={`₹${data.todayRevenue.toFixed(2)}`}
                    description={`${data.todayOrders} orders today`}
                    icon={<ShoppingCart className="text-blue-600" size={24} />}
                />
                <StatsCard
                    title="Total Orders"
                    value={data.totalOrders.toString()}
                    icon={<Package className="text-purple-600" size={24} />}
                />
                <StatsCard
                    title="Low Stock Items"
                    value={data.lowStockCount.toString()}
                    description={data.lowStockCount > 0 ? "Requires attention" : "Inventory healthy"}
                    icon={<AlertTriangle className="text-orange-600" size={24} />}
                    alert={data.lowStockCount > 0}
                />
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <div className="col-span-4 bg-card rounded-xl border p-6 shadow-sm">
                    <h3 className="font-semibold mb-6 flex items-center gap-2">
                        <TrendingUp size={18} className="text-primary" />
                        Revenue Overview (Last 7 Days)
                    </h3>
                    <SalesChart data={data.chartData} />
                </div>

                <div className="col-span-3 bg-card rounded-xl border p-6 shadow-sm flex flex-col">
                    <h3 className="font-semibold mb-4">Recent Sales</h3>
                    <div className="flex-1 space-y-4">
                        {data.recentTransactions.length === 0 ? (
                            <div className="text-center text-muted-foreground py-8">No recent transactions.</div>
                        ) : (
                            data.recentTransactions.map(sale => (
                                <div key={sale.id} className="flex items-center justify-between border-b last:border-0 pb-3 last:pb-0">
                                    <div className="space-y-1">
                                        <div className="font-medium text-sm">{sale.buyerName || 'Guest'}</div>
                                        <div className="text-xs text-muted-foreground">
                                            {sale.items[0]?.productName}
                                            {sale.items.length > 1 && ` +${sale.items.length - 1} more`}
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-bold text-sm">₹{sale.totalAmount.toFixed(2)}</div>
                                        <div className="text-xs text-muted-foreground">{format(sale.date, 'p')}</div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                    <div className="pt-4 mt-auto border-t">
                        <Link href="/sales" className="text-sm text-primary flex items-center gap-1 hover:underline">
                            View all sales <ArrowRight size={14} />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

function StatsCard({ title, value, description, icon, alert }: any) {
    return (
        <div className={`p-6 bg-card rounded-xl border shadow-sm transition-all hover:shadow-md ${alert ? 'border-orange-200 bg-orange-50/50' : ''}`}>
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
                <div className={`p-2 rounded-lg bg-background ${alert ? 'bg-white' : ''} shadow-sm`}>{icon}</div>
            </div>
            <div className="text-2xl font-bold">{value}</div>
            {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
        </div>
    )
}
