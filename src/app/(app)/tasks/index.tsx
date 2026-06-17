import { View } from 'react-native';

import { FeedbackState } from '@/components/feedback-state';
import { LinkButton } from '@/components/link-button';
import { Screen } from '@/components/screen';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { boardColumns } from '@/features/tasks/sample-data';
import { TaskCard } from '@/features/tasks/task-card';

export default function TasksScreen() {
  return (
    <Screen>
      <ThemedView style={{ gap: Spacing.two }}>
        <ThemedText type="subtitle" selectable>
          My tasks
        </ThemedText>
        <ThemedText themeColor="textSecondary" selectable>
          A mobile board view grouped by status. CRUD and status transitions will attach here.
        </ThemedText>
      </ThemedView>

      <View style={{ alignItems: 'flex-start' }}>
        <LinkButton href="/tasks/new" label="New task" />
      </View>

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
