import { useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';

import { ActionButton } from '@/components/action-button';
import { FieldPreview } from '@/components/field-preview';
import { FormField } from '@/components/form-field';
import { LinkButton } from '@/components/link-button';
import { Screen } from '@/components/screen';
import { SegmentedOptions } from '@/components/segmented-options';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { getTaskById } from '@/features/tasks/sample-data';
import type { TaskPriority, TaskStatus, TaskSummary } from '@/types/task-planner';

const statusOptions = ['todo', 'inProgress', 'review', 'done', 'blocked'] as const;
const priorityOptions = ['low', 'medium', 'high', 'urgent'] as const;

const statusLabels: Record<TaskStatus, string> = {
  todo: 'To do',
  inProgress: 'In progress',
  review: 'Review',
  done: 'Done',
  blocked: 'Blocked',
};

export default function EditTaskScreen() {
  const { taskId } = useLocalSearchParams<{ taskId?: string }>();

  if (typeof taskId !== 'string') {
    return <MissingTask message="Task route is missing a valid task id." />;
  }

  const task = getTaskById(taskId);

  if (!task) {
    return <MissingTask message="Task was not found in the local sample data." />;
  }

  return <EditTaskForm task={task} />;
}

function EditTaskForm({ task }: { task: TaskSummary }) {
  const [title, setTitle] = useState(task.title);
  const [status, setStatus] = useState<TaskStatus>(task.status);
  const [priority, setPriority] = useState<TaskPriority>(task.priority);
  const [assignee, setAssignee] = useState(task.assignee);
  const [dueDate, setDueDate] = useState(task.dueDate);
  const [progress, setProgress] = useState(String(task.progress));
  const [previewSaved, setPreviewSaved] = useState(false);

  return (
    <Screen keyboardShouldPersistTaps="handled">
      <ThemedView style={{ gap: Spacing.two }}>
        <ThemedText type="code" themeColor="textSecondary" selectable>
          {task.key}
        </ThemedText>
        <ThemedText type="subtitle" selectable>
          Edit task
        </ThemedText>
        <ThemedText themeColor="textSecondary" selectable>
          Update task draft values. API persistence and optimistic updates will be added later.
        </ThemedText>
      </ThemedView>

      <FormField label="Title" value={title} onChangeText={setTitle} />
      <SegmentedOptions label="Status" value={status} options={statusOptions} labels={statusLabels} onChange={setStatus} />
      <SegmentedOptions label="Priority" value={priority} options={priorityOptions} onChange={setPriority} />
      <FormField label="Assignee" value={assignee} onChangeText={setAssignee} />
      <FormField label="Due date" value={dueDate} onChangeText={setDueDate} />
      <FormField label="Progress" value={progress} onChangeText={setProgress} keyboardType="number-pad" />

      <View style={{ alignItems: 'flex-start', flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.two }}>
        <ActionButton label="Preview changes" onPress={() => setPreviewSaved(true)} />
        <LinkButton href={{ pathname: '/tasks/[taskId]', params: { taskId: task.id } }} label="Back to task" />
      </View>

      {previewSaved ? (
        <ThemedView style={{ gap: Spacing.two }}>
          <ThemedText type="smallBold" selectable>
            Change preview
          </ThemedText>
          <FieldPreview label="Title" value={title} />
          <FieldPreview label="Status" value={statusLabels[status]} />
          <FieldPreview label="Priority" value={priority} />
          <FieldPreview label="Assignee" value={assignee} />
          <FieldPreview label="Due date" value={dueDate} />
          <FieldPreview label="Progress" value={`${progress}%`} />
        </ThemedView>
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
