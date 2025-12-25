'use client';

import { useEffect, useState } from 'react';
import { BarChart3, Users, TrendingUp, Calendar, Loader2 } from 'lucide-react';

interface UserReport {
    id: number;
    name: string;
    role: string;
    salesCount: number;
    totalRevenue: number;
}

export default function ReportsPage() {
    const [users, setUsers] = useState<UserReport[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/reports/users')
            .then(res => res.json())
            .then(data => {
                setUsers(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    const totalRevenue = users.reduce((acc, user) => acc + user.totalRevenue, 0);

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold tracking-tight">Reports</h1>

            <div className="grid gap-4 md:grid-cols-3">
                <div className="bg-card p-6 rounded-xl border shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-primary/10 text-primary rounded-lg">
                            <TrendingUp size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Total Revenue Tracked</p>
                            <h3 className="text-2xl font-bold">₹{totalRevenue.toFixed(2)}</h3>
                        </div>
                    </div>
                </div>
                {/* Placeholder for future stats */}
            </div>

            <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
                <div className="p-6 border-b flex items-center justify-between">
                    <h2 className="text-lg font-bold flex items-center gap-2">
                        <Users size={20} className="text-blue-600" />
                        User Performance
                    </h2>
                </div>

                {loading ? (
                    <div className="p-12 flex justify-center">
                        <Loader2 className="animate-spin text-primary" size={32} />
                    </div>
                ) : (
                    <table className="w-full text-left text-sm">
                        <thead className="bg-muted/50 text-muted-foreground font-medium">
                            <tr>
                                <th className="px-6 py-4">Staff Member</th>
                                <th className="px-6 py-4">Role</th>
                                <th className="px-6 py-4">Total Orders</th>
                                <th className="px-6 py-4 text-right">Total Revenue Generated</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {users.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-8 text-center text-muted-foreground">No data available.</td>
                                </tr>
                            ) : (
                                users.map(user => (
                                    <tr key={user.id} className="hover:bg-muted/30">
                                        <td className="px-6 py-4 font-medium">{user.name}</td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${user.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">{user.salesCount}</td>
                                        <td className="px-6 py-4 text-right font-bold text-green-600">₹{user.totalRevenue.toFixed(2)}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    )
}
