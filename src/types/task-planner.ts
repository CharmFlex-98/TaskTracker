export type TaskStatus = 'todo' | 'inProgress' | 'review' | 'done' | 'blocked';

export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export type ProjectSummary = {
  id: string;
  key: string;
  name: string;
  description: string;
  lead: string;
  taskCount: number;
  completedCount: number;
  updatedAt: string;
  color: string;
};

export type TaskSummary = {
  id: string;
  key: string;
  title: string;
  projectKey: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignee: string;
  dueDate: string;
  progress: number;
};

export type BoardColumn = {
  status: TaskStatus;
  title: string;
  tasks: TaskSummary[];
};
