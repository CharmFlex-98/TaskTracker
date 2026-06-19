import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';

import { ActionButton } from '@/components/action-button';
import { FeedbackState } from '@/components/feedback-state';
import { FieldPreview } from '@/components/field-preview';
import { FormField } from '@/components/form-field';
import { Screen } from '@/components/screen';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useProjectsQuery } from '@/features/projects/project-queries';
import { useCreateTaskMutation } from '@/features/tasks/task-queries';

export default function NewTaskScreen() {
  const router = useRouter();
  const { projectId: routeProjectId } = useLocalSearchParams<{ projectId?: string }>();
  const projectsQuery = useProjectsQuery();
  const createTaskMutation = useCreateTaskMutation();
  const [title, setTitle] = useState('');
  const [projectId, setProjectId] = useState(typeof routeProjectId === 'string' ? routeProjectId : '');
  const [dueDate, setDueDate] = useState('');
  const [description, setDescription] = useState('');
  const [draftSaved, setDraftSaved] = useState(false);

  async function handleCreateTask() {
    const task = await createTaskMutation.mutateAsync({
      description,
      dueDate,
      projectId,
      title,
    });
    router.replace({ pathname: '/tasks/[taskId]', params: { taskId: task.id } });
  }

  return (
    <Screen keyboardShouldPersistTaps="handled">
      <ThemedView style={{ gap: Spacing.two }}>
        <ThemedText type="subtitle" selectable>
          New task
        </ThemedText>
        <ThemedText themeColor="textSecondary" selectable>
          Create a task through the Spring Boot API.
        </ThemedText>
      </ThemedView>

      <FormField label="Title" value={title} onChangeText={setTitle} placeholder="Build task detail screen" />
      <FormField label="Project ID" value={projectId} onChangeText={setProjectId} placeholder="Project UUID" />
      <ThemedView style={{ flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.two }}>
        {(projectsQuery.data ?? []).map((project) => (
          <ActionButton key={project.id} label={project.name} onPress={() => setProjectId(project.id)} />
        ))}
      </ThemedView>
      <FormField label="Due date" value={dueDate} onChangeText={setDueDate} placeholder="2026-06-30" />
      <FormField
        label="Description"
        value={description}
        onChangeText={setDescription}
        placeholder="Acceptance criteria and context"
        multiline
        style={{ minHeight: 96, textAlignVertical: 'top' }}
      />

      {createTaskMutation.error ? (
        <FeedbackState title="Task not created" message={createTaskMutation.error.message} variant="error" />
      ) : null}

      <View style={{ alignItems: 'flex-start' }}>
        <ActionButton
          disabled={createTaskMutation.isPending}
          label={createTaskMutation.isPending ? 'Creating...' : 'Create task'}
          onPress={handleCreateTask}
        />
        <ActionButton label="Preview draft" onPress={() => setDraftSaved(true)} />
      </View>

      {draftSaved ? (
        <ThemedView style={{ gap: Spacing.two }}>
          <ThemedText type="smallBold" selectable>
            Draft preview
          </ThemedText>
          <FieldPreview label="Title" value={title} />
          <FieldPreview label="Project ID" value={projectId} />
          <FieldPreview label="Due date" value={dueDate} />
          <FieldPreview label="Description" value={description} />
        </ThemedView>
      ) : null}
    </Screen>
  );
}
