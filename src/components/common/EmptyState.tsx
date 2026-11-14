import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon,
  title,
  description,
  action,
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center max-w-sm mx-auto animate-fade-in">
      <div className="w-12 h-12 rounded-xl bg-white/[0.04] backdrop-blur-md border border-white/[0.1] shadow-glass flex items-center justify-center text-[#C5A46D] mb-4">
        <Icon className="w-5 h-5 stroke-[1.8]" />
      </div>
      <h3 className="text-base font-medium text-[#F6F5F0] mb-1.5">{title}</h3>
      <p className="text-sm text-[#9B9D95] leading-relaxed mb-6">{description}</p>
      {action && (
        <button
          type="button"
          onClick={action.onClick}
          className="inline-flex items-center justify-center px-4 py-2 text-xs font-semibold rounded-lg bg-gradient-to-r from-[#C5A46D] to-[#D4B57E] hover:brightness-110 text-[#101110] shadow-[0_2px_14px_rgba(197,164,109,0.3)] active:scale-[0.98] transition-all"
        >
          {action.label}
        </button>
      )}
    </div>
  );
};
