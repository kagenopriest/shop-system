'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, ShoppingCart, Trash2, Plus, Minus, CreditCard } from 'lucide-react';
import { Category, Product } from '@prisma/client';
import CheckoutDialog from '@/components/sales/CheckoutDialog';

type ProductWithCategory = Product & { category: Category | null };

type CartItem = {
    product: ProductWithCategory;
    quantity: number;
};

export default function SalesPage() {
    const router = useRouter();
    const [products, setProducts] = useState<ProductWithCategory[]>([]);
    const [cart, setCart] = useState<CartItem[]>([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

    useEffect(() => {
        fetch('/api/products')
            .then(res => res.json())
            .then(data => {
                setProducts(data);
                setLoading(false);
            })
            .catch(err => console.error(err));
    }, []);

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        (p.customId && p.customId.toLowerCase().includes(search.toLowerCase()))
    );

    const addToCart = (product: ProductWithCategory) => {
        setCart(prev => {
            const existing = prev.find(item => item.product.id === product.id);
            if (existing) {
                return prev.map(item =>
                    item.product.id === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }
            return [...prev, { product, quantity: 1 }];
        });
    };

    const updateQuantity = (productId: string, delta: number) => {
        setCart(prev => prev.map(item => {
            if (item.product.id === productId) {
                const newQty = Math.max(0, item.quantity + delta);
                return { ...item, quantity: newQty };
            }
            return item;
        }).filter(item => item.quantity > 0));
    };

    const total = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

    const handleSaleComplete = (saleId: number) => {
        setCart([]);
        setIsCheckoutOpen(false);
        router.push(`/receipt/${saleId}`);
    };

    return (
        <div className="flex h-[calc(100vh-6rem)] gap-6">
            {/* Product Section */}
            <div className="flex-1 flex flex-col gap-4">
                <div className="bg-card border rounded-xl p-4 flex gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                        <input
                            placeholder="Search products..."
                            className="w-full pl-10 pr-4 py-2 bg-background border rounded-lg focus:ring-2 ring-primary/20 outline-none"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-auto bg-card border rounded-xl p-4">
                    {loading ? (
                        <div className="text-center py-10 text-muted-foreground">Loading products...</div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {filteredProducts.map(product => (
                                <button
                                    key={product.id}
                                    onClick={() => addToCart(product)}
                                    className="flex flex-col text-left p-4 rounded-xl border hover:border-primary/50 hover:bg-muted/30 transition-all group"
                                >
                                    <div className="aspect-square bg-muted rounded-lg mb-3 w-full flex items-center justify-center text-muted-foreground group-hover:bg-background">
                                        {product.imageUrl ? <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover rounded-lg" /> : <div className="text-xs">No Image</div>}
                                    </div>
                                    <h3 className="font-semibold line-clamp-1">{product.name}</h3>
                                    <div className="flex justify-between items-center mt-1 w-full">
                                        <span className="text-sm text-green-600 font-bold">₹{product.price}</span>
                                        <span className="text-xs text-muted-foreground">In: {product.stock}</span>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Cart Section */}
            <div className="w-96 flex flex-col bg-card border rounded-xl overflow-hidden">
                <div className="p-4 border-b bg-muted/30 font-semibold flex items-center gap-2">
                    <ShoppingCart size={20} />
                    Current Sale
                </div>

                <div className="flex-1 overflow-auto p-4 space-y-3">
                    {cart.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-muted-foreground space-y-2 opacity-50">
                            <ShoppingCart size={48} />
                            <p>Cart is empty</p>
                        </div>
                    ) : (
                        cart.map(item => (
                            <div key={item.product.id} className="flex justify-between items-center bg-background border rounded-lg p-3">
                                <div className="flex-1">
                                    <div className="font-medium text-sm">{item.product.name}</div>
                                    <div className="text-xs text-muted-foreground">₹{item.product.price} x {item.quantity}</div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center border rounded-md">
                                        <button onClick={() => updateQuantity(item.product.id, -1)} className="p-1 hover:bg-muted"><Minus size={14} /></button>
                                        <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                                        <button onClick={() => updateQuantity(item.product.id, 1)} className="p-1 hover:bg-muted"><Plus size={14} /></button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <div className="p-6 bg-muted/10 border-t space-y-4">
                    <div className="flex justify-between text-xl font-bold">
                        <span>Total</span>
                        <span>₹{total.toFixed(2)}</span>
                    </div>

                    <button
                        disabled={cart.length === 0}
                        onClick={() => setIsCheckoutOpen(true)}
                        className="w-full py-3 bg-primary text-primary-foreground rounded-xl font-bold hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        <CreditCard size={20} />
                        Checkout
                    </button>
                </div>
            </div>

            <CheckoutDialog
                isOpen={isCheckoutOpen}
                onClose={() => setIsCheckoutOpen(false)}
                onComplete={handleSaleComplete}
                totalAmount={total}
                items={cart.map(c => ({
                    productId: c.product.id,
                    quantity: c.quantity,
                    price: c.product.price,
                    name: c.product.name
                }))}
            />
        </div>
    )
}
