'use client';

import { Printer } from 'lucide-react';
import { useEffect } from 'react';

export default function PrintButton() {
    useEffect(() => {
        // Optional: Auto-print on mount
        // window.print();
    }, []);

    return (
        <button
            onClick={() => window.print()}
            className="flex items-center gap-1 text-sm bg-primary text-primary-foreground px-3 py-1.5 rounded-md hover:bg-primary/90"
        >
            <Printer size={16} /> Print
        </button>
    )
}
