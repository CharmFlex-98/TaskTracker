import { useState } from 'react';
import { View } from 'react-native';

import { FeedbackState } from '@/components/feedback-state';
import { IconButton } from '@/components/icon-button';
import { Screen } from '@/components/screen';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { tasks } from '@/features/tasks/sample-data';
import { TaskCard } from '@/features/tasks/task-card';

const quickFilters = ['Assigned to me', 'High priority', 'Due this week', 'Blocked'];

export default function SearchScreen() {
  const [showMatches, setShowMatches] = useState(true);

  return (
    <Screen>
      <View style={{ alignItems: 'flex-start', flexDirection: 'row', gap: Spacing.two }}>
        <ThemedView style={{ flex: 1, gap: Spacing.two }}>
          <ThemedText type="subtitle" selectable>
            Search
          </ThemedText>
          <ThemedText themeColor="textSecondary" selectable>
            Search and filters will use backend query parameters after the API client is added.
          </ThemedText>
        </ThemedView>
        <IconButton
          label={showMatches ? 'Hide recent matches' : 'Show recent matches'}
          symbol={showMatches ? 'x' : '+'}
          onPress={() => setShowMatches((current) => !current)}
        />
      </View>

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
        {showMatches ? (
          tasks.slice(0, 4).map((task) => <TaskCard key={task.id} task={task} />)
        ) : (
          <FeedbackState title="Matches hidden" message="Use the icon button to show recent matches again." />
        )}
      </ThemedView>
    </Screen>
  );
}
