import React from 'react';
import type { Priority } from '../../types/task';

interface PriorityBadgeProps {
  priority: Priority;
  size?: 'sm' | 'md';
  showLabel?: boolean;
}

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({
  priority,
  size = 'md',
  showLabel = true,
}) => {
  const configs = {
    high: {
      label: 'High',
      dotColor: 'bg-[#D77C76] shadow-[0_0_6px_#D77C76]',
      textColor: 'text-[#E8928D]',
      bg: 'bg-[#D77C76]/12 backdrop-blur-sm',
      border: 'border-[#D77C76]/30 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08)]',
    },
    medium: {
      label: 'Medium',
      dotColor: 'bg-[#C5A46D] shadow-[0_0_6px_#C5A46D]',
      textColor: 'text-[#DFBF87]',
      bg: 'bg-[#C5A46D]/12 backdrop-blur-sm',
      border: 'border-[#C5A46D]/30 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08)]',
    },
    low: {
      label: 'Low',
      dotColor: 'bg-[#82A88A] shadow-[0_0_6px_#82A88A]',
      textColor: 'text-[#9BC2A3]',
      bg: 'bg-[#82A88A]/12 backdrop-blur-sm',
      border: 'border-[#82A88A]/30 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08)]',
    },
  };

  const config = configs[priority] || configs.medium;

  if (!showLabel) {
    return (
      <span
        title={`Priority: ${config.label}`}
        className={`inline-block w-2 h-2 rounded-full ${config.dotColor}`}
      />
    );
  }

  const sizeClasses = size === 'sm' 
    ? 'text-[11px] px-2 py-0.5 tracking-wider' 
    : 'text-xs px-2.5 py-1 tracking-wider';

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded border ${config.bg} ${config.textColor} ${config.border} ${sizeClasses}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dotColor}`} />
      <span>{config.label}</span>
    </span>
  );
};
