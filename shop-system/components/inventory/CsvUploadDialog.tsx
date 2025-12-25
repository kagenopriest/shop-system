'use client';

import { useState } from 'react';
import { Upload, X, FileSpreadsheet, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import Papa from 'papaparse';
import { useRouter } from 'next/navigation';

interface CsvUploadDialogProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function CsvUploadDialog({ isOpen, onClose }: CsvUploadDialogProps) {
    const router = useRouter();
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<{ success: number; failed: number; errors: string[] } | null>(null);

    if (!isOpen) return null;

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selected = e.target.files?.[0];
        if (selected) {
            setFile(selected);
            setResult(null);
            Papa.parse(selected, {
                header: true,
                skipEmptyLines: true,
                complete: (results) => {
                    setPreview(results.data.slice(0, 5)); // Show first 5
                },
                error: (error) => {
                    console.error('CSV Error:', error);
                    alert('Failed to parse CSV');
                }
            });
        }
    };

    const handleUpload = async () => {
        if (!file) return;
        setLoading(true);

        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: async (results) => {
                try {
                    const res = await fetch('/api/products/bulk', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ products: results.data }),
                    });

                    if (!res.ok) throw new Error('Upload failed');

                    const data = await res.json();
                    setResult(data);
                    if (data.success > 0) {
                        router.refresh();
                    }
                } catch (error) {
                    console.error(error);
                    alert('Upload failed');
                } finally {
                    setLoading(false);
                }
            }
        });
    };

    const reset = () => {
        setFile(null);
        setPreview([]);
        setResult(null);
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-card w-full max-w-2xl rounded-xl shadow-lg overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="p-6 border-b flex justify-between items-center">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <FileSpreadsheet className="text-green-600" />
                        Bulk Inventory Upload
                    </h2>
                    <button onClick={onClose}><X size={20} className="text-muted-foreground hover:text-foreground" /></button>
                </div>

                <div className="p-6 space-y-6">
                    {!result ? (
                        <>
                            <div className="p-8 border-2 border-dashed rounded-xl flex flex-col items-center justify-center text-center hover:bg-muted/30 transition-colors">
                                <Upload size={40} className="text-muted-foreground mb-4" />
                                <div className="space-y-1 mb-4">
                                    <h3 className="font-medium">Upload CSV File</h3>
                                    <p className="text-xs text-muted-foreground">Headers: name, price, stock, category, customId, description</p>
                                </div>
                                <input
                                    type="file"
                                    accept=".csv"
                                    onChange={handleFileChange}
                                    className="block w-full text-sm text-slate-500
                                    file:mr-4 file:py-2 file:px-4
                                    file:rounded-full file:border-0
                                    file:text-sm file:font-semibold
                                    file:bg-primary file:text-primary-foreground
                                    hover:file:bg-primary/90"
                                />
                            </div>

                            {preview.length > 0 && (
                                <div className="space-y-2">
                                    <h4 className="text-sm font-medium">Preview (First 5 rows)</h4>
                                    <div className="border rounded-lg overflow-hidden">
                                        <table className="w-full text-xs text-left">
                                            <thead className="bg-muted">
                                                <tr>
                                                    <th className="p-2">Name</th>
                                                    <th className="p-2">Price</th>
                                                    <th className="p-2">Category</th>
                                                    <th className="p-2">Stock</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {preview.map((row, i) => (
                                                    <tr key={i} className="border-t">
                                                        <td className="p-2">{row.name}</td>
                                                        <td className="p-2">{row.price}</td>
                                                        <td className="p-2">{row.category}</td>
                                                        <td className="p-2">{row.stock}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-green-50 text-green-700 rounded-xl border border-green-200 flex items-center gap-3">
                                    <CheckCircle size={24} />
                                    <div>
                                        <div className="text-2xl font-bold">{result.success}</div>
                                        <div className="text-xs font-medium">Uploaded Successfully</div>
                                    </div>
                                </div>
                                <div className="p-4 bg-red-50 text-red-700 rounded-xl border border-red-200 flex items-center gap-3">
                                    <AlertCircle size={24} />
                                    <div>
                                        <div className="text-2xl font-bold">{result.failed}</div>
                                        <div className="text-xs font-medium">Failed</div>
                                    </div>
                                </div>
                            </div>

                            {result.errors.length > 0 && (
                                <div className="bg-muted rounded-lg p-4 text-xs font-mono max-h-40 overflow-auto">
                                    <h5 className="font-bold mb-2">Error Log:</h5>
                                    <ul className="space-y-1 text-red-600">
                                        {result.errors.map((err, i) => <li key={i}>{err}</li>)}
                                    </ul>
                                </div>
                            )}

                            <button onClick={reset} className="text-sm text-primary underline">Upload another file</button>
                        </div>
                    )}
                </div>

                <div className="p-4 border-t bg-muted/10 flex justify-end gap-3">
                    <button onClick={onClose} className="px-4 py-2 text-sm font-medium hover:bg-muted rounded-lg">Close</button>
                    {!result && (
                        <button
                            onClick={handleUpload}
                            disabled={!file || loading}
                            className="px-6 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-lg hover:bg-primary/90 disabled:opacity-50 flex items-center gap-2"
                        >
                            {loading && <Loader2 size={16} className="animate-spin" />}
                            Upload Products
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}
