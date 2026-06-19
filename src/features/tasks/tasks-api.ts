import { authenticatedApiRequest } from '@/lib/api/api-client';
import type { CreateTaskRequest, TaskListFilters, TaskResponse, UpdateTaskRequest } from '@/features/tasks/types';

export function listTasks(filters: TaskListFilters = {}) {
  const params = new URLSearchParams();
  if (filters.projectId) params.set('projectId', filters.projectId);
  if (filters.status) params.set('status', filters.status);
  if (filters.priority) params.set('priority', filters.priority);
  if (filters.q) params.set('q', filters.q);
  const query = params.size > 0 ? `?${params.toString()}` : '';
  return authenticatedApiRequest<TaskResponse[]>(`/api/tasks${query}`);
}

export function getTask(taskId: string) {
  return authenticatedApiRequest<TaskResponse>(`/api/tasks/${taskId}`);
}

export function createTask(request: CreateTaskRequest) {
  return authenticatedApiRequest<TaskResponse>('/api/tasks', {
    body: request,
    method: 'POST',
  });
}

export function updateTask(taskId: string, request: UpdateTaskRequest) {
  return authenticatedApiRequest<TaskResponse>(`/api/tasks/${taskId}`, {
    body: request,
    method: 'PUT',
  });
}

export function deleteTask(taskId: string) {
  return authenticatedApiRequest<void>(`/api/tasks/${taskId}`, {
    method: 'DELETE',
  });
}
