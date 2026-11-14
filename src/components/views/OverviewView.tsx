import React, { useMemo } from 'react';
import { useTasks } from '../../context/TaskContext';
import { TaskRow } from '../tasks/TaskRow';
import { ProgressBar } from '../common/ProgressBar';
import { EmptyState } from '../common/EmptyState';
import { 
  getGreeting, 
  formatEditorialDate, 
  getTodayString, 
  formatShortDate 
} from '../../utils/dateUtils';
import { 
  CheckCircle2, 
  Calendar, 
  Star, 
  ArrowRight, 
  Plus, 
  Clock 
} from 'lucide-react';

export const OverviewView: React.FC = () => {
  const { 
    tasks, 
    todayStats, 
    setActiveView, 
    openCreateModal,
    searchQuery 
  } = useTasks();

  const { greeting, subtitle } = getGreeting();
  const todayStr = getTodayString();

  // Filter today's tasks
  const todayTasks = tasks.filter((t) => {
    const isTodayMatch = t.dueDate === todayStr;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchesSearch = 
        t.title.toLowerCase().includes(q) || 
        (t.description && t.description.toLowerCase().includes(q));
      return isTodayMatch && matchesSearch;
    }
    return isTodayMatch;
  });

  // Upcoming tasks for the right panel (future deadlines, max 4)
  const upcomingDeadlines = tasks
    .filter((t) => !t.completed && t.dueDate > todayStr)
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
    .slice(0, 4);

  // Important tasks for right panel (starred or high priority, max 3)
  const importantTasks = tasks
    .filter((t) => !t.completed && (t.important || t.priority === 'high'))
    .slice(0, 3);

  // Generate 7-day mini progress cadence
  const daysOfWeek = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  const todayIndex = useMemo(() => (new Date().getDay() + 6) % 7, []); // Monday = 0

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Editorial Greeting Header */}
      <div className="border-b border-[#2B2D28] pb-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="text-xs uppercase tracking-widest text-[#C5A46D] font-medium mb-1">
              {formatEditorialDate()}
            </div>
            <h2 className="text-2xl sm:text-3xl font-medium tracking-tight text-[#F1F0EA]">
              {greeting}
            </h2>
            <p className="text-sm text-[#92948C] mt-1 font-normal">
              {subtitle}
            </p>
          </div>

          {/* Quick Metrics Glass Capsule */}
          <div className="flex items-center gap-6 bg-white/[0.03] backdrop-blur-2xl border border-white/[0.09] shadow-glass px-5 py-3 rounded-xl">
            <div>
              <div className="text-[10px] uppercase tracking-wider text-[#9B9D95] font-semibold">
                Completed
              </div>
              <div className="text-lg font-mono font-medium text-[#82A88A]">
                {todayStats.completed}
              </div>
            </div>
            <div className="w-px h-8 bg-white/[0.08]" />
            <div>
              <div className="text-[10px] uppercase tracking-wider text-[#9B9D95] font-semibold">
                Remaining
              </div>
              <div className="text-lg font-mono font-medium text-[#F6F5F0]">
                {todayStats.remaining}
              </div>
            </div>
            <div className="w-px h-8 bg-white/[0.08]" />
            <div>
              <div className="text-[10px] uppercase tracking-wider text-[#9B9D95] font-semibold">
                Progress
              </div>
              <div className="text-lg font-mono font-medium text-[#C5A46D]">
                {todayStats.percentage}%
              </div>
            </div>
          </div>
        </div>

        {/* Subtle Horizontal Progress Indicator */}
        <div className="mt-6">
          <ProgressBar percentage={todayStats.percentage} height="h-1.5" />
        </div>
      </div>

      {/* Two-Column Balanced Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Main Column: Today's Focus (7 to 8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-white/[0.08]">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#C5A46D] shadow-[0_0_8px_#C5A46D]" />
              <h3 className="text-sm font-medium tracking-wider uppercase text-[#F6F5F0]">
                Today's Focus
              </h3>
              <span className="text-xs font-mono text-[#9B9D95] ml-1">
                ({todayTasks.length})
              </span>
            </div>

            <button
              type="button"
              onClick={() => openCreateModal(undefined, todayStr)}
              className="flex items-center gap-1.5 text-xs text-[#9B9D95] hover:text-[#C5A46D] transition-colors px-2 py-1 rounded hover:bg-white/[0.04]"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add task</span>
            </button>
          </div>

          {/* Clean task list in frosted glass container */}
          <div className="bg-[#121312]/80 backdrop-blur-2xl border border-white/[0.08] rounded-xl overflow-hidden shadow-glass">
            {todayTasks.length === 0 ? (
              <EmptyState
                icon={CheckCircle2}
                title={todayStats.completed > 0 ? "All tasks completed" : "No tasks scheduled for today"}
                description={
                  todayStats.completed > 0 
                    ? "You've finished everything set for today. Take a pause or plan ahead for tomorrow."
                    : "Your agenda for today is clear. Capture an essential priority to get started."
                }
                action={{
                  label: "Add a focus task",
                  onClick: () => openCreateModal(undefined, todayStr)
                }}
              />
            ) : (
              <div>
                {todayTasks.map((task) => (
                  <TaskRow key={task.id} task={task} showDueDate={false} />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right-Side Panel: Upcoming, Important & Cadence (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Upcoming Deadlines Glass Card */}
          <div className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] rounded-xl p-4 space-y-3 shadow-glass hover:border-white/[0.14] transition-all">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 text-[#9B9D95]" />
                <h4 className="text-xs uppercase tracking-wider font-semibold text-[#F6F5F0]">
                  Upcoming Deadlines
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setActiveView('upcoming')}
                className="text-xs text-[#9B9D95] hover:text-[#C5A46D] flex items-center gap-1 transition-colors"
              >
                <span>View all</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            {upcomingDeadlines.length === 0 ? (
              <div className="py-4 text-center text-xs text-[#9B9D95]">
                No upcoming deadlines in the next few days.
              </div>
            ) : (
              <div className="space-y-2 pt-1">
                {upcomingDeadlines.map((t) => (
                  <div
                    key={t.id}
                    className="p-2.5 rounded-lg bg-white/[0.025] hover:bg-white/[0.05] border border-white/[0.07] hover:border-white/[0.14] transition-all"
                  >
                    <div className="text-xs font-medium text-[#F6F5F0] line-clamp-1 mb-1">
                      {t.title}
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-[#9B9D95]">
                      <span className="font-mono">{formatShortDate(t.dueDate)}</span>
                      <span className="capitalize text-[10px] px-1.5 py-0.5 rounded bg-white/[0.06] border border-white/[0.06]">
                        {t.category}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Important Focus Glass Card */}
          <div className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] rounded-xl p-4 space-y-3 shadow-glass hover:border-[#C5A46D]/35 transition-all">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Star className="w-3.5 h-3.5 text-[#C5A46D] fill-[#C5A46D]" />
                <h4 className="text-xs uppercase tracking-wider font-semibold text-[#F6F5F0]">
                  Important Focus
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setActiveView('important')}
                className="text-xs text-[#9B9D95] hover:text-[#C5A46D] flex items-center gap-1 transition-colors"
              >
                <span>View all</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            {importantTasks.length === 0 ? (
              <div className="py-4 text-center text-xs text-[#9B9D95]">
                No starred tasks currently pending.
              </div>
            ) : (
              <div className="space-y-2 pt-1">
                {importantTasks.map((t) => (
                  <div
                    key={t.id}
                    className="p-2.5 rounded-lg bg-white/[0.025] hover:bg-white/[0.05] border border-white/[0.07] hover:border-[#C5A46D]/40 transition-all"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-xs font-medium text-[#F6F5F0] line-clamp-1">
                        {t.title}
                      </span>
                      <span className="w-1.5 h-1.5 rounded-full bg-[#D77C76] shadow-[0_0_6px_#D77C76] shrink-0 mt-1" />
                    </div>
                    <div className="text-[10px] text-[#9B9D95] mt-1 font-mono">
                      Priority: High · {t.category}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Weekly Cadence Glass Card */}
          <div className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] rounded-xl p-4 space-y-3 shadow-glass">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-[#9B9D95]" />
                <h4 className="text-xs uppercase tracking-wider font-semibold text-[#F6F5F0]">
                  Weekly Cadence
                </h4>
              </div>
              <span className="text-[11px] font-mono text-[#9B9D95]">Current Week</span>
            </div>

            <div className="flex items-center justify-between pt-1">
              {daysOfWeek.map((day, idx) => {
                const isPast = idx < todayIndex;
                const isCurrent = idx === todayIndex;
                return (
                  <div key={idx} className="flex flex-col items-center gap-1.5">
                    <span className={`text-[10px] font-mono ${isCurrent ? 'text-[#C5A46D] font-bold' : 'text-[#9B9D95]'}`}>
                      {day}
                    </span>
                    <div 
                      className={`w-6 h-6 rounded-md flex items-center justify-center text-[10px] font-mono transition-all ${
                        isCurrent 
                          ? 'border border-[#C5A46D]/60 bg-[#C5A46D]/20 text-[#C5A46D] shadow-[0_0_12px_rgba(197,164,109,0.3)] font-bold' 
                          : isPast 
                          ? 'border border-white/[0.08] bg-white/[0.04] text-[#82A88A]' 
                          : 'border border-white/[0.05] bg-black/30 text-[#9B9D95]/40'
                      }`}
                    >
                      {isPast ? '✓' : isCurrent ? todayStats.completed : '·'}
                    </div>
                  </div>
                );
              })}
            </div>
            <p className="text-[10px] text-[#9B9D95] text-center pt-2 border-t border-white/[0.06]">
              {todayStats.completed} completed today · Maintain steady focus
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
