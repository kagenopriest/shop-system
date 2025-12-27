"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { FolderOpen, Upload, Database, Save, CheckCircle } from "lucide-react";

export default function SetupPage() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [dataFolder, setDataFolder] = useState("");
    const [backupFolder, setBackupFolder] = useState("");
    const [isRestoring, setIsRestoring] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // EULA
    const [accepted, setAccepted] = useState(false);

    useEffect(() => {
        // Check if running in Electron
        if (typeof window !== 'undefined' && !(window as any).electron) {
            // Fallback for browser dev mode
            console.warn("Not running in Electron. Setup functions disabled.");
        }
    }, []);

    const selectDataFolder = async () => {
        if ((window as any).electron) {
            const path = await (window as any).electron.selectFolder();
            if (path) setDataFolder(path);
        }
    };

    const selectBackupFolder = async () => {
        if ((window as any).electron) {
            const path = await (window as any).electron.selectFolder();
            if (path) setBackupFolder(path);
        }
    };

    const handleInitNew = async () => {
        setIsLoading(true);
        try {
            const success = await (window as any).electron.initDbNew(dataFolder);
            if (success) {
                // App will relaunch, but just in case
                alert("Setup Complete! The application will now restart.");
            } else {
                alert("Failed to create database.");
            }
        } catch (e) {
            console.error(e);
            alert("Error during setup.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleRestore = async () => {
        const backupFile = await (window as any).electron.selectFile();
        if (!backupFile) return;

        setIsLoading(true);
        try {
            const success = await (window as any).electron.restoreDb(backupFile, dataFolder);
            if (success) {
                alert("Restore Complete! The application will now restart.");
            } else {
                alert("Failed to restore database.");
            }
        } catch (e) {
            console.error(e);
            alert("Error during restore.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
            <Card className="w-full max-w-2xl shadow-xl">
                <CardHeader>
                    <CardTitle className="text-2xl">ShopMaster Setup Wizard</CardTitle>
                    <CardDescription>Configure your shop system for the first time.</CardDescription>
                </CardHeader>
                <CardContent>
                    {step === 1 && (
                        <div className="space-y-4">
                            <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-md h-64 overflow-y-auto text-sm">
                                <h3 className="font-bold mb-2">End User License Agreement</h3>
                                <p>This application is provided "as is"... (Complete license text here)</p>
                                <p className="mt-2">By proceeding, you agree to these terms.</p>
                            </div>
                            <label className="flex items-center space-x-2 cursor-pointer p-2 bg-gray-200/50 rounded hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors">
                                <input
                                    type="checkbox"
                                    checked={accepted}
                                    onChange={(e) => setAccepted(e.target.checked)}
                                    className="w-5 h-5 accent-primary cursor-pointer"
                                />
                                <span className="text-sm font-medium select-none">I accept the license agreement</span>
                            </label>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <Label>Data Storage Location</Label>
                                <p className="text-sm text-muted-foreground">
                                    Where should your business data (database) be stored?
                                    Choosing a non-system drive (like D: or E:) is recommended for safety.
                                </p>
                                <div className="flex gap-2">
                                    <Input value={dataFolder} readOnly placeholder="Select a folder..." />
                                    <Button variant="outline" onClick={selectDataFolder}><FolderOpen className="w-4 h-4 mr-2" /> Browse</Button>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Backup Location (Optional)</Label>
                                <p className="text-sm text-muted-foreground">
                                    Where should daily backups be saved?
                                </p>
                                <div className="flex gap-2">
                                    <Input value={backupFolder} readOnly placeholder="Select a folder..." />
                                    <Button variant="outline" onClick={selectBackupFolder}><FolderOpen className="w-4 h-4 mr-2" /> Browse</Button>
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Card className="cursor-pointer hover:border-primary transition-colors" onClick={handleInitNew}>
                                <CardHeader className="text-center">
                                    <div className="mx-auto bg-primary/10 p-4 rounded-full mb-2">
                                        <Database className="w-8 h-8 text-primary" />
                                    </div>
                                    <CardTitle>New Installation</CardTitle>
                                    <CardDescription>Start fresh with an empty database.</CardDescription>
                                </CardHeader>
                            </Card>

                            <Card className="cursor-pointer hover:border-primary transition-colors" onClick={() => setIsRestoring(true)}>
                                <CardHeader className="text-center">
                                    <div className="mx-auto bg-primary/10 p-4 rounded-full mb-2">
                                        <Upload className="w-8 h-8 text-primary" />
                                    </div>
                                    <CardTitle>Restore Backup</CardTitle>
                                    <CardDescription>Restore data from a previous backup file.</CardDescription>
                                </CardHeader>
                            </Card>
                        </div>
                    )}

                    {isRestoring && step === 3 && (
                        <div className="mt-6 text-center">
                            <Button onClick={handleRestore} disabled={isLoading}>
                                {isLoading ? "Restoring..." : "Select Backup File to Restore"}
                            </Button>
                        </div>
                    )}
                </CardContent>
                <CardFooter className="flex justify-between">
                    <Button variant="ghost" disabled={step === 1 || isLoading} onClick={() => setStep(step - 1)}>Back</Button>

                    {step < 3 && (
                        <Button
                            onClick={() => setStep(step + 1)}
                            disabled={(step === 1 && !accepted) || (step === 2 && !dataFolder)}
                        >
                            Next
                        </Button>
                    )}
                </CardFooter>
            </Card>
        </div>
    );
}
