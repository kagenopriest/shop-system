'use client';

import { useState } from 'react';
import { X, Loader2, CreditCard, Banknote, Smartphone } from 'lucide-react';

interface CheckoutDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onComplete: (saleId: number) => void;
    totalAmount: number;
    items: { productId: string; quantity: number; price: number; name: string }[];
}

export default function CheckoutDialog({ isOpen, onClose, onComplete, totalAmount, items }: CheckoutDialogProps) {
    const [loading, setLoading] = useState(false);
    const [paymentMode, setPaymentMode] = useState('CASH');
    const [buyerName, setBuyerName] = useState('');
    const [buyerContact, setBuyerContact] = useState('');
    const [discount, setDiscount] = useState('');

    if (!isOpen) return null;

    const finalAmount = Math.max(0, totalAmount - (parseFloat(discount) || 0));

    async function handleCheckout() {
        setLoading(true);
        try {
            const res = await fetch('/api/sales', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    buyerName,
                    buyerContact,
                    paymentMode,
                    discount: parseFloat(discount) || 0,
                    totalAmount: finalAmount,
                    items
                })
            });

            if (!res.ok) throw new Error('Sale failed');

            const data = await res.json();
            onComplete(data.id);
        } catch (error) {
            console.error(error);
            alert('Checkout failed! Please try again.');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-card w-full max-w-md rounded-xl shadow-lg overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="p-6 border-b flex justify-between items-center">
                    <h2 className="text-xl font-bold">Checkout</h2>
                    <button onClick={onClose}><X size={20} className="text-muted-foreground hover:text-foreground" /></button>
                </div>

                <div className="p-6 space-y-6">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Payment Method</label>
                            <div className="grid grid-cols-3 gap-2">
                                <PaymentOption
                                    icon={<Banknote />}
                                    label="Cash"
                                    selected={paymentMode === 'CASH'}
                                    onClick={() => setPaymentMode('CASH')}
                                />
                                <PaymentOption
                                    icon={<Smartphone />}
                                    label="Online"
                                    selected={paymentMode === 'ONLINE'}
                                    onClick={() => setPaymentMode('ONLINE')}
                                />
                                <PaymentOption
                                    icon={<CreditCard />}
                                    label="Credit"
                                    selected={paymentMode === 'CREDIT'}
                                    onClick={() => setPaymentMode('CREDIT')}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Buyer Name (Opt)</label>
                                <input
                                    value={buyerName}
                                    onChange={e => setBuyerName(e.target.value)}
                                    className="w-full px-3 py-2 border rounded-lg bg-background outline-none text-sm"
                                    placeholder="Guest"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Contact (Opt)</label>
                                <input
                                    value={buyerContact}
                                    onChange={e => setBuyerContact(e.target.value)}
                                    className="w-full px-3 py-2 border rounded-lg bg-background outline-none text-sm"
                                    placeholder="Phone"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Discount (₹)</label>
                            <input
                                type="number"
                                value={discount}
                                onChange={e => setDiscount(e.target.value)}
                                className="w-full px-3 py-2 border rounded-lg bg-background outline-none text-sm"
                                placeholder="0.00"
                            />
                        </div>
                    </div>

                    <div className="bg-muted/30 p-4 rounded-lg space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Original Total</span>
                            <span>₹{totalAmount.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm text-green-600">
                            <span>Discount</span>
                            <span>-₹{(parseFloat(discount) || 0).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-xl font-bold pt-2 border-t">
                            <span>To Pay</span>
                            <span>₹{finalAmount.toFixed(2)}</span>
                        </div>
                    </div>
                </div>

                <div className="p-6 border-t bg-muted/10">
                    <button
                        onClick={handleCheckout}
                        disabled={loading}
                        className="w-full py-3 bg-primary text-primary-foreground rounded-xl font-bold hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
                    >
                        {loading && <Loader2 className="animate-spin" size={20} />}
                        Complete Sale
                    </button>
                </div>
            </div>
        </div>
    )
}

function PaymentOption({ icon, label, selected, onClick }: { icon: React.ReactNode, label: string, selected: boolean, onClick: () => void }) {
    return (
        <button
            onClick={onClick}
            className={`flex flex-col items-center justify-center p-3 rounded-lg border transition-all ${selected ? 'bg-primary/10 border-primary text-primary ring-2 ring-primary/20' : 'bg-background hover:bg-muted'}`}
        >
            {icon}
            <span className="text-xs font-medium mt-1">{label}</span>
        </button>
    )
}
