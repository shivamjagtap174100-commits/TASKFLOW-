import React, { useRef, useEffect } from 'react';
import { useTasks } from '../../context/TaskContext';
import { SearchInput } from '../common/SearchInput';
import { formatEditorialDate } from '../../utils/dateUtils';
import { 
  Bell, 
  Plus, 
  Menu, 
  CheckCheck 
} from 'lucide-react';

interface HeaderProps {
  onToggleMobileNav: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleMobileNav }) => {
  const { 
    activeView, 
    selectedCategory, 
    searchQuery, 
    setSearchQuery, 
    openCreateModal,
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    isNotificationsOpen,
    setIsNotificationsOpen,
    userProfile,
    setIsSettingsOpen
  } = useTasks();

  const notificationsRef = useRef<HTMLDivElement>(null);

  // Close notifications on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (notificationsRef.current && !notificationsRef.current.contains(e.target as Node)) {
        setIsNotificationsOpen(false);
      }
    };
    if (isNotificationsOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [isNotificationsOpen, setIsNotificationsOpen]);

  const viewTitles: Record<string, string> = {
    'overview': 'Overview',
    'my-tasks': 'My Tasks',
    'today': 'Today',
    'upcoming': 'Upcoming Deadlines',
    'completed': 'Completed Archive',
    'important': 'Important & High Priority',
    'category': selectedCategory ? `${selectedCategory} Tasks` : 'Category',
  };

  const currentTitle = viewTitles[activeView] || 'Tasks';
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="sticky top-0 z-20 bg-[#0C0D0C]/80 backdrop-blur-2xl border-b border-white/[0.08] px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4">
      {/* Left: Mobile Toggle & Page Title */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          type="button"
          onClick={onToggleMobileNav}
          className="lg:hidden p-2 text-[#9B9D95] hover:text-[#F6F5F0] hover:bg-white/[0.04] border border-white/[0.08] rounded-lg transition-colors"
          aria-label="Open navigation menu"
        >
          <Menu className="w-4 h-4" />
        </button>

        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h1 className="text-base sm:text-lg font-medium text-[#F6F5F0] tracking-tight truncate">
              {currentTitle}
            </h1>
          </div>
          <p className="hidden md:block text-[11px] text-[#9B9D95] font-mono tracking-wide">
            {formatEditorialDate()}
          </p>
        </div>
      </div>

      {/* Center / Right: Search & Actions */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        <div className="w-44 sm:w-64 md:w-80">
          <SearchInput
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search tasks..."
          />
        </div>

        {/* Notifications Popover */}
        <div className="relative" ref={notificationsRef}>
          <button
            type="button"
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
            aria-label="Notifications"
            className="relative p-2 rounded-lg bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.08] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)] text-[#9B9D95] hover:text-[#F6F5F0] transition-colors"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#C5A46D] shadow-[0_0_8px_#C5A46D]" />
            )}
          </button>

          {isNotificationsOpen && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-[#141513]/95 backdrop-blur-2xl border border-white/[0.12] rounded-xl shadow-dropdown py-2 z-40 animate-fade-in text-xs">
              <div className="px-3 py-2 border-b border-white/[0.08] flex items-center justify-between">
                <span className="font-medium text-[#F6F5F0] tracking-wide">Notifications</span>
                {unreadCount > 0 && (
                  <button
                    type="button"
                    onClick={markAllNotificationsAsRead}
                    className="text-[11px] text-[#C5A46D] hover:underline flex items-center gap-1"
                  >
                    <CheckCheck className="w-3 h-3" />
                    <span>Mark all read</span>
                  </button>
                )}
              </div>

              <div className="max-h-72 overflow-y-auto divide-y divide-white/[0.05]">
                {notifications.length === 0 ? (
                  <div className="p-4 text-center text-[#9B9D95]">
                    No notifications
                  </div>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => markNotificationAsRead(n.id)}
                      className={`p-3 cursor-pointer hover:bg-white/[0.04] transition-colors ${
                        !n.read ? 'bg-white/[0.02]' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <span className={`font-medium ${!n.read ? 'text-[#F6F5F0]' : 'text-[#9B9D95]'}`}>
                          {n.title}
                        </span>
                        <span className="text-[10px] text-[#9B9D95] font-mono shrink-0">
                          {n.timestamp}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#9B9D95] leading-relaxed">
                        {n.description}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Quick Action Glass Button */}
        <button
          type="button"
          onClick={() => setIsSettingsOpen(true)}
          className="hidden md:flex items-center gap-2 pl-1.5 pr-3 py-1.5 rounded-lg bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.08] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)] text-xs text-[#F6F5F0] transition-all"
          title="Account Settings"
        >
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#1F201C] to-[#151613] border border-white/[0.12] flex items-center justify-center text-[10px] font-medium text-[#C5A46D]">
            {userProfile.initials}
          </div>
          <span className="font-medium text-xs max-w-[120px] truncate">{userProfile.name}</span>
        </button>

        {/* Primary Action Button: Add Task with Champagne Glow */}
        <button
          type="button"
          onClick={() => openCreateModal()}
          className="flex items-center gap-1.5 sm:gap-2 px-3.5 sm:px-4 py-2 rounded-lg bg-gradient-to-r from-[#C5A46D] via-[#D4B57E] to-[#C5A46D] hover:brightness-110 text-[#101110] font-semibold text-xs sm:text-sm transition-all shadow-[0_2px_16px_rgba(197,164,109,0.35)] active:scale-[0.98]"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span className="hidden sm:inline">Add Task</span>
          <span className="sm:hidden">Add</span>
        </button>
      </div>
    </header>
  );
};
