import React, { useMemo } from 'react';
import { useTasks } from '../../context/TaskContext';
import { TaskRow } from '../tasks/TaskRow';
import { EmptyState } from '../common/EmptyState';
import { getTodayString, getOffsetDateString } from '../../utils/dateUtils';
import { Calendar, Plus, CalendarDays } from 'lucide-react';
import type { Task } from '../../types/task';

export const UpcomingView: React.FC = () => {
  const { tasks, searchQuery, openCreateModal } = useTasks();

  const todayStr = getTodayString();
  const tomorrowStr = getOffsetDateString(1);
  const endOfWeekStr = getOffsetDateString(7);
  const endOfNextWeekStr = getOffsetDateString(14);

  // Group upcoming tasks
  const groups = useMemo(() => {
    const upcomingTasks = tasks.filter((t) => {
      if (t.completed) return false;
      if (t.dueDate <= todayStr) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return t.title.toLowerCase().includes(q) || t.description?.toLowerCase().includes(q);
      }
      return true;
    });

    const tomorrow: Task[] = [];
    const thisWeek: Task[] = [];
    const nextWeek: Task[] = [];
    const later: Task[] = [];

    upcomingTasks.forEach((t) => {
      if (t.dueDate === tomorrowStr) {
        tomorrow.push(t);
      } else if (t.dueDate <= endOfWeekStr) {
        thisWeek.push(t);
      } else if (t.dueDate <= endOfNextWeekStr) {
        nextWeek.push(t);
      } else {
        later.push(t);
      }
    });

    const sortFn = (a: Task, b: Task) => a.dueDate.localeCompare(b.dueDate);

    return [
      { id: 'tomorrow', title: 'Tomorrow', date: tomorrowStr, items: tomorrow.sort(sortFn) },
      { id: 'thisWeek', title: 'This Week', date: getOffsetDateString(3), items: thisWeek.sort(sortFn) },
      { id: 'nextWeek', title: 'Next Week', date: getOffsetDateString(8), items: nextWeek.sort(sortFn) },
      { id: 'later', title: 'Later', date: getOffsetDateString(15), items: later.sort(sortFn) },
    ];
  }, [tasks, todayStr, tomorrowStr, endOfWeekStr, endOfNextWeekStr, searchQuery]);

  const totalUpcoming = groups.reduce((acc, g) => acc + g.items.length, 0);

  return (
    <div className="space-y-8 animate-fade-in max-w-4xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#2B2D28] pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Calendar className="w-4 h-4 text-[#C5A46D]" />
            <span className="text-xs uppercase tracking-wider text-[#C5A46D] font-semibold">
              Schedule & Roadmap
            </span>
          </div>
          <h2 className="text-2xl font-medium tracking-tight text-[#F1F0EA]">
            Upcoming Deadlines
          </h2>
          <p className="text-xs sm:text-sm text-[#92948C] mt-0.5">
            {totalUpcoming} upcoming {totalUpcoming === 1 ? 'task' : 'tasks'} scheduled ahead
          </p>
        </div>

        <button
          type="button"
          onClick={() => openCreateModal(undefined, tomorrowStr)}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-xs font-medium text-[#F6F5F0] border border-white/[0.1] shadow-sm hover:border-[#C5A46D]/60 transition-all self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5 text-[#C5A46D]" />
          <span>Schedule Task</span>
        </button>
      </div>

      {totalUpcoming === 0 ? (
        <div className="bg-[#121312]/80 backdrop-blur-2xl border border-white/[0.08] rounded-xl overflow-hidden shadow-glass">
          <EmptyState
            icon={CalendarDays}
            title="No upcoming deadlines"
            description="Your future schedule is clear. Plan ahead by adding upcoming deliverables or milestones."
            action={{
              label: "Schedule a task for tomorrow",
              onClick: () => openCreateModal(undefined, tomorrowStr)
            }}
          />
        </div>
      ) : (
        <div className="space-y-6">
          {groups.map((group) => {
            if (group.items.length === 0) return null;
            return (
              <div key={group.id} className="space-y-2">
                <div className="flex items-center justify-between px-1">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#C5A46D] shadow-[0_0_8px_#C5A46D]" />
                    <h3 className="text-xs uppercase tracking-wider font-semibold text-[#F6F5F0]">
                      {group.title}
                    </h3>
                    <span className="text-xs font-mono text-[#9B9D95]">
                      ({group.items.length})
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => openCreateModal(undefined, group.date)}
                    className="text-xs text-[#9B9D95] hover:text-[#C5A46D] flex items-center gap-1 transition-colors px-2 py-0.5 rounded hover:bg-white/[0.04]"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add to {group.title.toLowerCase()}</span>
                  </button>
                </div>

                <div className="bg-[#121312]/80 backdrop-blur-2xl border border-white/[0.08] rounded-xl overflow-hidden shadow-glass">
                  {group.items.map((task) => (
                    <TaskRow key={task.id} task={task} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
