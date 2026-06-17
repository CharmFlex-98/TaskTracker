import { View } from 'react-native';

import { Screen } from '@/components/screen';
import { StatCard } from '@/components/stat-card';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { ProjectCard } from '@/features/projects/project-card';
import { TaskCard } from '@/features/tasks/task-card';
import { projects, tasks } from '@/features/tasks/sample-data';

export default function HomeScreen() {
  const completedTasks = tasks.filter((task) => task.status === 'done').length;
  const activeTasks = tasks.filter(
    (task) => task.status === 'inProgress' || task.status === 'review'
  ).length;
  const blockedTasks = tasks.filter((task) => task.status === 'blocked').length;
  const highlightedTasks = tasks.slice(0, 3);

  return (
    <Screen>
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
        <ProjectCard project={projects[0]} />
      </ThemedView>

      <ThemedView style={{ gap: 12 }}>
        <ThemedText type="smallBold" selectable>
          Focus tasks
        </ThemedText>
        {highlightedTasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </ThemedView>
    </Screen>
  );
}
