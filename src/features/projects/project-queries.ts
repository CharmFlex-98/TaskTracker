import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { projectQueryKeys } from '@/features/projects/project-query-keys';
import { createProject, deleteProject, getProject, listProjects, updateProject } from '@/features/projects/projects-api';
import type { UpdateProjectRequest } from '@/features/projects/types';
import { taskQueryKeys } from '@/features/tasks/task-query-keys';

export function useProjectsQuery() {
  return useQuery({
    queryFn: listProjects,
    queryKey: projectQueryKeys.projects,
  });
}

export function useProjectQuery(projectId: string) {
  return useQuery({
    enabled: Boolean(projectId),
    queryFn: () => getProject(projectId),
    queryKey: projectQueryKeys.project(projectId),
  });
}

export function useCreateProjectMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: projectQueryKeys.projects });
    },
  });
}

export function useUpdateProjectMutation(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: UpdateProjectRequest) => updateProject(projectId, request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: projectQueryKeys.projects });
      queryClient.invalidateQueries({ queryKey: projectQueryKeys.project(projectId) });
    },
  });
}

export function useDeleteProjectMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: projectQueryKeys.projects });
      queryClient.invalidateQueries({ queryKey: taskQueryKeys.tasksRoot });
    },
  });
}
