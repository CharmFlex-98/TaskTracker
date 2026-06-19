import { RefreshControl, View } from 'react-native';

import { FeedbackState } from '@/components/feedback-state';
import { LinkButton } from '@/components/link-button';
import { Screen } from '@/components/screen';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { TaskCard } from '@/features/tasks/task-card';
import { useProjectsQuery } from '@/features/projects/project-queries';
import { useTasksQuery } from '@/features/tasks/task-queries';
import { toBoardColumns } from '@/features/task-planner/task-planner-adapters';
import { useTheme } from '@/hooks/use-theme';

export default function TasksScreen() {
  const theme = useTheme();
  const projectsQuery = useProjectsQuery();
  const tasksQuery = useTasksQuery();
  const boardColumns = toBoardColumns(tasksQuery.data ?? [], projectsQuery.data ?? []);
  const isRefreshing = projectsQuery.isRefetching || tasksQuery.isRefetching;

  function refreshTasks() {
    void projectsQuery.refetch();
    void tasksQuery.refetch();
  }

  return (
    <Screen refreshControl={<RefreshControl refreshing={isRefreshing} tintColor={theme.text} onRefresh={refreshTasks} />}>
      <ThemedView style={{ gap: Spacing.two }}>
        <ThemedText type="subtitle" selectable>
          My tasks
        </ThemedText>
        <ThemedText themeColor="textSecondary" selectable>
          A mobile board view grouped by status from the Spring Boot task API.
        </ThemedText>
      </ThemedView>

      <View style={{ alignItems: 'flex-start' }}>
        <LinkButton href="/tasks/new" label="New task" />
      </View>

      {projectsQuery.isLoading || tasksQuery.isLoading ? (
        <ThemedText themeColor="textSecondary" selectable>
          Loading tasks...
        </ThemedText>
      ) : null}

      {projectsQuery.error || tasksQuery.error ? (
        <FeedbackState
          title="Tasks unavailable"
          message={projectsQuery.error?.message ?? tasksQuery.error?.message ?? 'Tasks could not be loaded.'}
          variant="error"
        />
      ) : null}

      {boardColumns.map((column) => (
        <ThemedView key={column.status} style={{ gap: Spacing.two }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <ThemedText type="smallBold" selectable>
              {column.title}
            </ThemedText>
            <ThemedText type="small" themeColor="textSecondary" selectable>
              {column.tasks.length}
            </ThemedText>
          </View>

          {column.tasks.length === 0 ? (
            <FeedbackState
              title="No tasks"
              message={`No tasks are currently in ${column.title.toLowerCase()}.`}
            />
          ) : (
            column.tasks.map((task) => <TaskCard key={task.id} task={task} />)
          )}
        </ThemedView>
      ))}
    </Screen>
  );
}
