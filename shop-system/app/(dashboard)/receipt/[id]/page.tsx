import { prisma } from '@/lib/prisma';
import { ArrowLeft, Printer } from 'lucide-react';
import Link from 'next/link';

async function getSale(id: number) {
    return await prisma.sale.findUnique({
        where: { id },
        include: { items: true }
    });
}

export default async function ReceiptPage({ params }: { params: { id: string } }) {
    const saleId = parseInt(params.id);
    if (isNaN(saleId)) return <div>Invalid Receipt ID</div>;

    const sale = await getSale(saleId);
    if (!sale) return <div>Receipt not found</div>;

    const formattedDate = new Intl.DateTimeFormat('en-IN', {
        dateStyle: 'medium',
        timeStyle: 'short',
    }).format(sale.date);

    return (
        <div className="min-h-screen bg-muted/20 p-8 flex flex-col items-center">
            <div className="w-full max-w-sm bg-white p-8 shadow-sm print:shadow-none print:w-full">
                {/* Actions (Hidden in Print) */}
                <div className="mb-6 flex justify-between print:hidden">
                    <Link href="/sales" className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
                        <ArrowLeft size={16} /> Back
                    </Link>
                    <PrintButton />
                </div>

                {/* Receipt Content */}
                <div className="text-center space-y-1 mb-6 border-b pb-4 border-dashed">
                    <h1 className="text-2xl font-bold uppercase tracking-wider">ShopMaster</h1>
                    <p className="text-xs text-muted-foreground">Premium General Store</p>
                    <p className="text-xs text-muted-foreground">123 Market Street, City</p>
                    <p className="text-xs text-muted-foreground">Tel: +91 98765 43210 | IG: @shopmaster</p>
                </div>

                <div className="space-y-1 mb-6 text-xs">
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Receipt No:</span>
                        <span className="font-mono">{sale.receiptId}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Date:</span>
                        <span>{formattedDate}</span>
                    </div>
                    {sale.buyerName && (
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Customer:</span>
                            <span>{sale.buyerName}</span>
                        </div>
                    )}
                </div>

                {/* Items */}
                <table className="w-full text-xs text-left mb-6">
                    <thead className="border-b border-dashed">
                        <tr>
                            <th className="py-2 font-medium">Item</th>
                            <th className="py-2 text-right">Qty</th>
                            <th className="py-2 text-right">Price</th>
                            <th className="py-2 text-right">Total</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-dashed">
                        {sale.items.map(item => (
                            <tr key={item.id}>
                                <td className="py-2">{item.productName}</td>
                                <td className="py-2 text-right">{item.quantity}</td>
                                <td className="py-2 text-right">{item.price}</td>
                                <td className="py-2 text-right">{(item.quantity * item.price).toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Totals */}
                <div className="space-y-2 border-t border-dashed pt-4 text-sm">
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span>₹{sale.totalAmount + sale.discount}</span>
                    </div>
                    {sale.discount > 0 && (
                        <div className="flex justify-between text-muted-foreground">
                            <span>Discount</span>
                            <span>-₹{sale.discount.toFixed(2)}</span>
                        </div>
                    )}
                    <div className="flex justify-between font-bold text-lg pt-2 border-t border-dashed">
                        <span>Total (Paid)</span>
                        <span>₹{sale.totalAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground pt-1">
                        <span>Mode: {sale.paymentMode}</span>
                    </div>
                </div>

                <div className="text-center mt-8 text-xs text-muted-foreground print:hidden">
                    <p>Thank you for shopping with us!</p>
                </div>
            </div>
        </div>
    )
}

import PrintButton from '@/components/sales/PrintButton';
