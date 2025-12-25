import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { products } = body;

        if (!Array.isArray(products) || products.length === 0) {
            return NextResponse.json({ error: 'No products provided' }, { status: 400 });
        }

        const results = {
            success: 0,
            failed: 0,
            errors: [] as string[]
        };

        // We process sequentially to handle category upserts safely
        // In a larger system, we might optimize this, but for <1000 items this is fine.
        for (const item of products) {
            try {
                // validation
                if (!item.name || !item.price) {
                    results.failed++;
                    results.errors.push(`Skipped ${item.name || 'Unknown'}: Missing name or price`);
                    continue;
                }

                // Find or create category
                let categoryId: number;
                if (item.category) {
                    const cat = await prisma.category.upsert({
                        where: { name: item.category },
                        create: { name: item.category },
                        update: {},
                    });
                    categoryId = cat.id;
                } else {
                    const defaultCat = await prisma.category.upsert({
                        where: { name: 'Others' },
                        create: { name: 'Others' },
                        update: {},
                    });
                    categoryId = defaultCat.id;
                }

                await prisma.product.create({
                    data: {
                        name: item.name,
                        price: parseFloat(item.price),
                        stock: parseInt(item.stock) || 0,
                        categoryId: categoryId,
                        customId: item.customId || undefined,
                        description: item.description || '',
                    }
                });
                results.success++;
            } catch (err: any) {
                results.failed++;
                results.errors.push(`Failed ${item.name}: ${err.message}`);
            }
        }

        return NextResponse.json(results);
    } catch (error) {
        console.error('Bulk upload error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
