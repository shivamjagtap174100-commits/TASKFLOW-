import React from 'react';
import { useTasks } from '../../context/TaskContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useTasks();

  if (toasts.length === 0) return null;

  return (
    <aside aria-label="Notifications" className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        const icons = {
          success: <CheckCircle2 className="w-4 h-4 text-[#82A88A] shrink-0" />,
          danger: <AlertCircle className="w-4 h-4 text-[#D77C76] shrink-0" />,
          info: <Info className="w-4 h-4 text-[#C5A46D] shrink-0" />,
        };

        return (
          <div
            key={toast.id}
            role="status"
            className="pointer-events-auto flex items-center justify-between gap-3 p-3.5 bg-[#141513]/90 backdrop-blur-2xl border border-white/[0.12] rounded-xl shadow-glass animate-fade-in text-sm text-[#F6F5F0]"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              {icons[toast.type]}
              <span className="truncate text-xs sm:text-sm font-medium">{toast.message}</span>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {toast.action && (
                <button
                  type="button"
                  onClick={() => {
                    toast.action?.onClick();
                    removeToast(toast.id);
                  }}
                  className="text-xs font-semibold text-[#C5A46D] hover:underline px-1.5 py-0.5 rounded transition-colors"
                >
                  {toast.action.label}
                </button>
              )}
              <button
                type="button"
                onClick={() => removeToast(toast.id)}
                className="text-[#92948C] hover:text-[#F1F0EA] p-0.5 transition-colors"
                title="Dismiss"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        );
      })}
    </aside>
  );
};
