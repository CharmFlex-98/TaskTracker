import { useLocalSearchParams } from 'expo-router';
import { View } from 'react-native';

import { FieldPreview } from '@/components/field-preview';
import { LinkButton } from '@/components/link-button';
import { Screen } from '@/components/screen';
import { StatCard } from '@/components/stat-card';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { getTaskById } from '@/features/tasks/sample-data';

export default function TaskDetailScreen() {
  const { taskId } = useLocalSearchParams<{ taskId?: string }>();

  if (typeof taskId !== 'string') {
    return <MissingTask message="Task route is missing a valid task id." />;
  }

  const task = getTaskById(taskId);

  if (!task) {
    return <MissingTask message="Task was not found in the local sample data." />;
  }

  return (
    <Screen>
      <ThemedView style={{ gap: Spacing.two }}>
        <ThemedText type="code" themeColor="textSecondary" selectable>
          {task.key}
        </ThemedText>
        <ThemedText type="subtitle" selectable>
          {task.title}
        </ThemedText>
      </ThemedView>

      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
        <StatCard label="Progress" value={`${task.progress}%`} detail="Current estimate" />
        <StatCard label="Project" value={task.projectKey} detail="Project key" />
      </View>

      <FieldPreview label="Status" value={task.status} />
      <FieldPreview label="Priority" value={task.priority} />
      <FieldPreview label="Assignee" value={task.assignee} />
      <FieldPreview label="Due date" value={task.dueDate} />

      <View style={{ alignItems: 'flex-start', flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.two }}>
        <LinkButton href={{ pathname: '/tasks/[taskId]/edit', params: { taskId } }} label="Edit task" />
        <LinkButton href="/tasks/new" label="Create similar task" />
      </View>
    </Screen>
  );
}

function MissingTask({ message }: { message: string }) {
  return (
    <Screen>
      <ThemedText type="subtitle" selectable>
        Task unavailable
      </ThemedText>
      <ThemedText themeColor="textSecondary" selectable>
        {message}
      </ThemedText>
      <View style={{ alignItems: 'flex-start' }}>
        <LinkButton href="/tasks" label="Back to tasks" />
      </View>
    </Screen>
  );
}
