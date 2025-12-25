'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Store, Loader2 } from 'lucide-react';

export default function LoginPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);
        setError('');

        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData);

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.error || 'Login failed');
            }

            router.push('/dashboard');
            router.refresh();
        } catch (err: any) {
            setError(err.message);
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-muted/20 p-4">
            <div className="w-full max-w-md bg-card border rounded-xl shadow-lg p-8 animate-in fade-in zoom-in duration-300">
                <div className="flex flex-col items-center mb-6 text-center">
                    <div className="h-12 w-12 bg-primary rounded-xl flex items-center justify-center text-primary-foreground mb-4 shadow-lg shadow-primary/20">
                        <Store size={24} />
                    </div>
                    <h1 className="text-2xl font-bold">Welcome Back</h1>
                    <p className="text-muted-foreground mt-1">Sign in to ShopMaster to continue</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                    {error && (
                        <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-lg font-medium text-center">
                            {error}
                        </div>
                    )}

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Username</label>
                        <input
                            name="username"
                            required
                            className="w-full px-4 py-2 border rounded-lg bg-background focus:ring-2 ring-primary/20 outline-none transition-all"
                            placeholder="Enter username"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Password</label>
                        <input
                            name="password"
                            type="password"
                            required
                            className="w-full px-4 py-2 border rounded-lg bg-background focus:ring-2 ring-primary/20 outline-none transition-all"
                            placeholder="Enter password"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-2.5 bg-primary text-primary-foreground rounded-lg font-bold hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 mt-2"
                    >
                        {loading && <Loader2 size={16} className="animate-spin" />}
                        Sign In
                    </button>
                </form>
            </div>
        </div>
    )
}
