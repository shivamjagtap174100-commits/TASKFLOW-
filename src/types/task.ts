export type Priority = 'high' | 'medium' | 'low';

export type Category = 'Personal' | 'Study' | 'Work' | 'Other';

export interface Task {
  id: string;
  title: string;
  description?: string;
  category: Category;
  priority: Priority;
  dueDate: string; // YYYY-MM-DD
  dueTime?: string; // HH:mm
  completed: boolean;
  completedAt?: string;
  important: boolean;
  createdAt: string;
  updatedAt: string;
}

export type ViewType = 
  | 'overview' 
  | 'my-tasks' 
  | 'today' 
  | 'upcoming' 
  | 'completed' 
  | 'important' 
  | 'category';

export type SortField = 'dueDate' | 'priority' | 'title' | 'createdAt';
export type SortOrder = 'asc' | 'desc';

export interface SortConfig {
  field: SortField;
  order: SortOrder;
}

export type StatusFilter = 'all' | 'incomplete' | 'completed';

export interface Workspace {
  id: string;
  name: string;
  role: string;
  initials: string;
}

export interface UserProfile {
  name: string;
  role: string;
  initials: string;
}

export interface ToastNotification {
  id: string;
  message: string;
  type: 'success' | 'info' | 'danger';
  action?: {
    label: string;
    onClick: () => void;
  };
}

export interface SystemNotification {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  read: boolean;
  type: 'reminder' | 'system' | 'achievement';
}
