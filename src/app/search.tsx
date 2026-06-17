import { View } from 'react-native';

import { Screen } from '@/components/screen';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { tasks } from '@/features/tasks/sample-data';
import { TaskCard } from '@/features/tasks/task-card';

const quickFilters = ['Assigned to me', 'High priority', 'Due this week', 'Blocked'];

export default function SearchScreen() {
  return (
    <Screen>
      <ThemedView style={{ gap: Spacing.two }}>
        <ThemedText type="subtitle" selectable>
          Search
        </ThemedText>
        <ThemedText themeColor="textSecondary" selectable>
          Search and filters will use backend query parameters after the API client is added.
        </ThemedText>
      </ThemedView>

      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.two }}>
        {quickFilters.map((filter) => (
          <ThemedView
            key={filter}
            type="backgroundElement"
            style={{
              paddingHorizontal: Spacing.three,
              paddingVertical: Spacing.two,
              borderRadius: 8,
              borderCurve: 'continuous',
            }}>
            <ThemedText type="small" selectable>
              {filter}
            </ThemedText>
          </ThemedView>
        ))}
      </View>

      <ThemedView style={{ gap: Spacing.two }}>
        <ThemedText type="smallBold" selectable>
          Recent matches
        </ThemedText>
        {tasks.slice(0, 4).map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </ThemedView>
    </Screen>
  );
}
