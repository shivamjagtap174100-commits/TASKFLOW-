import React, { useState, useRef, useEffect } from 'react';
import type { Task } from '../../types/task';
import { useTasks } from '../../context/TaskContext';
import { PriorityBadge } from '../common/PriorityBadge';
import { CategoryBadge } from '../common/CategoryBadge';
import { formatDueText } from '../../utils/dateUtils';
import { 
  Star, 
  MoreHorizontal, 
  Clock, 
  Trash2, 
  Edit3, 
  Copy, 
  ChevronDown, 
  ChevronUp, 
  Check 
} from 'lucide-react';

interface TaskRowProps {
  task: Task;
  onEdit?: (task: Task) => void;
  showDueDate?: boolean;
}

export const TaskRow: React.FC<TaskRowProps> = ({
  task,
  onEdit,
  showDueDate = true,
}) => {
  const { 
    toggleTaskComplete, 
    toggleTaskImportant, 
    deleteTask, 
    duplicateTask,
    openEditModal 
  } = useTasks();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    if (isMenuOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [isMenuOpen]);

  const { text: dueText, isOverdue, isToday } = formatDueText(task.dueDate, task.dueTime);

  const handleEdit = () => {
    setIsMenuOpen(false);
    if (onEdit) {
      onEdit(task);
    } else {
      openEditModal(task);
    }
  };

  return (
    <div 
      className={`group relative border-b border-white/[0.05] transition-all duration-150 ${
        task.completed 
          ? 'bg-transparent hover:bg-white/[0.02]' 
          : 'hover:bg-white/[0.035]'
      }`}
    >
      <div className="flex items-center gap-3 py-3 px-3 sm:px-4">
        {/* Custom Minimalist Checkbox */}
        <button
          type="button"
          onClick={() => toggleTaskComplete(task.id)}
          aria-label={task.completed ? 'Mark task as incomplete' : 'Mark task as complete'}
          className={`relative w-4.5 h-4.5 rounded-md flex items-center justify-center transition-all duration-200 shrink-0 ${
            task.completed
              ? 'bg-[#82A88A] border-[#82A88A] text-[#101110] shadow-[0_0_10px_rgba(130,168,138,0.45)]'
              : 'border border-white/20 hover:border-[#C5A46D] bg-white/[0.03] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08)]'
          }`}
          style={{ width: '18px', height: '18px' }}
        >
          {task.completed && (
            <Check className="w-3.5 h-3.5 stroke-[3] text-[#101110] animate-fade-in" />
          )}
        </button>

        {/* Star / Important button */}
        <button
          type="button"
          onClick={() => toggleTaskImportant(task.id)}
          aria-label={task.important ? 'Remove from important' : 'Mark as important'}
          className={`shrink-0 transition-colors p-0.5 rounded ${
            task.important
              ? 'text-[#C5A46D] hover:text-[#D4B57E] shadow-[0_0_8px_rgba(197,164,109,0.3)]'
              : 'text-[#9B9D95]/40 hover:text-[#9B9D95] opacity-0 group-hover:opacity-100 focus:opacity-100'
          }`}
        >
          <Star className={`w-4 h-4 ${task.important ? 'fill-[#C5A46D]' : ''}`} />
        </button>

        {/* Task Title & Details */}
        <div 
          className="flex-1 min-w-0 cursor-pointer select-none"
          onClick={() => {
            if (task.description) {
              setIsExpanded(!isExpanded);
            } else {
              handleEdit();
            }
          }}
        >
          <div className="flex items-center gap-2">
            <span
              className={`text-sm tracking-normal transition-all duration-200 line-clamp-1 ${
                task.completed
                  ? 'text-[#9B9D95] line-through font-normal'
                  : 'text-[#F6F5F0] font-normal group-hover:text-white'
              }`}
            >
              {task.title}
            </span>

            {task.description && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsExpanded(!isExpanded);
                }}
                className="text-[#9B9D95]/60 hover:text-[#9B9D95] p-0.5"
                title={isExpanded ? 'Hide description' : 'Show description'}
              >
                {isExpanded ? (
                  <ChevronUp className="w-3 h-3" />
                ) : (
                  <ChevronDown className="w-3 h-3" />
                )}
              </button>
            )}
          </div>
        </div>

        {/* Badges & Meta */}
        <div className="hidden sm:flex items-center gap-2 shrink-0">
          <CategoryBadge category={task.category} size="sm" />
          <PriorityBadge priority={task.priority} size="sm" />

          {/* Due time/date indicator */}
          {showDueDate && dueText && (
            <div
              className={`flex items-center gap-1 text-xs font-mono tracking-tight px-2 py-0.5 rounded-md border ${
                task.completed
                  ? 'text-[#9B9D95]/70 border-transparent bg-transparent'
                  : isOverdue
                  ? 'text-[#D77C76] bg-[#D77C76]/10 border-[#D77C76]/25 font-medium'
                  : isToday
                  ? 'text-[#C5A46D] bg-[#C5A46D]/10 border-[#C5A46D]/25'
                  : 'text-[#9B9D95] bg-white/[0.03] border-white/[0.06]'
              }`}
              title={`Due: ${task.dueDate} ${task.dueTime || ''}`}
            >
              <Clock className="w-3 h-3 stroke-[1.75]" />
              <span>{dueText}</span>
            </div>
          )}
        </div>

        {/* Contextual Action Menu */}
        <div className="relative shrink-0" ref={menuRef}>
          <button
            type="button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Task options"
            className="p-1 rounded text-[#9B9D95] hover:text-[#F6F5F0] hover:bg-white/[0.05] transition-colors"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>

          {isMenuOpen && (
            <div className="absolute right-0 top-full mt-1.5 w-44 bg-[#141513]/95 backdrop-blur-2xl border border-white/[0.12] rounded-xl shadow-dropdown py-1.5 z-30 animate-fade-in text-xs">
              <button
                type="button"
                onClick={handleEdit}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-left text-[#F6F5F0] hover:bg-white/[0.05] hover:text-[#C5A46D] transition-colors"
              >
                <Edit3 className="w-3.5 h-3.5 text-[#9B9D95]" />
                <span>Edit details</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  toggleTaskImportant(task.id);
                  setIsMenuOpen(false);
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-left text-[#F6F5F0] hover:bg-white/[0.05] transition-colors"
              >
                <Star className={`w-3.5 h-3.5 ${task.important ? 'text-[#C5A46D] fill-[#C5A46D]' : 'text-[#9B9D95]'}`} />
                <span>{task.important ? 'Remove important' : 'Mark important'}</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  duplicateTask(task.id);
                  setIsMenuOpen(false);
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-left text-[#F6F5F0] hover:bg-white/[0.05] transition-colors"
              >
                <Copy className="w-3.5 h-3.5 text-[#9B9D95]" />
                <span>Duplicate</span>
              </button>
              <div className="my-1 border-t border-white/[0.07]" />
              <button
                type="button"
                onClick={() => {
                  deleteTask(task.id);
                  setIsMenuOpen(false);
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-left text-[#D77C76] hover:bg-[#D77C76]/15 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete task</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Meta Row for Small Screens */}
      <div className="flex sm:hidden items-center gap-2 px-3 pb-2.5 -mt-1 text-[11px] text-[#9B9D95]">
        <CategoryBadge category={task.category} size="sm" />
        <PriorityBadge priority={task.priority} size="sm" />
        {showDueDate && dueText && (
          <span className={`font-mono ${isOverdue ? 'text-[#D77C76]' : isToday ? 'text-[#C5A46D]' : ''}`}>
            {dueText}
          </span>
        )}
      </div>

      {/* Expanded Description Accordion */}
      {isExpanded && task.description && (
        <div className="px-10 pb-3.5 text-xs text-[#9B9D95] leading-relaxed border-t border-white/[0.05] pt-2 animate-fade-in bg-white/[0.01]">
          <p className="whitespace-pre-wrap">{task.description}</p>
        </div>
      )}
    </div>
  );
};
