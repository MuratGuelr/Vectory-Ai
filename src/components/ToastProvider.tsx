'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle, AlertCircle, X, Info } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  showToast: (message: string, type: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (message: string, type: ToastType) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => removeToast(id), 3000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-[9999] flex flex-col gap-2">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 20, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 20, scale: 0.9 }}
              className={`min-w-[300px] p-4 rounded-xl shadow-2xl border flex items-center gap-3 backdrop-blur-md ${
                toast.type === 'success' 
                  ? 'bg-emerald-950/80 border-emerald-500/30 text-emerald-100' 
                  : toast.type === 'error'
                  ? 'bg-red-950/80 border-red-500/30 text-red-100'
                  : 'bg-slate-900/80 border-slate-700 text-slate-100'
              }`}
            >
                {toast.type === 'success' && <CheckCircle size={20} className="text-emerald-400" />}
                {toast.type === 'error' && <AlertCircle size={20} className="text-red-400" />}
                {toast.type === 'info' && <Info size={20} className="text-blue-400" />}
                <p className="text-sm font-medium flex-1">{toast.message}</p>
                <button onClick={() => removeToast(toast.id)} className="opacity-50 hover:opacity-100">
                    <X size={16} />
                </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within a ToastProvider');
  return context;
};
