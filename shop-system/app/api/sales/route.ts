import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

import { cookies } from 'next/headers';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { items, buyerName, buyerContact, paymentMode, discount, totalAmount } = body;

        // Get user from session
        const cookieStore = await cookies();
        const session = cookieStore.get('session')?.value;
        let userId = 1; // Default to Admin if logic fails

        if (session) {
            try {
                const userData = JSON.parse(session);
                userId = userData.id;
            } catch (e) {
                console.error('Session parse error', e);
            }
        }

        // Transaction to ensure stock is updated and sale is recorded
        const result = await prisma.$transaction(async (tx: any) => {
            // 1. Create Sale
            const sale = await tx.sale.create({
                data: {
                    userId: userId,
                    buyerName: buyerName || 'Guest',
                    buyerContact,
                    paymentMode,
                    discount,
                    totalAmount,
                    items: {
                        create: items.map((item: any) => ({
                            productId: item.productId,
                            productName: item.name,
                            quantity: item.quantity,
                            price: item.price
                        }))
                    }
                }
            });

            // 2. Decrement Stock
            for (const item of items) {
                await tx.product.update({
                    where: { id: item.productId },
                    data: {
                        stock: { decrement: item.quantity }
                    }
                });
            }

            return sale;
        });

        return NextResponse.json(result);
    } catch (error) {
        console.error('Failed to process sale:', error);
        return NextResponse.json({ error: 'Failed to process sale' }, { status: 500 });
    }
}
