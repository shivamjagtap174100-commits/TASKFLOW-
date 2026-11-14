import React from 'react';
import type { Category } from '../../types/task';

interface CategoryBadgeProps {
  category: Category;
  size?: 'sm' | 'md';
}

export const CategoryBadge: React.FC<CategoryBadgeProps> = ({
  category,
  size = 'md',
}) => {
  const configs: Record<Category, { dot: string; text: string; bg: string; border: string }> = {
    Work: {
      dot: 'bg-[#C5A46D] shadow-[0_0_5px_#C5A46D]',
      text: 'text-[#EFE7D8]',
      bg: 'bg-[#C5A46D]/10 backdrop-blur-sm',
      border: 'border-[#C5A46D]/25 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)]',
    },
    Study: {
      dot: 'bg-[#82A88A] shadow-[0_0_5px_#82A88A]',
      text: 'text-[#DCEAE0]',
      bg: 'bg-[#82A88A]/10 backdrop-blur-sm',
      border: 'border-[#82A88A]/25 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)]',
    },
    Personal: {
      dot: 'bg-[#B099D6] shadow-[0_0_5px_#B099D6]',
      text: 'text-[#EAE3F5]',
      bg: 'bg-[#B099D6]/10 backdrop-blur-sm',
      border: 'border-[#B099D6]/25 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)]',
    },
    Other: {
      dot: 'bg-[#9B9D95]',
      text: 'text-[#D8D9D4]',
      bg: 'bg-white/[0.04] backdrop-blur-sm',
      border: 'border-white/[0.08] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)]',
    },
  };

  const config = configs[category] || configs.Other;
  const sizeClasses = size === 'sm' ? 'text-[11px] px-2 py-0.5' : 'text-xs px-2.5 py-0.5';

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-md border ${config.bg} ${config.text} ${config.border} ${sizeClasses}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      <span>{category}</span>
    </span>
  );
};
