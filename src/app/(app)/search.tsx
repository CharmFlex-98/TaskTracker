import { useMemo, useState } from 'react';
import { RefreshControl, View } from 'react-native';

import { FeedbackState } from '@/components/feedback-state';
import { FormField } from '@/components/form-field';
import { IconButton } from '@/components/icon-button';
import { Screen } from '@/components/screen';
import { SegmentedOptions } from '@/components/segmented-options';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useProjectsQuery } from '@/features/projects/project-queries';
import { TaskCard } from '@/features/tasks/task-card';
import { useTasksQuery } from '@/features/tasks/task-queries';
import { toTaskSummary } from '@/features/task-planner/task-planner-adapters';
import { useTheme } from '@/hooks/use-theme';
import type { TaskResponse } from '@/features/tasks/types';

const statusOptions = ['all', 'todo', 'in_progress', 'blocked', 'done'] as const;
const priorityOptions = ['all', 'low', 'medium', 'high', 'urgent'] as const;

const statusLabels: Record<(typeof statusOptions)[number], string> = {
  all: 'All',
  blocked: 'Blocked',
  done: 'Done',
  in_progress: 'In progress',
  todo: 'To do',
};

const priorityLabels: Record<(typeof priorityOptions)[number], string> = {
  all: 'All',
  high: 'High',
  low: 'Low',
  medium: 'Medium',
  urgent: 'Urgent',
};

export default function SearchScreen() {
  const theme = useTheme();
  const [showMatches, setShowMatches] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [status, setStatus] = useState<(typeof statusOptions)[number]>('all');
  const [priority, setPriority] = useState<(typeof priorityOptions)[number]>('all');
  const filters = useMemo(
    () => ({
      priority: priority === 'all' ? undefined : priority,
      q: searchText.trim() || undefined,
      status: status === 'all' ? undefined : status,
    }),
    [priority, searchText, status]
  );
  const tasksQuery = useTasksQuery(filters);
  const projectsQuery = useProjectsQuery();
  const tasks = tasksQuery.data ?? [];
  const isRefreshing = tasksQuery.isRefetching || projectsQuery.isRefetching;

  function refreshSearch() {
    void tasksQuery.refetch();
    void projectsQuery.refetch();
  }

  return (
    <Screen refreshControl={<RefreshControl refreshing={isRefreshing} tintColor={theme.text} onRefresh={refreshSearch} />}>
      <View style={{ alignItems: 'flex-start', flexDirection: 'row', gap: Spacing.two }}>
        <ThemedView style={{ flex: 1, gap: Spacing.two }}>
          <ThemedText type="subtitle" selectable>
            Search
          </ThemedText>
          <ThemedText themeColor="textSecondary" selectable>
            Search tasks through backend query parameters.
          </ThemedText>
        </ThemedView>
        <IconButton
          label={showMatches ? 'Hide matches' : 'Show matches'}
          symbol={showMatches ? 'x' : '+'}
          onPress={() => setShowMatches((current) => !current)}
        />
      </View>

      <FormField label="Search text" value={searchText} onChangeText={setSearchText} placeholder="Task title or description" />
      <SegmentedOptions label="Status" value={status} options={statusOptions} labels={statusLabels} onChange={setStatus} />
      <SegmentedOptions
        label="Priority"
        value={priority}
        options={priorityOptions}
        labels={priorityLabels}
        onChange={setPriority}
      />

      {tasksQuery.isLoading || projectsQuery.isLoading ? (
        <FeedbackState title="Searching" message="Loading matching tasks." variant="loading" />
      ) : null}

      {tasksQuery.error || projectsQuery.error ? (
        <FeedbackState
          title="Search unavailable"
          message={tasksQuery.error?.message ?? projectsQuery.error?.message ?? 'Search could not be loaded.'}
          variant="error"
        />
      ) : null}

      <ThemedView style={{ gap: Spacing.two }}>
        <ThemedText type="smallBold" selectable>
          Matches
        </ThemedText>
        {!showMatches ? (
          <FeedbackState title="Matches hidden" message="Use the icon button to show matches again." />
        ) : tasks.length === 0 && !tasksQuery.isLoading ? (
          <FeedbackState title="No matches" message="No tasks match the current filters." />
        ) : (
          tasks.map((task: TaskResponse) => (
            <TaskCard
              key={task.id}
              task={toTaskSummary(
                task,
                projectsQuery.data?.find((project) => project.id === task.projectId)
              )}
            />
          ))
        )}
      </ThemedView>
    </Screen>
  );
}
