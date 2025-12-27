"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function Home() {
  const router = useRouter();
  const [status, setStatus] = useState("Loading ShopMaster...");

  useEffect(() => {
    // Check if running in Electron
    if (typeof window !== 'undefined' && (window as any).electron) {
      setStatus("Checking configuration...");
      (window as any).electron.checkConfig().then((isConfigured: boolean) => {
        if (isConfigured) {
          setStatus("Redirecting to Dashboard...");
          router.replace('/dashboard');
        } else {
          setStatus("Redirecting to Setup...");
          router.replace('/setup');
        }
      });
    } else {
      // Fallback for browser dev mode (assume configured or redirect to dashboard for dev)
      setStatus("Development Mode - Redirecting...");
      router.replace('/dashboard');
    }
  }, [router]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 dark:bg-zinc-950 p-4">
      <div className="flex flex-col items-center space-y-4">
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="ShopMaster Logo"
          width={180}
          height={37}
          priority
        />
        <p className="text-zinc-500 animate-pulse">{status}</p>
      </div>
    </div>
  );
}
