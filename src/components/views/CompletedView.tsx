import React, { useState } from 'react';
import { useTasks } from '../../context/TaskContext';
import { TaskRow } from '../tasks/TaskRow';
import { EmptyState } from '../common/EmptyState';
import { ConfirmDialog } from '../common/ConfirmDialog';
import { Archive, Trash2, CheckCircle2 } from 'lucide-react';

export const CompletedView: React.FC = () => {
  const { tasks, searchQuery, clearCompletedTasks } = useTasks();
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const completedTasks = tasks.filter((t) => {
    if (!t.completed) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return t.title.toLowerCase().includes(q) || t.description?.toLowerCase().includes(q);
    }
    return true;
  }).sort((a, b) => {
    // Most recently completed first
    const dateA = a.completedAt || a.updatedAt || '';
    const dateB = b.completedAt || b.updatedAt || '';
    return dateB.localeCompare(dateA);
  });

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#2B2D28] pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Archive className="w-4 h-4 text-[#82A88A]" />
            <span className="text-xs uppercase tracking-wider text-[#82A88A] font-semibold">
              Archive & History
            </span>
          </div>
          <h2 className="text-2xl font-medium tracking-tight text-[#F1F0EA]">
            Completed Tasks
          </h2>
          <p className="text-xs sm:text-sm text-[#92948C] mt-0.5">
            {completedTasks.length} {completedTasks.length === 1 ? 'task' : 'tasks'} marked as accomplished
          </p>
        </div>

        {completedTasks.length > 0 && (
          <button
            type="button"
            onClick={() => setIsConfirmOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#D77C76]/10 hover:bg-[#D77C76]/20 text-xs font-medium text-[#D77C76] border border-[#D77C76]/30 hover:border-[#D77C76]/50 transition-all self-start sm:self-auto shadow-sm"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Completed</span>
          </button>
        )}
      </div>

      {/* List */}
      <div className="bg-[#121312]/80 backdrop-blur-2xl border border-white/[0.08] rounded-xl overflow-hidden shadow-glass">
        {completedTasks.length === 0 ? (
          <EmptyState
            icon={CheckCircle2}
            title="No completed tasks yet"
            description="When you complete tasks from your daily focus or workspace directory, they will be archived here."
          />
        ) : (
          <div>
            {completedTasks.map((task) => (
              <TaskRow key={task.id} task={task} />
            ))}
          </div>
        )}
      </div>

      {/* Confirm Clear Modal */}
      <ConfirmDialog
        isOpen={isConfirmOpen}
        title="Clear Completed Tasks?"
        message={`Are you sure you want to permanently clear ${completedTasks.length} completed tasks from this archive? You can still undo immediately via the notification prompt.`}
        confirmLabel="Clear Archive"
        isDestructive={true}
        onConfirm={clearCompletedTasks}
        onCancel={() => setIsConfirmOpen(false)}
      />
    </div>
  );
};
