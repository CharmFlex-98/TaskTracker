import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';

import { ActionButton } from '@/components/action-button';
import { FeedbackState } from '@/components/feedback-state';
import { FormField } from '@/components/form-field';
import { LinkButton } from '@/components/link-button';
import { Screen } from '@/components/screen';
import { SegmentedOptions } from '@/components/segmented-options';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useProjectsQuery } from '@/features/projects/project-queries';
import { useTaskQuery, useUpdateTaskMutation } from '@/features/tasks/task-queries';
import type { TaskPriority } from '@/features/task-planner/types';
import type { TaskResponse } from '@/features/tasks/types';

const statusOptions = ['todo', 'in_progress', 'blocked', 'done'] as const satisfies readonly TaskResponse['status'][];
const priorityOptions = ['low', 'medium', 'high', 'urgent'] as const satisfies readonly TaskPriority[];

const statusLabels: Record<TaskResponse['status'], string> = {
  blocked: 'Blocked',
  done: 'Done',
  in_progress: 'In progress',
  todo: 'To do',
};

export default function EditTaskScreen() {
  const { taskId } = useLocalSearchParams<{ taskId?: string }>();

  if (typeof taskId !== 'string') {
    return <MissingTask message="Task route is missing a valid task id." />;
  }

  return <EditTaskForm taskId={taskId} />;
}

function EditTaskForm({ taskId }: { taskId: string }) {
  const router = useRouter();
  const taskQuery = useTaskQuery(taskId);
  const projectsQuery = useProjectsQuery();
  const task = taskQuery.data;

  return (
    <Screen keyboardShouldPersistTaps="handled">
      <ThemedView style={{ gap: Spacing.two }}>
        <ThemedText type="subtitle" selectable>
          Edit task
        </ThemedText>
        <ThemedText themeColor="textSecondary" selectable>
          Update task fields and status through the Spring Boot API.
        </ThemedText>
      </ThemedView>

      {taskQuery.isLoading || projectsQuery.isLoading ? (
        <FeedbackState title="Loading task" message="Task fields are loading." variant="loading" />
      ) : null}

      {taskQuery.error || projectsQuery.error ? (
        <FeedbackState
          title="Task unavailable"
          message={taskQuery.error?.message ?? projectsQuery.error?.message ?? 'Task could not be loaded.'}
          variant="error"
        />
      ) : null}

      {task ? (
        <LoadedTaskForm key={task.id} task={task} projects={projectsQuery.data ?? []} router={router} />
      ) : null}
    </Screen>
  );
}

function LoadedTaskForm({
  task,
  projects,
  router,
}: {
  task: TaskResponse;
  projects: { id: string; name: string }[];
  router: ReturnType<typeof useRouter>;
}) {
  const updateTaskMutation = useUpdateTaskMutation(task.id);
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description ?? '');
  const [projectId, setProjectId] = useState(task.projectId);
  const [status, setStatus] = useState<TaskResponse['status']>(task.status);
  const [priority, setPriority] = useState<TaskPriority>(task.priority);
  const [dueDate, setDueDate] = useState(task.dueDate ?? '');
  const [progress, setProgress] = useState(String(task.progress));

  async function handleUpdateTask() {
    await updateTaskMutation.mutateAsync({
      description,
      dueDate,
      priority,
      progress: Number(progress),
      projectId,
      status,
      title,
    });
    router.replace({ pathname: '/tasks/[taskId]', params: { taskId: task.id } });
  }

  return (
    <>
      <FormField label="Title" value={title} onChangeText={setTitle} />
      <FormField
        label="Description"
        value={description}
        onChangeText={setDescription}
        multiline
        style={{ minHeight: 96, textAlignVertical: 'top' }}
      />
      <SegmentedOptions label="Status" value={status} options={statusOptions} labels={statusLabels} onChange={setStatus} />
      <SegmentedOptions label="Priority" value={priority} options={priorityOptions} onChange={setPriority} />
      <FormField label="Project ID" value={projectId} onChangeText={setProjectId} />
      <ThemedView style={{ flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.two }}>
        {projects.map((project) => (
          <ActionButton key={project.id} label={project.name} onPress={() => setProjectId(project.id)} />
        ))}
      </ThemedView>
      <FormField label="Due date" value={dueDate} onChangeText={setDueDate} placeholder="2026-06-30" />
      <FormField label="Progress" value={progress} onChangeText={setProgress} keyboardType="number-pad" />

      {updateTaskMutation.error ? (
        <FeedbackState title="Task not updated" message={updateTaskMutation.error.message} variant="error" />
      ) : null}

      <View style={{ alignItems: 'flex-start', flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.two }}>
        <ActionButton
          disabled={updateTaskMutation.isPending}
          label={updateTaskMutation.isPending ? 'Saving...' : 'Save task'}
          onPress={handleUpdateTask}
        />
        <LinkButton href={{ pathname: '/tasks/[taskId]', params: { taskId: task.id } }} label="Back to task" />
      </View>
    </>
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
