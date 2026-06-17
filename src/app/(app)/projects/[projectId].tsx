import { useLocalSearchParams } from 'expo-router';
import { View } from 'react-native';

import { FieldPreview } from '@/components/field-preview';
import { LinkButton } from '@/components/link-button';
import { Screen } from '@/components/screen';
import { StatCard } from '@/components/stat-card';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { getProjectById, getTasksByProjectKey } from '@/features/tasks/sample-data';
import { TaskCard } from '@/features/tasks/task-card';

export default function ProjectDetailScreen() {
  const { projectId } = useLocalSearchParams<{ projectId?: string }>();

  if (typeof projectId !== 'string') {
    return <MissingProject message="Project route is missing a valid project id." />;
  }

  const project = getProjectById(projectId);

  if (!project) {
    return <MissingProject message="Project was not found in the local sample data." />;
  }

  const projectTasks = getTasksByProjectKey(project.key);
  const completion = Math.round((project.completedCount / project.taskCount) * 100);

  return (
    <Screen>
      <ThemedView style={{ gap: Spacing.two }}>
        <ThemedText type="subtitle" selectable>
          {project.name}
        </ThemedText>
        <ThemedText themeColor="textSecondary" selectable>
          {project.description}
        </ThemedText>
      </ThemedView>

      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
        <StatCard label="Key" value={project.key} detail="Project code" />
        <StatCard label="Done" value={`${completion}%`} detail="Completion" />
        <StatCard label="Tasks" value={String(project.taskCount)} detail="Planned work" />
      </View>

      <FieldPreview label="Lead" value={project.lead} />
      <FieldPreview label="Last update" value={project.updatedAt} />

      <View style={{ alignItems: 'flex-start', flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.two }}>
        <LinkButton
          href={{ pathname: '/projects/[projectId]/edit', params: { projectId } }}
          label="Edit project"
        />
        <LinkButton href="/tasks/new" label="Add task" />
      </View>

      <ThemedView style={{ gap: Spacing.two }}>
        <ThemedText type="smallBold" selectable>
          Project tasks
        </ThemedText>
        {projectTasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </ThemedView>
    </Screen>
  );
}

function MissingProject({ message }: { message: string }) {
  return (
    <Screen>
      <ThemedText type="subtitle" selectable>
        Project unavailable
      </ThemedText>
      <ThemedText themeColor="textSecondary" selectable>
        {message}
      </ThemedText>
      <View style={{ alignItems: 'flex-start' }}>
        <LinkButton href="/projects" label="Back to projects" />
      </View>
    </Screen>
  );
}
