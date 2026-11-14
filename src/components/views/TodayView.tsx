import React from 'react';
import { useTasks } from '../../context/TaskContext';
import { TaskRow } from '../tasks/TaskRow';
import { EmptyState } from '../common/EmptyState';
import { ProgressBar } from '../common/ProgressBar';
import { getTodayString, formatEditorialDate } from '../../utils/dateUtils';
import { Sun, Plus, CheckCircle2 } from 'lucide-react';

export const TodayView: React.FC = () => {
  const { tasks, searchQuery, openCreateModal, todayStats } = useTasks();
  const todayStr = getTodayString();

  const todayTasks = tasks.filter((t) => {
    const isToday = t.dueDate === todayStr;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return isToday && (t.title.toLowerCase().includes(q) || t.description?.toLowerCase().includes(q));
    }
    return isToday;
  }).sort((a, b) => {
    // Incomplete first, then by due time
    if (a.completed !== b.completed) return a.completed ? 1 : -1;
    return (a.dueTime || '').localeCompare(b.dueTime || '');
  });

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl">
      {/* Header */}
      <div className="border-b border-[#2B2D28] pb-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Sun className="w-4 h-4 text-[#C5A46D]" />
              <span className="text-xs uppercase tracking-wider text-[#C5A46D] font-semibold">
                Daily Focus
              </span>
            </div>
            <h2 className="text-2xl font-medium tracking-tight text-[#F1F0EA]">
              Today
            </h2>
            <p className="text-xs sm:text-sm text-[#92948C] mt-0.5 font-mono">
              {formatEditorialDate()}
            </p>
          </div>

          <button
            type="button"
            onClick={() => openCreateModal(undefined, todayStr)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-gradient-to-r from-[#C5A46D] to-[#D4B57E] text-xs font-semibold text-[#101110] transition-all self-start sm:self-auto shadow-[0_2px_12px_rgba(197,164,109,0.3)] active:scale-[0.98]"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Add Task for Today</span>
          </button>
        </div>

        {/* Progress summary glass bar */}
        <div className="mt-5 p-4 bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] rounded-xl shadow-glass space-y-2">
          <div className="flex items-center justify-between text-xs text-[#9B9D95]">
            <span>
              {todayStats.completed} of {todayStats.total} completed ({todayStats.remaining} remaining)
            </span>
            <span className="font-mono text-[#F6F5F0] font-medium">{todayStats.percentage}%</span>
          </div>
          <ProgressBar percentage={todayStats.percentage} height="h-2" />
        </div>
      </div>

      {/* Task List */}
      <div className="bg-[#121312]/80 backdrop-blur-2xl border border-white/[0.08] rounded-xl overflow-hidden shadow-glass">
        {todayTasks.length === 0 ? (
          <EmptyState
            icon={CheckCircle2}
            title={todayStats.completed > 0 ? "You're all caught up for today" : "No tasks scheduled today"}
            description={
              todayStats.completed > 0
                ? "Every priority for today has been accomplished. Take a well-deserved break or plan tomorrow's milestones."
                : "Add the key items you want to accomplish before the end of the day."
            }
            action={{
              label: "Add task for today",
              onClick: () => openCreateModal(undefined, todayStr)
            }}
          />
        ) : (
          <div>
            {todayTasks.map((task) => (
              <TaskRow key={task.id} task={task} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
