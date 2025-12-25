import { prisma } from '@/lib/prisma';
import { Search } from 'lucide-react';
import InventoryActions from '@/components/inventory/InventoryActions';

async function getProducts(query: string) {
    return await prisma.product.findMany({
        where: {
            OR: [
                { name: { contains: query } },
                { customId: { contains: query } },
            ]
        },
        include: { category: true },
        orderBy: { createdAt: 'desc' }
    });
}

export default async function InventoryPage({
    searchParams,
}: {
    searchParams: { q?: string };
}) {
    const query = searchParams.q || '';
    const products: any[] = await getProducts(query);

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Inventory</h1>
                <InventoryActions />
            </div>

            <div className="flex items-center gap-2 bg-card border rounded-lg px-3 py-2 max-w-md focus-within:ring-2 ring-primary/20 transition-all">
                <Search size={18} className="text-muted-foreground" />
                <form>
                    <input
                        name="q"
                        defaultValue={query}
                        placeholder="Search by Name or ID..."
                        className="bg-transparent border-none outline-none text-sm w-full placeholder:text-muted-foreground/70"
                    />
                </form>
            </div>

            <div className="bg-card border rounded-xl overflow-hidden shadow-sm">
                <table className="w-full text-sm text-left">
                    <thead className="bg-muted/50 text-muted-foreground border-b font-medium">
                        <tr>
                            <th className="px-6 py-4">ID</th>
                            <th className="px-6 py-4">Product Name</th>
                            <th className="px-6 py-4">Category</th>
                            <th className="px-6 py-4">Price</th>
                            <th className="px-6 py-4">Stock</th>
                            <th className="px-6 py-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {products.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                                    No products found. Add one to get started.
                                </td>
                            </tr>
                        ) : (
                            products.map((product) => (
                                <tr key={product.id} className="hover:bg-muted/30 transition-colors">
                                    <td className="px-6 py-4 font-mono text-xs text-muted-foreground">{product.customId || product.id.slice(0, 8)}</td>
                                    <td className="px-6 py-4 font-medium">{product.name}</td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary text-secondary-foreground">
                                            {product.category?.name || 'Uncategorized'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-green-600 font-medium">₹{product.price.toFixed(2)}</td>
                                    <td className="px-6 py-4">
                                        <div className={`inline-flex items-center gap-1.5 ${product.stock < 10 ? 'text-orange-600 font-medium' : 'text-slate-600'}`}>
                                            {product.stock}
                                            {product.stock < 10 && <span className="h-2 w-2 rounded-full bg-orange-500 animate-pulse" />}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <button className="text-primary hover:underline">Edit</button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
