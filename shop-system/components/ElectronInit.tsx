"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function ElectronInit() {
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        // Check if running in Electron
        if (typeof window !== 'undefined' && (window as any).electron) {
            (window as any).electron.checkConfig().then((isConfigured: boolean) => {
                if (!isConfigured && pathname !== '/setup') {
                    console.log("App not configured, redirecting to setup...");
                    router.replace('/setup');
                }
            });
        }
    }, [pathname, router]);

    return null;
}
