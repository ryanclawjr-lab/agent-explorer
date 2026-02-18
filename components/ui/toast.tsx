'use client';

import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
  onClose?: () => void;
}

const icons = {
  success: CheckCircle,
  error: AlertCircle,
  info: Info,
  warning: AlertTriangle
};

const styles = {
  success: 'bg-emerald-500/20 border-emerald-500/30 text-emerald-400',
  error: 'bg-red-500/20 border-red-500/30 text-red-400',
  info: 'bg-blue-500/20 border-blue-500/30 text-blue-400',
  warning: 'bg-amber-500/20 border-amber-500/30 text-amber-400'
};

export function Toast({ id, message, type, onClose }: Toast) {
  const Icon = icons[type];
  
  return (
    <div className={`flex items-center gap-3 px-4 py-3 rounded-lg border shadow-lg animate-slide-in ${styles[type]}`}>
      <Icon className="w-5 h-5 flex-shrink-0" />
      <p className="text-sm font-medium flex-1">{message}</p>
      {onClose && (
        <button 
          onClick={onClose}
          className="hover:opacity-70 transition-opacity"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
