import React, { useRef, useEffect } from 'react';
import { Search, X } from 'lucide-react';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  autoFocus?: boolean;
}

export const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChange,
  placeholder = 'Search tasks or press / to focus...',
  autoFocus = false,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // If pressing '/' when not already in an input/textarea
      if (
        e.key === '/' &&
        document.activeElement?.tagName !== 'INPUT' &&
        document.activeElement?.tagName !== 'TEXTAREA'
      ) {
        e.preventDefault();
        inputRef.current?.focus();
      }
      if (e.key === 'Escape' && document.activeElement === inputRef.current) {
        inputRef.current?.blur();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="relative flex items-center w-full max-w-md">
      <Search className="absolute left-3 w-4 h-4 text-[#9B9D95] pointer-events-none" />
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoFocus={autoFocus}
        className="w-full bg-white/[0.035] hover:bg-white/[0.055] border border-white/[0.09] rounded-lg pl-9 pr-14 py-1.5 text-sm text-[#F6F5F0] placeholder-[#9B9D95]/50 focus:outline-none focus:border-[#C5A46D]/80 focus:ring-2 focus:ring-[#C5A46D]/20 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)] transition-all"
      />
      <div className="absolute right-2.5 flex items-center gap-1">
        {value ? (
          <button
            type="button"
            onClick={() => onChange('')}
            className="p-1 text-[#9B9D95] hover:text-[#F6F5F0] transition-colors"
            title="Clear search"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        ) : (
          <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono text-[#9B9D95] bg-white/[0.06] border border-white/[0.1] rounded">
            /
          </kbd>
        )}
      </div>
    </div>
  );
};
