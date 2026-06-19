import { RefreshControl, View } from 'react-native';

import { FeedbackState } from '@/components/feedback-state';
import { Screen } from '@/components/screen';
import { StatCard } from '@/components/stat-card';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { ProjectCard } from '@/features/projects/project-card';
import { useProjectsQuery } from '@/features/projects/project-queries';
import { TaskCard } from '@/features/tasks/task-card';
import { useTasksQuery } from '@/features/tasks/task-queries';
import { toProjectSummary, toTaskSummary } from '@/features/task-planner/task-planner-adapters';
import { useTheme } from '@/hooks/use-theme';

export default function HomeScreen() {
  const theme = useTheme();
  const projectsQuery = useProjectsQuery();
  const tasksQuery = useTasksQuery();
  const projects = projectsQuery.data ?? [];
  const tasks = tasksQuery.data ?? [];
  const completedTasks = tasks.filter((task) => task.status === 'done').length;
  const activeTasks = tasks.filter((task) => task.status === 'in_progress').length;
  const blockedTasks = tasks.filter((task) => task.status === 'blocked').length;
  const highlightedTasks = tasks.slice(0, 3);
  const isRefreshing = projectsQuery.isRefetching || tasksQuery.isRefetching;

  function refreshWorkspace() {
    void projectsQuery.refetch();
    void tasksQuery.refetch();
  }

  return (
    <Screen
      refreshControl={<RefreshControl refreshing={isRefreshing} tintColor={theme.text} onRefresh={refreshWorkspace} />}>
      <ThemedView style={{ gap: 8 }}>
        <ThemedText type="subtitle" selectable>
          Today
        </ThemedText>
        <ThemedText themeColor="textSecondary" selectable>
          Track projects, board progress, and upcoming work from one mobile workspace.
        </ThemedText>
      </ThemedView>

      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
        <StatCard label="Active" value={String(activeTasks)} detail="Tasks in motion" />
        <StatCard label="Done" value={String(completedTasks)} detail="Completed tasks" />
        <StatCard label="Blocked" value={String(blockedTasks)} detail="Needs attention" />
        <StatCard label="Projects" value={String(projects.length)} detail="Tracked spaces" />
      </View>

      <ThemedView style={{ gap: 12 }}>
        <ThemedText type="smallBold" selectable>
          Current project
        </ThemedText>
        {projectsQuery.error || tasksQuery.error ? (
          <FeedbackState
            title="Workspace unavailable"
            message={projectsQuery.error?.message ?? tasksQuery.error?.message ?? 'Workspace data could not be loaded.'}
            variant="error"
          />
        ) : null}
        {projects[0] ? (
          <ProjectCard project={toProjectSummary(projects[0], 0, tasks)} />
        ) : (
          <ThemedText themeColor="textSecondary" selectable>
            Create your first project to start tracking work.
          </ThemedText>
        )}
      </ThemedView>

      <ThemedView style={{ gap: 12 }}>
        <ThemedText type="smallBold" selectable>
          Focus tasks
        </ThemedText>
        {projectsQuery.isLoading || tasksQuery.isLoading ? (
          <ThemedText themeColor="textSecondary" selectable>
            Loading workspace...
          </ThemedText>
        ) : null}
        {highlightedTasks.map((task) => (
          <TaskCard
            key={task.id}
            task={toTaskSummary(
              task,
              projects.find((project) => project.id === task.projectId)
            )}
          />
        ))}
      </ThemedView>
    </Screen>
  );
}
