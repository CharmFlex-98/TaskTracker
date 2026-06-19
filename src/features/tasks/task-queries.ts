import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { projectQueryKeys } from '@/features/projects/project-query-keys';
import { taskQueryKeys } from '@/features/tasks/task-query-keys';
import { createTask, deleteTask, getTask, listTasks, updateTask } from '@/features/tasks/tasks-api';
import type { TaskListFilters, UpdateTaskRequest } from '@/features/tasks/types';

export function useTasksQuery(filters: TaskListFilters = {}) {
  return useQuery({
    queryFn: () => listTasks(filters),
    queryKey: taskQueryKeys.tasks(filters),
  });
}

export function useTaskQuery(taskId: string) {
  return useQuery({
    enabled: Boolean(taskId),
    queryFn: () => getTask(taskId),
    queryKey: taskQueryKeys.task(taskId),
  });
}

export function useCreateTaskMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTask,
    onSuccess: (task) => {
      queryClient.invalidateQueries({ queryKey: taskQueryKeys.tasksRoot });
      queryClient.invalidateQueries({ queryKey: projectQueryKeys.projects });
      queryClient.invalidateQueries({ queryKey: projectQueryKeys.project(task.projectId) });
    },
  });
}

export function useUpdateTaskMutation(taskId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: UpdateTaskRequest) => updateTask(taskId, request),
    onSuccess: (task) => {
      queryClient.invalidateQueries({ queryKey: taskQueryKeys.tasksRoot });
      queryClient.invalidateQueries({ queryKey: taskQueryKeys.task(taskId) });
      queryClient.invalidateQueries({ queryKey: projectQueryKeys.projects });
      queryClient.invalidateQueries({ queryKey: projectQueryKeys.project(task.projectId) });
    },
  });
}

export function useDeleteTaskMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taskQueryKeys.tasksRoot });
      queryClient.invalidateQueries({ queryKey: projectQueryKeys.projects });
    },
  });
}
