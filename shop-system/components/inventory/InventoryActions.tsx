'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Plus, Upload } from 'lucide-react';
import CsvUploadDialog from './CsvUploadDialog';

export default function InventoryActions() {
    const [isUploadOpen, setIsUploadOpen] = useState(false);

    return (
        <div className="flex gap-2">
            <button
                onClick={() => setIsUploadOpen(true)}
                className="inline-flex items-center gap-2 bg-secondary text-secondary-foreground hover:bg-secondary/80 px-4 py-2 rounded-lg font-medium transition-colors border border-border"
            >
                <Upload size={18} />
                <span className="hidden sm:inline">Import CSV</span>
            </button>

            <Link
                href="/inventory/new"
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-lg font-medium transition-colors"
            >
                <Plus size={18} />
                <span className="hidden sm:inline">Add Product</span>
                <span className="sm:hidden">Add</span>
            </Link>

            <CsvUploadDialog isOpen={isUploadOpen} onClose={() => setIsUploadOpen(false)} />
        </div>
    )
}
