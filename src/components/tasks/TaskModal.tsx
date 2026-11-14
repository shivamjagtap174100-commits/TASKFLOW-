import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useTasks } from '../../context/TaskContext';
import type { Priority, Category } from '../../types/task';
import { getTodayString } from '../../utils/dateUtils';
import { X, Calendar, Clock, AlertCircle } from 'lucide-react';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CATEGORIES: Category[] = ['Work', 'Personal', 'Study', 'Other'];
const PRIORITIES: { id: Priority; label: string; dot: string }[] = [
  { id: 'low', label: 'Low', dot: 'bg-[#82A88A]' },
  { id: 'medium', label: 'Medium', dot: 'bg-[#C5A46D]' },
  { id: 'high', label: 'High', dot: 'bg-[#D77C76]' },
];

export const TaskModal: React.FC<TaskModalProps> = ({ isOpen, onClose }) => {
  const { addTask, updateTask, editingTask, selectedCategory, modalDefaults } = useTasks();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<Category>('Work');
  const [priority, setPriority] = useState<Priority>('medium');
  const [dueDate, setDueDate] = useState(getTodayString());
  const [dueTime, setDueTime] = useState('12:00');
  const [error, setError] = useState<string | null>(null);

  const titleInputRef = useRef<HTMLInputElement>(null);

  // Populate fields when editing or opening
  useEffect(() => {
    if (isOpen) {
      if (editingTask) {
        setTitle(editingTask.title);
        setDescription(editingTask.description || '');
        setCategory(editingTask.category);
        setPriority(editingTask.priority);
        setDueDate(editingTask.dueDate);
        setDueTime(editingTask.dueTime || '12:00');
      } else {
        setTitle('');
        setDescription('');
        setCategory(modalDefaults.category || selectedCategory || 'Work');
        setPriority('medium');
        setDueDate(modalDefaults.date || getTodayString());
        setDueTime('12:00');
      }
      setError(null);
      // Auto focus title input
      const timer = setTimeout(() => {
        titleInputRef.current?.focus();
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isOpen, editingTask, selectedCategory, modalDefaults.category, modalDefaults.date]);

  const handleSubmit = useCallback((e?: React.FormEvent) => {
    if (e) e.preventDefault();

    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      setError('Please provide a title for the task');
      titleInputRef.current?.focus();
      return;
    }

    if (!dueDate) {
      setError('Please select a due date');
      return;
    }

    if (editingTask) {
      updateTask(editingTask.id, {
        title: trimmedTitle,
        description: description.trim() || undefined,
        category,
        priority,
        dueDate,
        dueTime: dueTime || undefined,
      });
    } else {
      addTask({
        title: trimmedTitle,
        description: description.trim() || undefined,
        category,
        priority,
        dueDate,
        dueTime: dueTime || undefined,
        completed: false,
        important: priority === 'high',
      });
    }

    onClose();
  }, [title, dueDate, editingTask, updateTask, description, category, priority, dueTime, addTask, onClose]);

  // Handle keyboard shortcuts (Esc to close, Cmd/Ctrl + Enter to submit)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') {
        onClose();
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        handleSubmit();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, handleSubmit]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div 
        className="w-full max-w-lg bg-[#141513]/95 backdrop-blur-2xl border border-white/[0.12] rounded-2xl shadow-modal animate-modal-in overflow-hidden my-8"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.08] bg-white/[0.02]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#C5A46D] shadow-[0_0_8px_#C5A46D]" />
            <h2 className="text-base font-medium text-[#F6F5F0]">
              {editingTask ? 'Edit Task' : 'New Task'}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-[#9B9D95] hover:text-[#F6F5F0] p-1.5 rounded-lg hover:bg-white/[0.05] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="flex items-center gap-2 p-3 text-xs text-[#D77C76] bg-[#D77C76]/12 border border-[#D77C76]/30 rounded-lg">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-xs uppercase tracking-wider text-[#9B9D95] font-semibold mb-1.5">
              Task Title <span className="text-[#D77C76]">*</span>
            </label>
            <input
              ref={titleInputRef}
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (error) setError(null);
              }}
              placeholder="e.g., Review technical specification document"
              className="w-full bg-white/[0.035] hover:bg-white/[0.05] border border-white/[0.09] rounded-lg px-3.5 py-2.5 text-sm text-[#F6F5F0] placeholder-[#9B9D95]/45 focus:outline-none focus:border-[#C5A46D]/80 focus:ring-2 focus:ring-[#C5A46D]/20 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)] transition-all"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs uppercase tracking-wider text-[#9B9D95] font-semibold mb-1.5">
              Description <span className="text-[#9B9D95]/60 text-[10px] lowercase">(optional)</span>
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add key context, checklists, or reference links..."
              className="w-full bg-white/[0.035] hover:bg-white/[0.05] border border-white/[0.09] rounded-lg px-3.5 py-2.5 text-sm text-[#F6F5F0] placeholder-[#9B9D95]/45 focus:outline-none focus:border-[#C5A46D]/80 focus:ring-2 focus:ring-[#C5A46D]/20 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)] transition-all resize-none leading-relaxed"
            />
          </div>

          {/* Category & Priority grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Category */}
            <div>
              <label className="block text-xs uppercase tracking-wider text-[#9B9D95] font-semibold mb-1.5">
                Category
              </label>
              <div className="grid grid-cols-2 gap-1.5 bg-black/40 p-1.5 border border-white/[0.08] rounded-lg">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategory(cat)}
                    className={`py-1.5 px-2 text-xs font-medium rounded-md text-center transition-all ${
                      category === cat
                        ? 'bg-white/[0.12] text-[#F6F5F0] shadow-sm'
                        : 'text-[#9B9D95] hover:text-[#F6F5F0] hover:bg-white/[0.04]'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Priority */}
            <div>
              <label className="block text-xs uppercase tracking-wider text-[#9B9D95] font-semibold mb-1.5">
                Priority
              </label>
              <div className="grid grid-cols-3 gap-1.5 bg-black/40 p-1.5 border border-white/[0.08] rounded-lg">
                {PRIORITIES.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setPriority(p.id)}
                    className={`flex items-center justify-center gap-1.5 py-1.5 px-2 text-xs font-medium rounded-md transition-all ${
                      priority === p.id
                        ? 'bg-white/[0.12] text-[#F6F5F0] shadow-sm'
                        : 'text-[#9B9D95] hover:text-[#F6F5F0] hover:bg-white/[0.04]'
                    }`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${p.dot}`} />
                    <span>{p.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            {/* Due Date */}
            <div>
              <label className="block text-xs uppercase tracking-wider text-[#9B9D95] font-semibold mb-1.5">
                Due Date
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-2.5 w-4 h-4 text-[#9B9D95] pointer-events-none" />
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full bg-white/[0.035] hover:bg-white/[0.05] border border-white/[0.09] rounded-lg pl-9 pr-3 py-2 text-xs sm:text-sm text-[#F6F5F0] focus:outline-none focus:border-[#C5A46D]/80 focus:ring-2 focus:ring-[#C5A46D]/20 transition-all font-mono shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)]"
                />
              </div>
            </div>

            {/* Due Time */}
            <div>
              <label className="block text-xs uppercase tracking-wider text-[#9B9D95] font-semibold mb-1.5">
                Due Time
              </label>
              <div className="relative">
                <Clock className="absolute left-3 top-2.5 w-4 h-4 text-[#9B9D95] pointer-events-none" />
                <input
                  type="time"
                  value={dueTime}
                  onChange={(e) => setDueTime(e.target.value)}
                  className="w-full bg-white/[0.035] hover:bg-white/[0.05] border border-white/[0.09] rounded-lg pl-9 pr-3 py-2 text-xs sm:text-sm text-[#F6F5F0] focus:outline-none focus:border-[#C5A46D]/80 focus:ring-2 focus:ring-[#C5A46D]/20 transition-all font-mono shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)]"
                />
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-between pt-4 mt-2 border-t border-white/[0.08]">
            <div className="hidden sm:block text-[11px] text-[#9B9D95]/70">
              Press <kbd className="px-1.5 py-0.5 bg-black/40 border border-white/[0.1] rounded font-mono text-[10px]">⌘</kbd> + <kbd className="px-1.5 py-0.5 bg-black/40 border border-white/[0.1] rounded font-mono text-[10px]">Enter</kbd> to save
            </div>

            <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs sm:text-sm font-medium text-[#9B9D95] hover:text-[#F6F5F0] bg-transparent hover:bg-white/[0.05] border border-white/[0.08] rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg bg-gradient-to-r from-[#C5A46D] to-[#D4B57E] hover:brightness-110 text-[#101110] transition-all shadow-[0_2px_14px_rgba(197,164,109,0.35)] active:scale-[0.98]"
              >
                {editingTask ? 'Save Changes' : 'Save Task'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
