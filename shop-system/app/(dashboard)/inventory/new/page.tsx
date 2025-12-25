import { prisma } from '@/lib/prisma';
import ProductForm from '@/components/inventory/ProductForm';

export default async function AddProductPage() {
    const categories = await prisma.category.findMany({
        orderBy: { name: 'asc' }
    });

    return (
        <div className="max-w-4xl mx-auto py-6">
            <ProductForm categories={categories} />
        </div>
    );
}
