import React, { useEffect } from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isDestructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  isDestructive = true,
  onConfirm,
  onCancel,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') onCancel();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div 
        className="w-full max-w-md bg-[#141513]/95 backdrop-blur-2xl border border-white/[0.12] rounded-2xl p-6 shadow-modal animate-modal-in"
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
              isDestructive ? 'bg-[#D77C76]/15 text-[#D77C76] border border-[#D77C76]/30' : 'bg-[#C5A46D]/15 text-[#C5A46D] border border-[#C5A46D]/30'
            }`}>
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h3 className="text-base font-medium text-[#F6F5F0]">{title}</h3>
          </div>
          <button
            type="button"
            onClick={onCancel}
            className="text-[#9B9D95] hover:text-[#F6F5F0] p-1 rounded-md hover:bg-white/[0.05] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-sm text-[#9B9D95] leading-relaxed mb-6">
          {message}
        </p>

        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-[#9B9D95] hover:text-[#F6F5F0] bg-transparent hover:bg-white/[0.05] border border-white/[0.08] rounded-lg transition-colors"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm();
              onCancel();
            }}
            className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all shadow-sm ${
              isDestructive
                ? 'bg-gradient-to-r from-[#D77C76] to-[#E48F89] text-[#101110] hover:brightness-110 shadow-[0_2px_12px_rgba(215,124,118,0.3)]'
                : 'bg-gradient-to-r from-[#C5A46D] to-[#D4B57E] text-[#101110] hover:brightness-110 shadow-[0_2px_12px_rgba(197,164,109,0.3)]'
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};
