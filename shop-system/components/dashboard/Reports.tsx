'use client';

import { BarChart3 } from 'lucide-react';

export default function ReportsPlaceholder() {
    return (
        <div className="p-8 text-center text-muted-foreground bg-card border rounded-xl">
            <BarChart3 className="mx-auto mb-4 opacity-50" size={48} />
            <h3 className="text-lg font-medium">Reporting Module</h3>
            <p className="max-w-md mx-auto mt-2 text-sm">
                Sales overview and user performance reports will appear here.
                Coming soon in the next update.
            </p>
        </div>
    )
}
