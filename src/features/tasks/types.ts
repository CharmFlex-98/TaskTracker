export type TaskResponse = {
  id: string;
  projectId: string;
  title: string;
  description: string | null;
  status: 'todo' | 'in_progress' | 'blocked' | 'done';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  dueDate: string | null;
  progress: number;
  createdAt: string;
  updatedAt: string;
};

export type CreateTaskRequest = {
  projectId: string;
  title: string;
  description?: string | null;
  status?: TaskResponse['status'];
  priority?: TaskResponse['priority'];
  dueDate?: string | null;
  progress?: number;
};

export type UpdateTaskRequest = {
  projectId: string;
  title: string;
  description: string | null;
  status: TaskResponse['status'];
  priority: TaskResponse['priority'];
  dueDate: string | null;
  progress: number;
};

export type TaskListFilters = {
  projectId?: string;
  status?: TaskResponse['status'];
  priority?: TaskResponse['priority'];
  q?: string;
};
