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
import { useProjectsQuery } from '@/features/projects/project-queries';
import { useDeleteTaskMutation, useTaskQuery, useUpdateTaskMutation } from '@/features/tasks/task-queries';
import { toTaskSummary } from '@/features/task-planner/task-planner-adapters';
import { useTheme } from '@/hooks/use-theme';
import type { TaskResponse } from '@/features/tasks/types';

const nextStatusByStatus: Record<TaskResponse['status'], TaskResponse['status']> = {
  blocked: 'in_progress',
  done: 'todo',
  in_progress: 'done',
  todo: 'in_progress',
};

export default function TaskDetailScreen() {
  const { taskId } = useLocalSearchParams<{ taskId?: string }>();

  if (typeof taskId !== 'string') {
    return <MissingTask message="Task route is missing a valid task id." />;
  }

  return <TaskDetailContent taskId={taskId} />;
}

function TaskDetailContent({ taskId }: { taskId: string }) {
  const router = useRouter();
  const theme = useTheme();
  const taskQuery = useTaskQuery(taskId);
  const projectsQuery = useProjectsQuery();
  const deleteTaskMutation = useDeleteTaskMutation();
  const updateTaskMutation = useUpdateTaskMutation(taskId);
  const task = taskQuery.data;
  const project = task ? projectsQuery.data?.find((candidate) => candidate.id === task.projectId) : undefined;
  const taskSummary = task ? toTaskSummary(task, project) : null;
  const isRefreshing = taskQuery.isRefetching || projectsQuery.isRefetching;

  function refreshTask() {
    void taskQuery.refetch();
    void projectsQuery.refetch();
  }

  async function handleDeleteTask() {
    await deleteTaskMutation.mutateAsync(taskId);
    router.replace('/tasks');
  }

  async function handleAdvanceStatus() {
    if (!task) return;
    await updateTaskMutation.mutateAsync({
      description: task.description,
      dueDate: task.dueDate,
      priority: task.priority,
      progress: nextStatusByStatus[task.status] === 'done' ? 100 : task.progress,
      projectId: task.projectId,
      status: nextStatusByStatus[task.status],
      title: task.title,
    });
  }

  return (
    <Screen refreshControl={<RefreshControl refreshing={isRefreshing} tintColor={theme.text} onRefresh={refreshTask} />}>
      {taskQuery.isLoading || projectsQuery.isLoading ? (
        <FeedbackState title="Loading task" message="Task details are loading." variant="loading" />
      ) : null}

      {taskQuery.error || projectsQuery.error ? (
        <FeedbackState
          title="Task unavailable"
          message={taskQuery.error?.message ?? projectsQuery.error?.message ?? 'Task could not be loaded.'}
          variant="error"
        />
      ) : null}

      {task && taskSummary ? (
        <>
          <ThemedView style={{ gap: Spacing.two }}>
            <ThemedText type="code" themeColor="textSecondary" selectable>
              {taskSummary.key}
            </ThemedText>
            <ThemedText type="subtitle" selectable>
              {task.title}
            </ThemedText>
            <ThemedText themeColor="textSecondary" selectable>
              {task.description ?? 'No description yet.'}
            </ThemedText>
          </ThemedView>

          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
            <StatCard label="Progress" value={`${task.progress}%`} detail="Current estimate" />
            <StatCard label="Project" value={taskSummary.projectKey} detail="Project key" />
          </View>

          <FieldPreview label="Status" value={task.status} />
          <FieldPreview label="Priority" value={task.priority} />
          <FieldPreview label="Due date" value={task.dueDate ?? 'No due date'} />
          <FieldPreview label="Last update" value={new Date(task.updatedAt).toLocaleDateString()} />

          {deleteTaskMutation.error ? (
            <FeedbackState title="Task not deleted" message={deleteTaskMutation.error.message} variant="error" />
          ) : null}

          {updateTaskMutation.error ? (
            <FeedbackState title="Status not updated" message={updateTaskMutation.error.message} variant="error" />
          ) : null}

          <View style={{ alignItems: 'flex-start', flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.two }}>
            <LinkButton href={{ pathname: '/tasks/[taskId]/edit', params: { taskId } }} label="Edit task" />
            <LinkButton href={{ pathname: '/tasks/new', params: { projectId: task.projectId } }} label="Create similar task" />
            <ActionButton
              disabled={updateTaskMutation.isPending}
              label={updateTaskMutation.isPending ? 'Updating...' : 'Advance status'}
              onPress={handleAdvanceStatus}
            />
            <ActionButton
              disabled={deleteTaskMutation.isPending}
              label={deleteTaskMutation.isPending ? 'Deleting...' : 'Delete task'}
              onPress={handleDeleteTask}
            />
          </View>
        </>
      ) : null}
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
