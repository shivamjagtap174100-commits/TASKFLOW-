import React from 'react';
import { useTasks } from '../../context/TaskContext';
import type { ViewType } from '../../types/task';
import { 
  LayoutDashboard, 
  CheckSquare, 
  Sun, 
  Calendar, 
  Plus, 
  X 
} from 'lucide-react';
import { Sidebar } from './Sidebar';

interface MobileNavProps {
  isDrawerOpen: boolean;
  onCloseDrawer: () => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({
  isDrawerOpen,
  onCloseDrawer,
}) => {
  const { activeView, setActiveView, openCreateModal, viewCounts } = useTasks();

  const navItems: { id: ViewType; label: string; icon: React.ElementType; count?: number }[] = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'today', label: 'Today', icon: Sun, count: viewCounts.today },
    { id: 'my-tasks', label: 'Tasks', icon: CheckSquare, count: viewCounts.myTasks },
    { id: 'upcoming', label: 'Upcoming', icon: Calendar, count: viewCounts.upcoming },
  ];

  return (
    <>
      {/* Slide-out Drawer for Full Sidebar on Mobile */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/85 backdrop-blur-md transition-opacity animate-fade-in"
            onClick={onCloseDrawer}
          />
          {/* Sidebar Drawer */}
          <div className="relative z-10 w-[270px] max-w-[85vw] h-full shadow-2xl flex flex-col bg-[#101110]/95 backdrop-blur-2xl border-r border-white/[0.08] animate-fade-in">
            <button
              type="button"
              onClick={onCloseDrawer}
              className="absolute top-4 right-3 text-[#9B9D95] hover:text-[#F6F5F0] p-1.5 rounded-lg hover:bg-white/[0.06] transition-colors"
              aria-label="Close navigation"
            >
              <X className="w-5 h-5" />
            </button>
            <Sidebar onCloseMobile={onCloseDrawer} />
          </div>
        </div>
      )}

      {/* Persistent Bottom Navigation Bar on Mobile Screens with Frosted Glass Skin */}
      <nav aria-label="Mobile bottom navigation" className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-[#101110]/85 backdrop-blur-2xl border-t border-white/[0.08] shadow-[0_-10px_35px_rgba(0,0,0,0.6)] px-3 py-2 flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveView(item.id)}
              className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-xl min-w-[56px] min-h-[46px] transition-all relative ${
                isActive 
                  ? 'text-[#C5A46D] bg-white/[0.06] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08)]' 
                  : 'text-[#9B9D95] hover:text-[#F6F5F0] hover:bg-white/[0.03]'
              }`}
            >
              <div className="relative">
                <Icon className={`w-4 h-4 stroke-[1.8] ${isActive ? 'drop-shadow-[0_0_8px_rgba(197,164,109,0.5)]' : ''}`} />
                {item.count !== undefined && item.count > 0 && (
                  <span className="absolute -top-1 -right-2 min-w-[14px] h-[14px] text-[9px] font-mono rounded-full bg-white/[0.12] text-[#F6F5F0] border border-white/[0.1] flex items-center justify-center px-0.5">
                    {item.count}
                  </span>
                )}
              </div>
              <span className="text-[10px] font-medium tracking-tight mt-1">
                {item.label}
              </span>
            </button>
          );
        })}

        {/* Floating Add Task Center Button */}
        <button
          type="button"
          onClick={() => openCreateModal()}
          aria-label="Create new task"
          className="flex flex-col items-center justify-center p-1 rounded-xl min-w-[50px] min-h-[46px] text-[#101110]"
        >
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#C5A46D] to-[#D4B57E] hover:brightness-110 flex items-center justify-center shadow-[0_2px_14px_rgba(197,164,109,0.4)] active:scale-95 transition-all">
            <Plus className="w-5 h-5 stroke-[2.5]" />
          </div>
        </button>
      </nav>
    </>
  );
};
