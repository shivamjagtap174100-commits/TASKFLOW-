import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { TaskProvider, useTasks } from './context/TaskContext';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { MobileNav } from './components/layout/MobileNav';
import { SettingsModal } from './components/layout/SettingsModal';
import { TaskModal } from './components/tasks/TaskModal';
import { AuthModal } from './components/auth/AuthModal';
import { ToastContainer } from './components/common/Toast';

// Views
import { OverviewView } from './components/views/OverviewView';
import { MyTasksView } from './components/views/MyTasksView';
import { TodayView } from './components/views/TodayView';
import { UpcomingView } from './components/views/UpcomingView';
import { CompletedView } from './components/views/CompletedView';
import { ImportantView } from './components/views/ImportantView';
import { CategoryView } from './components/views/CategoryView';

const MainLayout: React.FC = () => {
  const { 
    activeView, 
    isTaskModalOpen, 
    closeTaskModal, 
    openCreateModal,
    isSettingsOpen, 
    setIsSettingsOpen 
  } = useTasks();

  const { isAuthModalOpen, setIsAuthModalOpen } = useAuth();
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  // Global keyboard shortcut listener for 'N' to open new task
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        (e.key === 'n' || e.key === 'N') &&
        document.activeElement?.tagName !== 'INPUT' &&
        document.activeElement?.tagName !== 'TEXTAREA' &&
        !isTaskModalOpen &&
        !isSettingsOpen &&
        !isAuthModalOpen
      ) {
        e.preventDefault();
        openCreateModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isTaskModalOpen, isSettingsOpen, isAuthModalOpen, openCreateModal]);

  const renderActiveView = () => {
    switch (activeView) {
      case 'overview':
        return <OverviewView />;
      case 'my-tasks':
        return <MyTasksView />;
      case 'today':
        return <TodayView />;
      case 'upcoming':
        return <UpcomingView />;
      case 'completed':
        return <CompletedView />;
      case 'important':
        return <ImportantView />;
      case 'category':
        return <CategoryView />;
      default:
        return <OverviewView />;
    }
  };

  return (
    <div className="flex h-screen w-screen bg-[#101110] text-[#F1F0EA] overflow-hidden antialiased font-sans select-none">
      {/* Desktop Fixed Left Sidebar (~245px) */}
      <div className="hidden lg:block h-full">
        <Sidebar />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden bg-[#101110]">
        {/* Sticky Top Header */}
        <Header onToggleMobileNav={() => setIsMobileDrawerOpen(true)} />

        {/* Scrollable Main Content */}
        <main className="flex-1 overflow-y-auto px-4 sm:px-8 py-6 pb-24 lg:pb-12 max-w-7xl w-full mx-auto select-text">
          {renderActiveView()}
        </main>
      </div>

      {/* Mobile Drawer & Bottom Navigation */}
      <MobileNav
        isDrawerOpen={isMobileDrawerOpen}
        onCloseDrawer={() => setIsMobileDrawerOpen(false)}
      />

      {/* Modals & Portals */}
      <TaskModal isOpen={isTaskModalOpen} onClose={closeTaskModal} />
      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
      />
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <TaskProvider>
        <MainLayout />
      </TaskProvider>
    </AuthProvider>
  );
}
