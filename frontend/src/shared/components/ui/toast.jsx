import { createContext, useContext, useState, useCallback } from 'react';
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react';
import { UI } from '@/shared/constants';

const ToastContext = createContext(null);

const TYPE_ICONS = {
    success: CheckCircle,
    error: AlertCircle,
    warning: AlertTriangle,
    info: Info,
};

const TYPE_COLORS = {
    success: 'bg-green-50 text-green-800 border-green-200',
    error: 'bg-red-50 text-red-800 border-red-200',
    warning: 'bg-yellow-50 text-yellow-800 border-yellow-200',
    info: 'bg-blue-50 text-blue-800 border-blue-200',
};

const ICON_COLORS = {
    success: 'text-green-500',
    error: 'text-red-500',
    warning: 'text-yellow-500',
    info: 'text-blue-500',
};

/**
 * Toast notification system for user feedback
 */
export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([]);

    const addToast = useCallback((message, type = 'info', duration = UI.TOAST_DURATION) => {
        const id = Date.now() + Math.random();
        const Icon = TYPE_ICONS[type];

        setToasts((prev) => [
            ...prev,
            { id, message, type, Icon, duration },
        ]);

        if (duration > 0) {
            setTimeout(() => {
                removeToast(id);
            }, duration);
        }
    }, []);

    const removeToast = useCallback((id) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    const success = useCallback((message, duration) => addToast(message, 'success', duration), [addToast]);
    const error = useCallback((message, duration) => addToast(message, 'error', duration), [addToast]);
    const warning = useCallback((message, duration) => addToast(message, 'warning', duration), [addToast]);
    const info = useCallback((message, duration) => addToast(message, 'info', duration), [addToast]);

    return (
        <ToastContext.Provider value={{ addToast, success, error, warning, info, removeToast }}>
            {children}

            {/* Toast Container */}
            <div className="fixed bottom-4 right-4 z-[9999] flex flex-col gap-2 max-w-sm w-full">
                {toasts.map((toast) => {
                    const Icon = toast.Icon;
                    return (
                        <div
                            key={toast.id}
                            className={`flex items-center gap-3 p-3 rounded-lg border shadow-lg transition-all duration-300 ${TYPE_COLORS[toast.type]}`}
                            role="alert"
                            aria-live="polite"
                        >
                            <Icon className={`h-5 w-5 shrink-0 ${ICON_COLORS[toast.type]}`} />
                            <p className="flex-1 text-sm font-medium break-words">
                                {toast.message}
                            </p>
                            <button
                                onClick={() => removeToast(toast.id)}
                                className="shrink-0 hover:opacity-70"
                                aria-label="Dismiss"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>
                    );
                })}
            </div>
        </ToastContext.Provider>
    );
}

export function useToast() {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within ToastProvider');
    }
    return context;
}
