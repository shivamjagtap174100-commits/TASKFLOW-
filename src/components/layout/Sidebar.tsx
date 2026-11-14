import React, { useState, useRef, useEffect } from 'react';
import { useTasks } from '../../context/TaskContext';
import { useAuth } from '../../context/AuthContext';
import type { ViewType, Category } from '../../types/task';
import { 
  LayoutDashboard, 
  CheckSquare, 
  Sun, 
  Calendar, 
  Archive, 
  Star, 
  Settings, 
  ChevronDown, 
  Plus, 
  Folder, 
  LogOut 
} from 'lucide-react';

interface SidebarProps {
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onCloseMobile }) => {
  const {
    activeView,
    setActiveView,
    selectedCategory,
    viewCounts,
    categoryCounts,
    workspaces,
    activeWorkspace,
    setActiveWorkspace,
    userProfile,
    openCreateModal,
    setIsSettingsOpen
  } = useTasks();

  const { setIsAuthModalOpen } = useAuth();

  const [isWorkspaceOpen, setIsWorkspaceOpen] = useState(false);
  const workspaceRef = useRef<HTMLDivElement>(null);

  // Close workspace switcher on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (workspaceRef.current && !workspaceRef.current.contains(e.target as Node)) {
        setIsWorkspaceOpen(false);
      }
    };
    if (isWorkspaceOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [isWorkspaceOpen]);

  const navItems: { id: ViewType; label: string; icon: React.ElementType; count: number }[] = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard, count: 0 },
    { id: 'my-tasks', label: 'My Tasks', icon: CheckSquare, count: viewCounts.myTasks },
    { id: 'today', label: 'Today', icon: Sun, count: viewCounts.today },
    { id: 'upcoming', label: 'Upcoming', icon: Calendar, count: viewCounts.upcoming },
    { id: 'important', label: 'Important', icon: Star, count: viewCounts.important },
    { id: 'completed', label: 'Completed', icon: Archive, count: viewCounts.completed },
  ];

  const categories: { name: Category; dotColor: string }[] = [
    { name: 'Work', dotColor: 'bg-[#C5A46D]' },
    { name: 'Personal', dotColor: 'bg-[#B099D6]' },
    { name: 'Study', dotColor: 'bg-[#82A88A]' },
    { name: 'Other', dotColor: 'bg-[#92948C]' },
  ];

  const handleNavClick = (viewId: ViewType) => {
    setActiveView(viewId);
    if (onCloseMobile) onCloseMobile();
  };

  const handleCategoryClick = (cat: Category) => {
    setActiveView('category', cat);
    if (onCloseMobile) onCloseMobile();
  };

  return (
    <aside aria-label="Sidebar navigation" className="w-[245px] h-full flex flex-col bg-[#111211]/85 backdrop-blur-2xl border-r border-white/[0.07] select-none shrink-0 shadow-2xl relative z-10">
      {/* Brand Identity */}
      <div className="px-5 pt-6 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#1C1D1A] to-[#141513] border border-white/[0.12] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.18)] flex items-center justify-center text-[#C5A46D] shadow-md">
            <span className="font-semibold text-xs tracking-tight">TF</span>
          </div>
          <div>
            <span className="font-semibold text-sm tracking-wider text-[#F6F5F0]">
              TASKFLOW
            </span>
            <p className="text-[10px] text-[#9B9D95] tracking-tight">
              Make Every Day Count.
            </p>
          </div>
        </div>
      </div>

      {/* Workspace Selector */}
      <div className="px-3 pb-3 relative" ref={workspaceRef}>
        <button
          type="button"
          onClick={() => setIsWorkspaceOpen(!isWorkspaceOpen)}
          className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.08] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)] text-xs text-[#F6F5F0] transition-all"
        >
          <div className="flex items-center gap-2 truncate">
            <span className="w-4 h-4 rounded bg-[#C5A46D]/15 text-[9px] font-mono flex items-center justify-center text-[#C5A46D] border border-[#C5A46D]/30">
              {activeWorkspace.initials}
            </span>
            <span className="truncate font-medium">{activeWorkspace.name}</span>
          </div>
          <ChevronDown className="w-3.5 h-3.5 text-[#9B9D95] shrink-0" />
        </button>

        {isWorkspaceOpen && (
          <div className="absolute left-3 right-3 top-full mt-1.5 bg-[#161715]/95 backdrop-blur-2xl border border-white/[0.12] rounded-xl shadow-dropdown py-1.5 z-40 text-xs animate-fade-in">
            <div className="px-3 py-1 text-[10px] uppercase tracking-wider text-[#9B9D95] font-semibold">
              Workspaces
            </div>
            {workspaces.map((ws) => (
              <button
                key={ws.id}
                type="button"
                onClick={() => {
                  setActiveWorkspace(ws);
                  setIsWorkspaceOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2 text-left transition-colors ${activeWorkspace.id === ws.id
                  ? 'bg-[#C5A46D]/15 text-[#C5A46D]'
                  : 'text-[#F6F5F0] hover:bg-white/[0.04]'
                  }`}
              >
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded bg-white/[0.06] text-[9px] font-mono flex items-center justify-center">
                    {ws.initials}
                  </span>
                  <span>{ws.name}</span>
                </div>
                <span className="text-[10px] text-[#9B9D95]">{ws.role}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Quick Add Task Button for Sidebar */}
      <div className="px-3 pb-3">
        <button
          type="button"
          onClick={() => openCreateModal()}
          className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-gradient-to-r from-[#C5A46D]/20 to-[#C5A46D]/10 hover:from-[#C5A46D]/30 hover:to-[#C5A46D]/15 border border-[#C5A46D]/35 hover:border-[#C5A46D]/60 text-xs font-medium text-[#F6F5F0] transition-all shadow-[0_2px_12px_rgba(197,164,109,0.1)] active:scale-[0.98]"
        >
          <Plus className="w-3.5 h-3.5 text-[#C5A46D]" />
          <span>New Task</span>
          <kbd className="ml-auto text-[9px] font-mono text-[#9B9D95] bg-black/40 px-1 py-0.5 rounded border border-white/[0.08]">
            N
          </kbd>
        </button>
      </div>

      {/* Main Navigation Views */}
      <div className="flex-1 overflow-y-auto px-3 space-y-5">
        <div>
          <div className="px-2 pb-1.5 text-[10px] uppercase tracking-wider text-[#9B9D95] font-semibold">
            Views
          </div>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeView === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${isActive
                    ? 'bg-gradient-to-r from-[#C5A46D]/20 to-[#C5A46D]/5 text-[#F6F5F0] border border-[#C5A46D]/35 shadow-[0_0_18px_-4px_rgba(197,164,109,0.25),inset_0_1px_0_0_rgba(255,255,255,0.1)]'
                    : 'text-[#9B9D95] hover:text-[#F6F5F0] hover:bg-white/[0.035]'
                    }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#C5A46D]' : 'text-[#9B9D95]'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.count > 0 && (
                    <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${isActive ? 'bg-[#C5A46D]/25 text-[#F6F5F0]' : 'text-[#9B9D95]'
                      }`}>
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Categories Section */}
        <div>
          <div className="flex items-center justify-between px-2 pb-1.5">
            <span className="text-[10px] uppercase tracking-wider text-[#9B9D95] font-semibold">
              Categories
            </span>
            <Folder className="w-3 h-3 text-[#9B9D95]" />
          </div>
          <nav className="space-y-1">
            {categories.map((cat) => {
              const isActive = activeView === 'category' && selectedCategory === cat.name;
              const count = categoryCounts[cat.name] || 0;
              return (
                <button
                  key={cat.name}
                  type="button"
                  onClick={() => handleCategoryClick(cat.name)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${isActive
                    ? 'bg-white/[0.08] text-[#F6F5F0] border border-white/[0.12] shadow-sm'
                    : 'text-[#9B9D95] hover:text-[#F6F5F0] hover:bg-white/[0.03]'
                    }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className={`w-1.5 h-1.5 rounded-full ${cat.dotColor}`} />
                    <span>{cat.name}</span>
                  </div>
                  {count > 0 && (
                    <span className="text-[10px] font-mono text-[#9B9D95]">
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Bottom Section: Settings & User Profile */}
      <div className="p-3 border-t border-white/[0.07] space-y-2">
        <button
          type="button"
          onClick={() => setIsSettingsOpen(true)}
          className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-xs font-medium text-[#9B9D95] hover:text-[#F6F5F0] hover:bg-white/[0.03] transition-colors"
        >
          <Settings className="w-3.5 h-3.5 text-[#9B9D95]" />
          <span>Settings & Data</span>
        </button>

        {/* User Profile Glass Card */}
        <div
          onClick={() => setIsSettingsOpen(true)}
          className="p-2 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.08] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)] flex items-center justify-between cursor-pointer group transition-all"
          title="Click to view profile & settings"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="relative shrink-0">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#1F201C] to-[#151613] border border-white/[0.12] group-hover:border-[#C5A46D]/60 flex items-center justify-center text-xs font-medium text-[#C5A46D] transition-colors shadow-sm">
                {userProfile.initials}
              </div>
              <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-[#82A88A] ring-2 ring-[#121312]" />
            </div>
            <div className="truncate">
              <div className="text-xs font-medium text-[#F6F5F0] truncate group-hover:text-white transition-colors">
                {userProfile.name}
              </div>
              <div className="text-[10px] text-[#9B9D95] truncate">
                {userProfile.role}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsAuthModalOpen(true);
            }}
            className="p-1 rounded-md text-[#9B9D95] hover:text-[#C5A46D] hover:bg-white/[0.06] transition-colors shrink-0"
            title="Switch Account or Sign In"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
};
