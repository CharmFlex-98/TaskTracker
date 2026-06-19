import type { TaskListFilters } from '@/features/tasks/types';

export const taskQueryKeys = {
  task: (taskId: string) => ['tasks', 'detail', taskId] as const,
  tasks: (filters?: TaskListFilters) => ['tasks', filters ?? 'all'] as const,
  tasksRoot: ['tasks'] as const,
};
