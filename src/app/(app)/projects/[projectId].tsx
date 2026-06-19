import { useLocalSearchParams, useRouter } from 'expo-router';
import { RefreshControl, View } from 'react-native';

import { ActionButton } from '@/components/action-button';
import { FeedbackState } from '@/components/feedback-state';
import { FieldPreview } from '@/components/field-preview';
import { LinkButton } from '@/components/link-button';
import { Screen } from '@/components/screen';
import { StatCard } from '@/components/stat-card';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useDeleteProjectMutation, useProjectQuery } from '@/features/projects/project-queries';
import { TaskCard } from '@/features/tasks/task-card';
import { useTasksQuery } from '@/features/tasks/task-queries';
import { toProjectSummary, toTaskSummary } from '@/features/task-planner/task-planner-adapters';
import { useTheme } from '@/hooks/use-theme';

export default function ProjectDetailScreen() {
  const { projectId } = useLocalSearchParams<{ projectId?: string }>();

  if (typeof projectId !== 'string') {
    return <MissingProject message="Project route is missing a valid project id." />;
  }

  return <ProjectDetailContent projectId={projectId} />;
}

function ProjectDetailContent({ projectId }: { projectId: string }) {
  const router = useRouter();
  const theme = useTheme();
  const projectQuery = useProjectQuery(projectId);
  const tasksQuery = useTasksQuery({ projectId });
  const deleteProjectMutation = useDeleteProjectMutation();
  const project = projectQuery.data;
  const projectTasks = tasksQuery.data ?? [];
  const projectSummary = project ? toProjectSummary(project, 0, projectTasks) : null;
  const completion = projectSummary?.taskCount ? Math.round((projectSummary.completedCount / projectSummary.taskCount) * 100) : 0;
  const isRefreshing = projectQuery.isRefetching || tasksQuery.isRefetching;

  function refreshProject() {
    void projectQuery.refetch();
    void tasksQuery.refetch();
  }

  async function handleDeleteProject() {
    await deleteProjectMutation.mutateAsync(projectId);
    router.replace('/projects');
  }

  return (
    <Screen
      refreshControl={<RefreshControl refreshing={isRefreshing} tintColor={theme.text} onRefresh={refreshProject} />}>
      {projectQuery.isLoading || tasksQuery.isLoading ? (
        <FeedbackState title="Loading project" message="Project details are loading." variant="loading" />
      ) : null}

      {projectQuery.error || tasksQuery.error ? (
        <FeedbackState
          title="Project unavailable"
          message={projectQuery.error?.message ?? tasksQuery.error?.message ?? 'Project could not be loaded.'}
          variant="error"
        />
      ) : null}

      {project && projectSummary ? (
        <>
          <ThemedView style={{ gap: Spacing.two }}>
            <ThemedText type="subtitle" selectable>
              {project.name}
            </ThemedText>
            <ThemedText themeColor="textSecondary" selectable>
              {project.description ?? 'No description yet.'}
            </ThemedText>
          </ThemedView>

          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
            <StatCard label="Key" value={projectSummary.key} detail="Generated code" />
            <StatCard label="Done" value={`${completion}%`} detail="Completion" />
            <StatCard label="Tasks" value={String(projectSummary.taskCount)} detail="Planned work" />
          </View>

          <FieldPreview label="Status" value={project.status} />
          <FieldPreview label="Last update" value={projectSummary.updatedAt} />

          {deleteProjectMutation.error ? (
            <FeedbackState title="Project not deleted" message={deleteProjectMutation.error.message} variant="error" />
          ) : null}

          <View style={{ alignItems: 'flex-start', flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.two }}>
            <LinkButton
              href={{ pathname: '/projects/[projectId]/edit', params: { projectId } }}
              label="Edit project"
            />
            <LinkButton href={{ pathname: '/tasks/new', params: { projectId } }} label="Add task" />
            <ActionButton
              disabled={deleteProjectMutation.isPending}
              label={deleteProjectMutation.isPending ? 'Deleting...' : 'Delete project'}
              onPress={handleDeleteProject}
            />
          </View>

          <ThemedView style={{ gap: Spacing.two }}>
            <ThemedText type="smallBold" selectable>
              Project tasks
            </ThemedText>
            {projectTasks.length === 0 ? (
              <FeedbackState title="No tasks" message="This project does not have tasks yet." />
            ) : (
              projectTasks.map((task) => <TaskCard key={task.id} task={toTaskSummary(task, project)} />)
            )}
          </ThemedView>
        </>
      ) : null}
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
