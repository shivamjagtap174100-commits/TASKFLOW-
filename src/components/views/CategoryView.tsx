import React from 'react';
import { useTasks } from '../../context/TaskContext';
import { TaskRow } from '../tasks/TaskRow';
import { EmptyState } from '../common/EmptyState';
import { CategoryBadge } from '../common/CategoryBadge';
import { Plus, Folder } from 'lucide-react';
import type { Category } from '../../types/task';

export const CategoryView: React.FC = () => {
  const { tasks, selectedCategory, searchQuery, openCreateModal } = useTasks();

  const currentCategory: Category = selectedCategory || 'Work';

  const categoryTasks = tasks.filter((t) => {
    if (t.category !== currentCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return t.title.toLowerCase().includes(q) || t.description?.toLowerCase().includes(q);
    }
    return true;
  }).sort((a, b) => {
    if (a.completed !== b.completed) return a.completed ? 1 : -1;
    return a.dueDate.localeCompare(b.dueDate);
  });

  const categoryDescriptions: Record<Category, string> = {
    Work: 'Professional deliverables, engineering architecture, and organizational milestones.',
    Personal: 'Wellbeing, family, personal health routines, and life logistics.',
    Study: 'Academic research, reading notes, paper reviews, and learning objectives.',
    Other: 'Administrative tasks, financial filings, and miscellaneous errands.',
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#2B2D28] pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <CategoryBadge category={currentCategory} size="sm" />
            <span className="text-xs uppercase tracking-wider text-[#92948C] font-semibold">
              Category
            </span>
          </div>
          <h2 className="text-2xl font-medium tracking-tight text-[#F1F0EA]">
            {currentCategory}
          </h2>
          <p className="text-xs sm:text-sm text-[#92948C] mt-0.5">
            {categoryDescriptions[currentCategory]}
          </p>
        </div>

        <button
          type="button"
          onClick={() => openCreateModal(currentCategory)}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-xs font-medium text-[#F6F5F0] border border-white/[0.1] shadow-sm hover:border-[#C5A46D]/60 transition-all self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5 text-[#C5A46D]" />
          <span>New {currentCategory} Task</span>
        </button>
      </div>

      {/* Task List */}
      <div className="bg-[#121312]/80 backdrop-blur-2xl border border-white/[0.08] rounded-xl overflow-hidden shadow-glass">
        {categoryTasks.length === 0 ? (
          <EmptyState
            icon={Folder}
            title={`No ${currentCategory} tasks`}
            description={`You don't have any tasks categorized under ${currentCategory}. Create one to keep this stream organized.`}
            action={{
              label: `Add ${currentCategory} task`,
              onClick: () => openCreateModal(currentCategory)
            }}
          />
        ) : (
          <div>
            {categoryTasks.map((task) => (
              <TaskRow key={task.id} task={task} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
