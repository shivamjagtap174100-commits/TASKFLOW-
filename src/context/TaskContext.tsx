import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { useAuth } from './AuthContext';
import type { 
  Task, 
  Category, 
  Priority, 
  ViewType, 
  SortConfig, 
  StatusFilter, 
  Workspace, 
  UserProfile,
  ToastNotification,
  SystemNotification
} from '../types/task';
import { getInitialTasks, INITIAL_WORKSPACES, INITIAL_NOTIFICATIONS } from '../utils/initialData';
import { getTodayString } from '../utils/dateUtils';

interface TaskContextType {
  tasks: Task[];
  activeView: ViewType;
  selectedCategory: Category | null;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  sortConfig: SortConfig;
  setSortConfig: (config: SortConfig) => void;
  statusFilter: StatusFilter;
  setStatusFilter: (filter: StatusFilter) => void;
  priorityFilter: Priority | 'all';
  setPriorityFilter: (filter: Priority | 'all') => void;
  
  // Navigation & Modals
  setActiveView: (view: ViewType, category?: Category) => void;
  isTaskModalOpen: boolean;
  editingTask: Task | null;
  modalDefaults: { category?: Category; date?: string };
  openCreateModal: (defaultCategory?: Category, defaultDate?: string) => void;
  openEditModal: (task: Task) => void;
  closeTaskModal: () => void;
  isSettingsOpen: boolean;
  setIsSettingsOpen: (open: boolean) => void;
  isNotificationsOpen: boolean;
  setIsNotificationsOpen: (open: boolean) => void;
  
  // Workspaces
  workspaces: Workspace[];
  activeWorkspace: Workspace;
  setActiveWorkspace: (ws: Workspace) => void;
  
  // User Profile
  userProfile: UserProfile;
  updateUserProfile: (profile: Partial<UserProfile>) => void;
  
  // Notifications & Toasts
  notifications: SystemNotification[];
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  toasts: ToastNotification[];
  addToast: (message: string, type?: 'success' | 'info' | 'danger', action?: { label: string; onClick: () => void }) => void;
  removeToast: (id: string) => void;

  // Task Operations
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleTaskComplete: (id: string) => void;
  toggleTaskImportant: (id: string) => void;
  restoreTask: (id: string) => void;
  clearCompletedTasks: () => void;
  duplicateTask: (id: string) => void;
  
  // Utilities
  resetToSampleData: () => void;
  exportData: () => void;
  importData: (jsonStr: string) => boolean;

  // Calculated Metrics
  todayStats: {
    total: number;
    completed: number;
    remaining: number;
    percentage: number;
  };
  overallStats: {
    total: number;
    completed: number;
    remaining: number;
    important: number;
  };
  categoryCounts: Record<Category, number>;
  viewCounts: {
    myTasks: number;
    today: number;
    upcoming: number;
    completed: number;
    important: number;
  };
}

