'use client';

import { useState } from 'react';
import { User, Lock, Save, Loader2 } from 'lucide-react';

export default function SettingsPage() {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: '', text: '' });

        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData);

        if (data.newPassword !== data.confirmPassword) {
            setMessage({ type: 'error', text: 'Passwords do not match' });
            setLoading(false);
            return;
        }

        try {
            const res = await fetch('/api/user/profile', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    currentPassword: data.currentPassword,
                    newPassword: data.newPassword
                }),
            });

            const result = await res.json();

            if (!res.ok) throw new Error(result.error);

            setMessage({ type: 'success', text: 'Password updated successfully' });
            (e.target as HTMLFormElement).reset();
        } catch (error: any) {
            setMessage({ type: 'error', text: error.message });
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <h1 className="text-3xl font-bold tracking-tight">Settings</h1>

            <div className="bg-card border rounded-xl p-6 shadow-sm">
                <div className="flex items-center gap-4 border-b pb-6 mb-6">
                    <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                        <User size={32} />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold">User Profile</h2>
                        <p className="text-muted-foreground">Manage your account settings and password.</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
                    <h3 className="font-semibold flex items-center gap-2">
                        <Lock size={18} /> Change Password
                    </h3>

                    {message.text && (
                        <div className={`p-3 rounded-lg text-sm font-medium ${message.type === 'error' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                            {message.text}
                        </div>
                    )}

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Current Password</label>
                        <input
                            name="currentPassword"
                            type="password"
                            required
                            className="w-full px-4 py-2 border rounded-lg bg-background outline-none focus:ring-2 ring-primary/20"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">New Password</label>
                        <input
                            name="newPassword"
                            type="password"
                            required
                            minLength={6}
                            className="w-full px-4 py-2 border rounded-lg bg-background outline-none focus:ring-2 ring-primary/20"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Confirm New Password</label>
                        <input
                            name="confirmPassword"
                            type="password"
                            required
                            minLength={6}
                            className="w-full px-4 py-2 border rounded-lg bg-background outline-none focus:ring-2 ring-primary/20"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="mt-4 px-6 py-2 bg-primary text-primary-foreground rounded-lg font-bold hover:bg-primary/90 transition-colors flex items-center gap-2 disabled:opacity-50"
                    >
                        {loading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                        Update Password
                    </button>
                </form>
            </div>
        </div>
    )
}
