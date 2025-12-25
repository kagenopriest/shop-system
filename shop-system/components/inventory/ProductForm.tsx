'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Save, X } from 'lucide-react';
import { Category } from '@prisma/client';

export default function ProductForm({ categories }: { categories: Category[] }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);
        setError('');

        const formData = new FormData(e.currentTarget);
        const data = {
            name: formData.get('name'),
            customId: formData.get('customId'),
            categoryId: formData.get('categoryId'),
            price: formData.get('price'),
            stock: formData.get('stock'),
            description: formData.get('description'),
        };

        try {
            const res = await fetch('/api/products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (!res.ok) throw new Error('Failed to create product');

            router.push('/inventory');
            router.refresh();
        } catch (err) {
            setError('Something went wrong. Please try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="bg-card border rounded-xl p-6 shadow-sm max-w-2xl mx-auto space-y-6">
            <div className="space-y-1 border-b pb-4">
                <h2 className="text-xl font-bold">Add New Product</h2>
                <p className="text-sm text-muted-foreground">Fill in the details to add a new item to your inventory.</p>
            </div>

            {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm font-medium">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-sm font-medium">Product Name *</label>
                    <input name="name" required className="w-full px-3 py-2 border rounded-lg bg-background focus:ring-2 ring-primary/20 outline-none" placeholder="e.g. Wireless Mouse" />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">Product ID (Auto/Custom)</label>
                    <input name="customId" className="w-full px-3 py-2 border rounded-lg bg-background focus:ring-2 ring-primary/20 outline-none" placeholder="Leave empty for auto-generated" />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">Category *</label>
                    <select name="categoryId" required className="w-full px-3 py-2 border rounded-lg bg-background focus:ring-2 ring-primary/20 outline-none">
                        <option value="">Select a category</option>
                        {categories.map(c => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                    </select>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">Price (₹) *</label>
                    <input name="price" type="number" step="0.01" required className="w-full px-3 py-2 border rounded-lg bg-background focus:ring-2 ring-primary/20 outline-none" placeholder="0.00" />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">Initial Stock *</label>
                    <input name="stock" type="number" required defaultValue={0} className="w-full px-3 py-2 border rounded-lg bg-background focus:ring-2 ring-primary/20 outline-none" />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">Image URL</label>
                    <input name="imageUrl" type="url" className="w-full px-3 py-2 border rounded-lg bg-background focus:ring-2 ring-primary/20 outline-none" placeholder="https://..." />
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <textarea name="description" rows={3} className="w-full px-3 py-2 border rounded-lg bg-background focus:ring-2 ring-primary/20 outline-none" placeholder="Product details..." />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                    type="button"
                    onClick={() => router.back()}
                    className="px-4 py-2 rounded-lg border hover:bg-muted/50 transition-colors font-medium text-sm"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex items-center gap-2 px-6 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-medium text-sm disabled:opacity-50"
                >
                    {loading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                    Save Product
                </button>
            </div>
        </form>
    )
}
