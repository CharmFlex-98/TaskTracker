import { View } from 'react-native';

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
            <ThemedView
              type="backgroundElement"
              style={{ padding: Spacing.three, borderRadius: 8, borderCurve: 'continuous' }}>
              <ThemedText type="small" themeColor="textSecondary" selectable>
                No tasks in this status.
              </ThemedText>
            </ThemedView>
          ) : (
            column.tasks.map((task) => <TaskCard key={task.id} task={task} />)
          )}
        </ThemedView>
      ))}
    </Screen>
  );
}
