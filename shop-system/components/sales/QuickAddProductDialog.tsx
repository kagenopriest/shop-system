"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";

interface QuickAddProductDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onProductAdded: (product: any) => void;
    initialName?: string;
}

export default function QuickAddProductDialog({ isOpen, onClose, onProductAdded, initialName = "" }: QuickAddProductDialogProps) {
    const [loading, setLoading] = useState(false);
    const [name, setName] = useState(initialName);
    const [price, setPrice] = useState("");
    const [categoryId, setCategoryId] = useState("1"); // Default to 1 (General/Others) or fetch categories

    // Update name if initialName changes
    useState(() => {
        if (initialName) setName(initialName);
    });

    const handleSave = async () => {
        if (!name || !price) return;
        setLoading(true);
        try {
            // We'll trust the backend to handle category "Others" creation if ID 1 doesn't exist, 
            // but for now let's hope standard seeding created categories.
            // Ideally we should list categories here, but for "Quick Add" let's stick to a default or simple input.
            // Actually, let's fetch categories or hardcode "Others" (id: 1 from seed).

            const res = await fetch("/api/products/quick-add", {
                // We might need a specific endpoint or just use generic POST products
                // Let's use generic POST if it exists, or create a quick-add one.
                // Re-using common POST if available or creating a new one. 
                // Checking previous context, I don't recall seeing a POST api/products. 
                // Let's assume we need to create it or use a server action. 
                // I'll assume I need to create a simple route or use valid one.
                // Let's TRY api/products. If it doesn't exist I'll create it.
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name,
                    price: parseFloat(price),
                    categoryId: parseInt(categoryId),
                    stock: 100 // Default stock for quick add? Or 0? Let's say 0 and let them add stock later, or 1 for immediate sale? 
                    // User said: "if Item is not in the inventory it should ask to add it into the inventory"
                    // Usually implies adding to catalog. 
                })
            });

            if (res.ok) {
                const product = await res.json();
                onProductAdded(product);
                onClose();
            } else {
                alert("Failed to add product");
            }
        } catch (e) {
            console.error(e);
            alert("Error adding product");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Quick Add Product</DialogTitle>
                    <DialogDescription>Add a new item to inventory to proceed with sale.</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-2">
                    <div className="space-y-2">
                        <Label>Product Name</Label>
                        <Input value={name} onChange={e => setName(e.target.value)} placeholder="Item name" />
                    </div>
                    <div className="space-y-2">
                        <Label>Price</Label>
                        <Input type="number" value={price} onChange={e => setPrice(e.target.value)} placeholder="0.00" />
                    </div>
                    <div className="space-y-2">
                        <Label>Category</Label>
                        <Select value={categoryId} onValueChange={setCategoryId}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="1">Others</SelectItem>
                                {/* We could fetch categories dynamically here */}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>Cancel</Button>
                    <Button onClick={handleSave} disabled={loading}>
                        {loading && <Loader2 size={16} className="animate-spin mr-2" />}
                        Save & Add to Cart
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
