import { authenticatedApiRequest } from '@/lib/api/api-client';
import type { CreateProjectRequest, ProjectResponse, UpdateProjectRequest } from '@/features/projects/types';

export function listProjects() {
  return authenticatedApiRequest<ProjectResponse[]>('/api/projects');
}

export function getProject(projectId: string) {
  return authenticatedApiRequest<ProjectResponse>(`/api/projects/${projectId}`);
}

export function createProject(request: CreateProjectRequest) {
  return authenticatedApiRequest<ProjectResponse>('/api/projects', {
    body: request,
    method: 'POST',
  });
}

export function updateProject(projectId: string, request: UpdateProjectRequest) {
  return authenticatedApiRequest<ProjectResponse>(`/api/projects/${projectId}`, {
    body: request,
    method: 'PUT',
  });
}

export function deleteProject(projectId: string) {
  return authenticatedApiRequest<void>(`/api/projects/${projectId}`, {
    method: 'DELETE',
  });
}
