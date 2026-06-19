export const projectQueryKeys = {
  project: (projectId: string) => ['projects', projectId] as const,
  projects: ['projects'] as const,
};
