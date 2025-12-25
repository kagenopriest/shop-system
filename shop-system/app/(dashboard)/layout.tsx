import { Store, ShoppingCart, Package, Users, BarChart3, Settings } from 'lucide-react';
import Link from 'next/link';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen">
            {/* Sidebar */}
            <aside className="w-64 bg-card border-r border-border hidden md:flex flex-col">
                <div className="p-6 border-b border-border flex items-center gap-2">
                    <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground">
                        <Store size={20} />
                    </div>
                    <h1 className="font-bold text-xl tracking-tight">ShopMaster</h1>
                </div>

                <nav className="flex-1 p-4 space-y-1">
                    <NavItem href="/dashboard" icon={<BarChart3 />} label="Dashboard" />
                    <NavItem href="/inventory" icon={<Package />} label="Inventory" />
                    <NavItem href="/sales" icon={<ShoppingCart />} label="Sales & Billing" />
                    <NavItem href="/reports" icon={<BarChart3 />} label="Reports" />
                </nav>

                <div className="p-4 border-t border-border">
                    <NavItem href="/settings" icon={<Settings />} label="Settings" />
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col bg-muted/20">
                <header className="h-16 bg-card border-b border-border flex items-center justify-between px-6 sticky top-0 z-10 md:hidden">
                    <div className="font-bold">ShopMaster</div>
                    {/* Mobile toggle would go here */}
                </header>

                <main className="flex-1 p-6 overflow-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}

function NavItem({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
    return (
        <Link href={href} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-all font-medium">
            {icon}
            <span>{label}</span>
        </Link>
    )
}
