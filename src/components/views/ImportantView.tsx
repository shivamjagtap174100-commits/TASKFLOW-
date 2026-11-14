import React from 'react';
import { useTasks } from '../../context/TaskContext';
import { TaskRow } from '../tasks/TaskRow';
import { EmptyState } from '../common/EmptyState';
import { Star, Plus } from 'lucide-react';

export const ImportantView: React.FC = () => {
  const { tasks, searchQuery, openCreateModal } = useTasks();

  const importantTasks = tasks.filter((t) => {
    const isImportant = t.important || t.priority === 'high';
    if (!isImportant) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return t.title.toLowerCase().includes(q) || t.description?.toLowerCase().includes(q);
    }
    return true;
  }).sort((a, b) => {
    // Incomplete first, then by priority/due date
    if (a.completed !== b.completed) return a.completed ? 1 : -1;
    return a.dueDate.localeCompare(b.dueDate);
  });

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#2B2D28] pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Star className="w-4 h-4 text-[#C5A46D] fill-[#C5A46D]" />
            <span className="text-xs uppercase tracking-wider text-[#C5A46D] font-semibold">
              High Impact Items
            </span>
          </div>
          <h2 className="text-2xl font-medium tracking-tight text-[#F1F0EA]">
            Important & High Priority
          </h2>
          <p className="text-xs sm:text-sm text-[#92948C] mt-0.5">
            Key priorities and starred items requiring dedicated attention ({importantTasks.length})
          </p>
        </div>

        <button
          type="button"
          onClick={() => openCreateModal()}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-gradient-to-r from-[#C5A46D] to-[#D4B57E] text-xs font-semibold text-[#101110] transition-all self-start sm:self-auto shadow-[0_2px_12px_rgba(197,164,109,0.3)] active:scale-[0.98]"
        >
          <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>Add Priority Task</span>
        </button>
      </div>

      {/* List */}
      <div className="bg-[#121312]/80 backdrop-blur-2xl border border-white/[0.08] rounded-xl overflow-hidden shadow-glass">
        {importantTasks.length === 0 ? (
          <EmptyState
            icon={Star}
            title="No important tasks"
            description="Star any task or mark its priority as High to elevate it to your important focus list."
            action={{
              label: "Create high priority task",
              onClick: () => openCreateModal()
            }}
          />
        ) : (
          <div>
            {importantTasks.map((task) => (
              <TaskRow key={task.id} task={task} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
