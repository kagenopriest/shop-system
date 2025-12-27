'use client';

import { useState, useEffect } from 'react';
import { User, Lock, Save, Loader2, Users, Plus, Trash2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';

type UserData = {
    id: number;
    username: string;
    name: string | null;
    role: string;
    createdAt: string;
};

export default function SettingsPage() {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    // User Management State
    const [users, setUsers] = useState<UserData[]>([]);
    const [isAddUserOpen, setIsAddUserOpen] = useState(false);
    const [newUser, setNewUser] = useState({ username: '', password: '', name: '', role: 'STAFF' });
    const [isUserLoading, setIsUserLoading] = useState(false);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await fetch('/api/users');
            if (res.ok) {
                const data = await res.json();
                setUsers(data);
            }
        } catch (e) {
            console.error('Failed to fetch users', e);
        }
    };

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

    const clearUserForm = () => {
        setNewUser({ username: '', password: '', name: '', role: 'STAFF' });
        setIsAddUserOpen(false);
    };

    const handleCreateUser = async () => {
        setIsUserLoading(true);
        try {
            const res = await fetch('/api/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newUser),
            });

            if (res.ok) {
                fetchUsers();
                clearUserForm();
            } else {
                const err = await res.json();
                alert(err.error || 'Failed to create user');
            }
        } catch (e) {
            console.error(e);
            alert('Error creating user');
        } finally {
            setIsUserLoading(false);
        }
    };

    const handleDeleteUser = async (id: number) => {
        if (!confirm('Are you sure you want to delete this user?')) return;

        try {
            const res = await fetch(`/api/users?id=${id}`, { method: 'DELETE' });
            if (res.ok) fetchUsers();
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-8">
            <h1 className="text-3xl font-bold tracking-tight">Settings</h1>

            {/* User Profile / Password */}
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
                        <Label>Current Password</Label>
                        <Input name="currentPassword" type="password" required />
                    </div>

                    <div className="space-y-2">
                        <Label>New Password</Label>
                        <Input name="newPassword" type="password" required minLength={6} />
                    </div>

                    <div className="space-y-2">
                        <Label>Confirm New Password</Label>
                        <Input name="confirmPassword" type="password" required minLength={6} />
                    </div>

                    <Button type="submit" disabled={loading} className="gap-2">
                        {loading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                        Update Password
                    </Button>
                </form>
            </div>

            {/* User Management */}
            <div className="bg-card border rounded-xl p-6 shadow-sm">
                <div className="flex items-center justify-between border-b pb-6 mb-6">
                    <div className="flex items-center gap-4">
                        <div className="h-16 w-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400">
                            <Users size={32} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold">User Management</h2>
                            <p className="text-muted-foreground">Manage system access and roles.</p>
                        </div>
                    </div>
                    <Button onClick={() => setIsAddUserOpen(true)} className="gap-2">
                        <Plus size={16} /> Add User
                    </Button>
                </div>

                <div className="rounded-md border">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-muted text-muted-foreground uppercase text-xs">
                            <tr>
                                <th className="px-6 py-3">Username</th>
                                <th className="px-6 py-3">Name</th>
                                <th className="px-6 py-3">Role</th>
                                <th className="px-6 py-3">Created</th>
                                <th className="px-6 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {users.map((user) => (
                                <tr key={user.id} className="hover:bg-muted/50">
                                    <td className="px-6 py-3 font-medium">{user.username}</td>
                                    <td className="px-6 py-3">{user.name || '-'}</td>
                                    <td className="px-6 py-3">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${user.role === 'ADMIN' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300' : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'}`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-3 text-muted-foreground">
                                        {new Date(user.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-3 text-right">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
                                            onClick={() => handleDeleteUser(user.id)}
                                        >
                                            <Trash2 size={16} />
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                            {users.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
                                        No users found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add User Dialog */}
            <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Create New User</DialogTitle>
                        <DialogDescription>Add a new user to the system.</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label>Username</Label>
                            <Input
                                value={newUser.username}
                                onChange={e => setNewUser({ ...newUser, username: e.target.value })}
                                placeholder="e.g. johndoe"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Full Name / Display Name</Label>
                            <Input
                                value={newUser.name}
                                onChange={e => setNewUser({ ...newUser, name: e.target.value })}
                                placeholder="e.g. John Doe"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Password</Label>
                            <Input
                                type="password"
                                value={newUser.password}
                                onChange={e => setNewUser({ ...newUser, password: e.target.value })}
                                placeholder="••••••"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Role</Label>
                            <Select
                                value={newUser.role}
                                onValueChange={val => setNewUser({ ...newUser, role: val })}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="STAFF">Staff</SelectItem>
                                    <SelectItem value="ADMIN">Admin</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={clearUserForm}>Cancel</Button>
                        <Button onClick={handleCreateUser} disabled={isUserLoading}>
                            {isUserLoading && <Loader2 size={16} className="mr-2 animate-spin" />}
                            Create User
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

