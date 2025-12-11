'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import { useAuth } from '@/components/AuthProvider';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { Check, Copy } from 'lucide-react';

export default function AdminPage() {
  const { user } = useAuth();
  const [generatedKey, setGeneratedKey] = useState<string | null>(null);
  const [credits, setCredits] = useState(50);
  const [loading, setLoading] = useState(false);

  const generateKey = async () => {
    setLoading(true);
    try {
        const key = `VECTORY-PRO-${Math.random().toString(36).substring(2, 8).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
        
        // Save to Firestore
        await addDoc(collection(db, 'license_keys'), {
            key: key,
            credits: credits,
            status: 'active', // active, used
            createdAt: serverTimestamp(),
            createdBy: user?.uid
        });

        setGeneratedKey(key);
    } catch (error) {
        console.error("Error generating key:", error);
    } finally {
        setLoading(false);
    }
  };

  if (!user) return <div className="p-10 text-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <div className="flex-1 p-10 max-w-4xl mx-auto w-full">
        <h1 className="text-3xl font-bold text-white mb-8">Admin Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Generator Card */}
            <div className="bg-slate-900 border border-slate-700 rounded-xl p-6">
                <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                    Generate License Key
                </h2>
                
                <div className="space-y-4 mb-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-2">Credit Amount</label>
                        <select 
                            value={credits}
                            onChange={(e) => setCredits(parseInt(e.target.value))}
                            className="w-full bg-slate-800 border-none rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500"
                        >
                            <option value={10}>10 Credits</option>
                            <option value={50}>50 Credits</option>
                            <option value={100}>100 Credits</option>
                            <option value={500}>500 Credits</option>
                            <option value={999999}>Unlimited (Dev)</option>
                        </select>
                    </div>
                </div>

                <button 
                    onClick={generateKey}
                    disabled={loading}
                    className="w-full py-3 bg-blue-600 hover:bg-blue-500 rounded-lg font-semibold text-white transition-colors"
                >
                    {loading ? 'Generating...' : 'Generate New Key'}
                </button>

                {generatedKey && (
                    <div className="mt-8 p-4 bg-emerald-900/20 border border-emerald-500/30 rounded-lg">
                        <p className="text-xs text-emerald-400 mb-2 font-medium uppercase tracking-wide">Successfully Generated</p>
                        <div className="flex items-center justify-between gap-4">
                            <code className="text-lg font-mono text-white tracking-wide">{generatedKey}</code>
                            <button 
                                onClick={() => navigator.clipboard.writeText(generatedKey)}
                                className="p-2 hover:bg-emerald-900/50 rounded text-emerald-400"
                                title="Copy"
                            >
                                <Copy size={16} />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Stats or History (Placeholder) */}
            <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 opacity-50 pointer-events-none">
                <h2 className="text-xl font-semibold mb-6">Recent Keys</h2>
                <div className="space-y-3">
                    <div className="h-12 bg-slate-800 rounded-lg w-full"></div>
                    <div className="h-12 bg-slate-800 rounded-lg w-full"></div>
                    <div className="h-12 bg-slate-800 rounded-lg w-full"></div>
                </div>
                <p className="text-center text-sm text-slate-500 mt-6">Analytics coming later</p>
            </div>
        </div>
      </div>
    </div>
  );
}
