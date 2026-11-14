import React, { useState, useMemo } from 'react';
import { useTasks } from '../../context/TaskContext';
import { TaskRow } from '../tasks/TaskRow';
import { EmptyState } from '../common/EmptyState';
import type { Category, Priority, SortField, SortOrder } from '../../types/task';
import { Plus, CheckSquare } from 'lucide-react';

const CATEGORIES: ('All' | Category)[] = ['All', 'Work', 'Personal', 'Study', 'Other'];

export const MyTasksView: React.FC = () => {
  const { 
    tasks, 
    searchQuery, 
    openCreateModal,
    statusFilter,
    setStatusFilter,
    priorityFilter,
    setPriorityFilter 
  } = useTasks();

  const [activeCategory, setActiveCategory] = useState<'All' | Category>('All');
  const [sortField, setSortField] = useState<SortField>('dueDate');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

  // Filtered & Sorted tasks
  const filteredTasks = useMemo(() => {
    return tasks
      .filter((t) => {
        // Status filter
        if (statusFilter === 'incomplete' && t.completed) return false;
        if (statusFilter === 'completed' && !t.completed) return false;

        // Category filter
        if (activeCategory !== 'All' && t.category !== activeCategory) return false;

        // Priority filter
        if (priorityFilter !== 'all' && t.priority !== priorityFilter) return false;

        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = t.title.toLowerCase().includes(q);
          const matchDesc = t.description?.toLowerCase().includes(q);
          const matchCat = t.category.toLowerCase().includes(q);
          if (!matchTitle && !matchDesc && !matchCat) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortField === 'dueDate') {
          const cmp = a.dueDate.localeCompare(b.dueDate);
          return sortOrder === 'asc' ? cmp : -cmp;
        }
        if (sortField === 'priority') {
          const weights: Record<Priority, number> = { high: 3, medium: 2, low: 1 };
          const diff = weights[b.priority] - weights[a.priority];
          return sortOrder === 'asc' ? diff : -diff;
        }
        if (sortField === 'title') {
          const cmp = a.title.localeCompare(b.title);
          return sortOrder === 'asc' ? cmp : -cmp;
        }
        if (sortField === 'createdAt') {
          const cmp = a.createdAt.localeCompare(b.createdAt);
          return sortOrder === 'asc' ? -cmp : cmp;
        }
        return 0;
      });
  }, [tasks, statusFilter, activeCategory, priorityFilter, searchQuery, sortField, sortOrder]);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* View Header & Meta */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#2B2D28] pb-5">
        <div>
          <h2 className="text-xl sm:text-2xl font-medium tracking-tight text-[#F1F0EA]">
            All Tasks
          </h2>
          <p className="text-xs sm:text-sm text-[#92948C] mt-0.5">
            Complete workspace task directory ({filteredTasks.length} {filteredTasks.length === 1 ? 'task' : 'tasks'})
          </p>
        </div>

        {/* Top Action */}
        <button
          type="button"
          onClick={() => openCreateModal(activeCategory === 'All' ? undefined : activeCategory)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-xs font-medium text-[#F6F5F0] border border-white/[0.1] shadow-sm hover:border-[#C5A46D]/60 transition-all self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5 text-[#C5A46D]" />
          <span>New Task</span>
        </button>
      </div>

      {/* Control Bar: Category Tabs & Filters */}
      <div className="space-y-3">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all shrink-0 ${
                activeCategory === cat
                  ? 'bg-gradient-to-r from-[#C5A46D] to-[#D4B57E] text-[#101110] font-semibold shadow-[0_2px_12px_rgba(197,164,109,0.3)]'
                  : 'bg-white/[0.03] hover:bg-white/[0.06] text-[#9B9D95] hover:text-[#F6F5F0] border border-white/[0.08]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Filter & Sort Controls Row */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] p-3 rounded-xl shadow-glass text-xs">
          {/* Status filters */}
          <div className="flex items-center gap-1">
            <span className="text-[#9B9D95] mr-1 hidden sm:inline">Status:</span>
            {(['all', 'incomplete', 'completed'] as const).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setStatusFilter(s)}
                className={`px-2.5 py-1 rounded-md capitalize font-medium transition-colors ${
                  statusFilter === s
                    ? 'bg-white/[0.1] text-[#F6F5F0] shadow-sm'
                    : 'text-[#9B9D95] hover:text-[#F6F5F0]'
                }`}
              >
                {s}
              </button>
            ))}
          </div>

          {/* Priority filter & Sort by */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="text-[#9B9D95]">Priority:</span>
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value as Priority | 'all')}
                className="bg-[#121312] border border-white/[0.1] text-[#F6F5F0] rounded-lg px-2.5 py-1 text-xs focus:outline-none focus:border-[#C5A46D]/80"
              >
                <option value="all">All</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-[#9B9D95]">Sort:</span>
              <select
                value={`${sortField}-${sortOrder}`}
                onChange={(e) => {
                  const [f, o] = e.target.value.split('-') as [SortField, SortOrder];
                  setSortField(f);
                  setSortOrder(o);
                }}
                className="bg-[#121312] border border-white/[0.1] text-[#F6F5F0] rounded-lg px-2.5 py-1 text-xs focus:outline-none focus:border-[#C5A46D]/80"
              >
                <option value="dueDate-asc">Due Date (Earliest)</option>
                <option value="dueDate-desc">Due Date (Latest)</option>
                <option value="priority-asc">Priority (Highest)</option>
                <option value="priority-desc">Priority (Lowest)</option>
                <option value="title-asc">Title (A-Z)</option>
                <option value="createdAt-desc">Recently Added</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Task List */}
      <div className="bg-[#121312]/80 backdrop-blur-2xl border border-white/[0.08] rounded-xl overflow-hidden shadow-glass">
        {filteredTasks.length === 0 ? (
          <EmptyState
            icon={CheckSquare}
            title="No tasks match criteria"
            description="Adjust your search query or reset your filters to view more tasks."
            action={{
              label: "Create a new task",
              onClick: () => openCreateModal()
            }}
          />
        ) : (
          <div>
            {filteredTasks.map((task) => (
              <TaskRow key={task.id} task={task} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
