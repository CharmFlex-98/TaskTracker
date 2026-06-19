import { RefreshControl, View } from 'react-native';

import { FeedbackState } from '@/components/feedback-state';
import { LinkButton } from '@/components/link-button';
import { Screen } from '@/components/screen';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { ProjectCard } from '@/features/projects/project-card';
import { useProjectsQuery } from '@/features/projects/project-queries';
import { useTasksQuery } from '@/features/tasks/task-queries';
import { toProjectSummary } from '@/features/task-planner/task-planner-adapters';
import { useTheme } from '@/hooks/use-theme';

export default function ProjectsScreen() {
  const theme = useTheme();
  const projectsQuery = useProjectsQuery();
  const tasksQuery = useTasksQuery();
  const projects = projectsQuery.data ?? [];
  const tasks = tasksQuery.data ?? [];
  const isRefreshing = projectsQuery.isRefetching || tasksQuery.isRefetching;

  function refreshProjects() {
    void projectsQuery.refetch();
    void tasksQuery.refetch();
  }

  return (
    <Screen
      refreshControl={<RefreshControl refreshing={isRefreshing} tintColor={theme.text} onRefresh={refreshProjects} />}>
      <ThemedView style={{ gap: Spacing.two }}>
        <ThemedText type="subtitle" selectable>
          Projects
        </ThemedText>
        <ThemedText themeColor="textSecondary" selectable>
          Project data is loaded from the Spring Boot backend with React Query.
        </ThemedText>
      </ThemedView>

      <View style={{ alignItems: 'flex-start' }}>
        <LinkButton href="/projects/new" label="New project" />
      </View>

      {projectsQuery.isLoading || tasksQuery.isLoading ? (
        <ThemedText themeColor="textSecondary" selectable>
          Loading projects...
        </ThemedText>
      ) : null}

      {projectsQuery.error || tasksQuery.error ? (
        <FeedbackState
          title="Projects unavailable"
          message={projectsQuery.error?.message ?? tasksQuery.error?.message ?? 'Projects could not be loaded.'}
          variant="error"
        />
      ) : null}

      {!projectsQuery.isLoading && projects.length === 0 ? (
        <ThemedText themeColor="textSecondary" selectable>
          No projects yet.
        </ThemedText>
      ) : null}

      {projects.map((project, index) => (
        <ProjectCard key={project.id} project={toProjectSummary(project, index, tasks)} />
      ))}
    </Screen>
  );
}
