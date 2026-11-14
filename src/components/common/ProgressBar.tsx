import React from 'react';

interface ProgressBarProps {
  percentage: number;
  height?: string;
  showText?: boolean;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  percentage,
  height = 'h-1.5',
  showText = false,
}) => {
  const clamped = Math.min(100, Math.max(0, percentage));

  return (
    <div className="w-full">
      {showText && (
        <div className="flex justify-between items-center text-xs text-[#92948C] mb-1.5 font-medium">
          <span className="uppercase tracking-wider text-[10px]">Progress</span>
          <span className="font-mono text-[#F1F0EA]">{clamped}%</span>
        </div>
      )}
      <div className={`w-full bg-[#1B1C19] border border-[#2B2D28] rounded-full overflow-hidden ${height}`}>
        <div
          className="h-full bg-[#C5A46D] transition-all duration-500 ease-out rounded-full"
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
};