const STORAGE_KEY_TASKS = 'taskflow_tasks_v1';
const STORAGE_KEY_WORKSPACE = 'taskflow_active_workspace_v1';

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser, updateUserAccount } = useAuth();
  const currentUserId = currentUser?.id || 'guest';
  const userTasksKey = `taskflow_user_${currentUserId}_tasks`;
  const userWorkspaceKey = `taskflow_user_${currentUserId}_workspace`;

  // Load initial tasks from LocalStorage for current user
  const [tasks, setTasks] = useState<Task[]>(() => {
    try {
      const stored = localStorage.getItem(userTasksKey) || (currentUserId === 'user-shivam' ? localStorage.getItem(STORAGE_KEY_TASKS) : null);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Failed to load tasks from localStorage', e);
    }
    return getInitialTasks();
  });

  const [activeView, setActiveViewRaw] = useState<ViewType>('overview');
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState<SortConfig>({ field: 'dueDate', order: 'asc' });
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [priorityFilter, setPriorityFilter] = useState<Priority | 'all'>('all');

  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [modalDefaults, setModalDefaults] = useState<{ category?: Category; date?: string }>({});

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const [workspaces] = useState<Workspace[]>(INITIAL_WORKSPACES);
  const [activeWorkspace, setActiveWorkspace] = useState<Workspace>(() => {
    try {
      const stored = localStorage.getItem(userWorkspaceKey) || localStorage.getItem(STORAGE_KEY_WORKSPACE);
      if (stored) {
        const parsed = JSON.parse(stored);
        const match = INITIAL_WORKSPACES.find(w => w.id === parsed.id);
        if (match) return match;
      }
    } catch {
      // fallback
    }
    return INITIAL_WORKSPACES[0];
  });

  const userProfile: UserProfile = useMemo(() => {
    if (currentUser) {
      return {
        name: currentUser.name,
        role: currentUser.role,
        initials: currentUser.initials,
      };
    }
    return { name: 'Guest User', role: 'Viewer', initials: 'GU' };
  }, [currentUser]);

  const [notifications, setNotifications] = useState<SystemNotification[]>(INITIAL_NOTIFICATIONS);
  const [toasts, setToasts] = useState<ToastNotification[]>([]);

  // Switch task database when currentUser changes
  useEffect(() => {
    try {
      const stored = localStorage.getItem(userTasksKey) || (currentUserId === 'user-shivam' ? localStorage.getItem(STORAGE_KEY_TASKS) : null);
      if (stored) {
        setTasks(JSON.parse(stored));
      } else {
        if (currentUserId === 'user-shivam') {
          setTasks(getInitialTasks());
        } else {
          setTasks([
            {
              id: 'task-welcome-' + Math.random().toString(36).substring(2, 7),
              title: `Welcome to TASKFLOW, ${currentUser?.name || 'Friend'}!`,
              description: 'Your private workspace is initialized. Tasks you create here are securely isolated to your account.',
              category: 'Work',
              priority: 'high',
              dueDate: getTodayString(),
              dueTime: '11:00',
              completed: false,
              important: true,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            }
          ]);
        }
      }
    } catch (e) {
      console.error('Error switching user task storage', e);
    }
  }, [currentUserId, userTasksKey, currentUser?.name]);

  // Persist tasks under this user's key
  useEffect(() => {
    try {
      localStorage.setItem(userTasksKey, JSON.stringify(tasks));
      if (currentUserId === 'user-shivam') {
        localStorage.setItem(STORAGE_KEY_TASKS, JSON.stringify(tasks));
      }
    } catch (e) {
      console.error('Failed to save tasks to localStorage', e);
    }
  }, [tasks, userTasksKey, currentUserId]);

  // Persist workspace
  useEffect(() => {
    try {
      localStorage.setItem(userWorkspaceKey, JSON.stringify(activeWorkspace));
    } catch (e) {
      console.error('Failed to save workspace to localStorage', e);
    }
  }, [activeWorkspace, userWorkspaceKey]);

  // Toast manager
  const addToast = useCallback((
    message: string, 
    type: 'success' | 'info' | 'danger' = 'info', 
    action?: { label: string; onClick: () => void }
  ) => {
    const id = 'toast-' + Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, message, type, action }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4500);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const updateUserProfile = useCallback((updates: Partial<UserProfile>) => {
    updateUserAccount(updates);
    addToast('Profile updated', 'success');
  }, [updateUserAccount, addToast]);

  const setActiveView = useCallback((view: ViewType, category?: Category) => {
    setActiveViewRaw(view);
    if (view === 'category' && category) {
      setSelectedCategory(category);
    } else {
      setSelectedCategory(null);
    }
  }, []);

  const openCreateModal = useCallback((defaultCategory?: Category, defaultDate?: string) => {
    setEditingTask(null);
    setModalDefaults({ category: defaultCategory, date: defaultDate });
    setIsTaskModalOpen(true);
  }, []);

  const openEditModal = useCallback((task: Task) => {
    setEditingTask(task);
    setIsTaskModalOpen(true);
  }, []);

  const closeTaskModal = useCallback(() => {
    setIsTaskModalOpen(false);
    setEditingTask(null);
  }, []);

  // Task operations
  const addTask = useCallback((taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const newTask: Task = {
      ...taskData,
      id: 'task-' + Math.random().toString(36).substring(2, 9),
      createdAt: now,
      updatedAt: now,
    };
    setTasks(prev => [newTask, ...prev]);
    addToast('Task created successfully', 'success');
  }, [addToast]);

  const updateTask = useCallback((id: string, updates: Partial<Task>) => {
    setTasks(prev => prev.map(t => {
      if (t.id === id) {
        return {
          ...t,
          ...updates,
          updatedAt: new Date().toISOString(),
        };
      }
      return t;
    }));
    addToast('Task updated', 'info');
  }, [addToast]);

  const deleteTask = useCallback((id: string) => {
    const taskToDelete = tasks.find(t => t.id === id);
    if (!taskToDelete) return;

    setTasks(prev => prev.filter(t => t.id !== id));
    addToast('Task removed', 'info', {
      label: 'Undo',
      onClick: () => {
        setTasks(prev => [taskToDelete, ...prev]);
        addToast('Task restored', 'success');
      }
    });
  }, [tasks, addToast]);

  const toggleTaskComplete = useCallback((id: string) => {
    setTasks(prev => prev.map(t => {
      if (t.id === id) {
        const nextCompleted = !t.completed;
        const now = new Date().toISOString();
        return {
          ...t,
          completed: nextCompleted,
          completedAt: nextCompleted ? now : undefined,
          updatedAt: now,
        };
      }
      return t;
    }));

    const task = tasks.find(t => t.id === id);
    if (task) {
      const willBeCompleted = !task.completed;
      addToast(
        willBeCompleted ? 'Task marked as completed' : 'Task restored to pending',
        'success',
        {
          label: 'Undo',
          onClick: () => {
            setTasks(p => p.map(item => item.id === id ? { ...item, completed: task.completed, completedAt: task.completedAt } : item));
          }
        }
      );
    }
  }, [tasks, addToast]);

  const toggleTaskImportant = useCallback((id: string) => {
    setTasks(prev => prev.map(t => {
      if (t.id === id) {
        const nextImportant = !t.important;
        return {
          ...t,
          important: nextImportant,
          updatedAt: new Date().toISOString(),
        };
      }
      return t;
    }));
  }, []);

  const restoreTask = useCallback((id: string) => {
    setTasks(prev => prev.map(t => {
      if (t.id === id) {
        return {
          ...t,
          completed: false,
          completedAt: undefined,
          updatedAt: new Date().toISOString(),
        };
      }
      return t;
    }));
    addToast('Task restored to active', 'info');
  }, [addToast]);

  const clearCompletedTasks = useCallback(() => {
    const completedList = tasks.filter(t => t.completed);
    if (completedList.length === 0) return;

    setTasks(prev => prev.filter(t => !t.completed));
    addToast(`${completedList.length} completed task${completedList.length > 1 ? 's' : ''} removed`, 'info', {
      label: 'Undo',
      onClick: () => {
        setTasks(prev => [...completedList, ...prev]);
        addToast('Completed tasks restored', 'success');
      }
    });
  }, [tasks, addToast]);

  const duplicateTask = useCallback((id: string) => {
    const target = tasks.find(t => t.id === id);
    if (!target) return;
    const now = new Date().toISOString();
    const cloned: Task = {
      ...target,
      id: 'task-' + Math.random().toString(36).substring(2, 9),
      title: `${target.title} (Copy)`,
      completed: false,
      completedAt: undefined,
      createdAt: now,
      updatedAt: now,
    };
    setTasks(prev => [cloned, ...prev]);
    addToast('Task duplicated', 'info');
  }, [tasks, addToast]);

  const resetToSampleData = useCallback(() => {
    const sample = getInitialTasks();
    setTasks(sample);
    localStorage.setItem(STORAGE_KEY_TASKS, JSON.stringify(sample));
    addToast('Reset to original editorial sample tasks', 'info');
  }, [addToast]);

  const exportData = useCallback(() => {
    try {
      const dataStr = JSON.stringify({
        product: 'TASKFLOW',
        exportedAt: new Date().toISOString(),
        tasks,
      }, null, 2);
      const blob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `taskflow-backup-${getTodayString()}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      addToast('Data exported successfully', 'success');
    } catch {
      addToast('Failed to export data', 'danger');
    }
  }, [tasks, addToast]);

  const importData = useCallback((jsonStr: string): boolean => {
    try {
      const parsed = JSON.parse(jsonStr);
      if (Array.isArray(parsed.tasks)) {
        setTasks(parsed.tasks);
        addToast(`Successfully imported ${parsed.tasks.length} tasks`, 'success');
        return true;
      } else if (Array.isArray(parsed)) {
        setTasks(parsed);
        addToast(`Successfully imported ${parsed.length} tasks`, 'success');
        return true;
      }
      addToast('Invalid JSON file format', 'danger');
      return false;
    } catch {
      addToast('Failed to parse JSON file', 'danger');
      return false;
    }
  }, [addToast]);

  const markNotificationAsRead = useCallback((id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  }, []);

  const markAllNotificationsAsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    addToast('All notifications marked as read', 'info');
  }, [addToast]);

  // Statistics calculation
  const todayStr = getTodayString();

  const todayStats = useMemo(() => {
    const todayTasks = tasks.filter(t => t.dueDate === todayStr);
    const total = todayTasks.length;
    const completed = todayTasks.filter(t => t.completed).length;
    const remaining = total - completed;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { total, completed, remaining, percentage };
  }, [tasks, todayStr]);

  const overallStats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const remaining = total - completed;
    const important = tasks.filter(t => t.important && !t.completed).length;
    return { total, completed, remaining, important };
  }, [tasks]);

  const categoryCounts = useMemo(() => {
    const counts: Record<Category, number> = {
      Personal: 0,
      Study: 0,
      Work: 0,
      Other: 0,
    };
    tasks.forEach(t => {
      if (!t.completed && counts[t.category] !== undefined) {
        counts[t.category]++;
      }
    });
    return counts;
  }, [tasks]);

  const viewCounts = useMemo(() => {
    const myTasks = tasks.filter(t => !t.completed).length;
    const today = tasks.filter(t => t.dueDate === todayStr && !t.completed).length;
    const upcoming = tasks.filter(t => t.dueDate > todayStr && !t.completed).length;
    const completed = tasks.filter(t => t.completed).length;
    const important = tasks.filter(t => (t.important || t.priority === 'high') && !t.completed).length;
    return { myTasks, today, upcoming, completed, important };
  }, [tasks, todayStr]);

  const value = {
    tasks,
    activeView,
    selectedCategory,
    searchQuery,
    setSearchQuery,
    sortConfig,
    setSortConfig,
    statusFilter,
    setStatusFilter,
    priorityFilter,
    setPriorityFilter,
    setActiveView,
    isTaskModalOpen,
    editingTask,
    modalDefaults,
    openCreateModal,
    openEditModal,
    closeTaskModal,
    isSettingsOpen,
    setIsSettingsOpen,
    isNotificationsOpen,
    setIsNotificationsOpen,
    workspaces,
    activeWorkspace,
    setActiveWorkspace,
    userProfile,
    updateUserProfile,
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    toasts,
    addToast,
    removeToast,
    addTask,
    updateTask,
    deleteTask,
    toggleTaskComplete,
    toggleTaskImportant,
    restoreTask,
    clearCompletedTasks,
    duplicateTask,
    resetToSampleData,
    exportData,
    importData,
    todayStats,
    overallStats,
    categoryCounts,
    viewCounts,
  };

  return (
    <TaskContext.Provider value={value}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = (): TaskContextType => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
};
