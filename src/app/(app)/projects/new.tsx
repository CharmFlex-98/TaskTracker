import { useRouter } from 'expo-router';
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
import { useCreateProjectMutation } from '@/features/projects/project-queries';

export default function NewProjectScreen() {
  const router = useRouter();
  const createProjectMutation = useCreateProjectMutation();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [draftSaved, setDraftSaved] = useState(false);

  async function handleCreateProject() {
    const project = await createProjectMutation.mutateAsync({
      description,
      name,
    });
    router.replace({ pathname: '/projects/[projectId]', params: { projectId: project.id } });
  }

  return (
    <Screen keyboardShouldPersistTaps="handled">
      <ThemedView style={{ gap: Spacing.two }}>
        <ThemedText type="subtitle" selectable>
          New project
        </ThemedText>
        <ThemedText themeColor="textSecondary" selectable>
          Create a project through the Spring Boot API.
        </ThemedText>
      </ThemedView>

      <FormField label="Project name" value={name} onChangeText={setName} placeholder="Mobile task planner" />
      <FormField
        label="Description"
        value={description}
        onChangeText={setDescription}
        placeholder="What this project is responsible for"
        multiline
        style={{ minHeight: 96, textAlignVertical: 'top' }}
      />

      {createProjectMutation.error ? (
        <FeedbackState title="Project not created" message={createProjectMutation.error.message} variant="error" />
      ) : null}

      <View style={{ alignItems: 'flex-start' }}>
        <ActionButton
          disabled={createProjectMutation.isPending}
          label={createProjectMutation.isPending ? 'Creating...' : 'Create project'}
          onPress={handleCreateProject}
        />
        <ActionButton label="Preview draft" onPress={() => setDraftSaved(true)} />
      </View>

      {draftSaved ? (
        <ThemedView style={{ gap: Spacing.two }}>
          <ThemedText type="smallBold" selectable>
            Draft preview
          </ThemedText>
          <FieldPreview label="Name" value={name} />
          <FieldPreview label="Description" value={description} />
        </ThemedView>
      ) : null}
    </Screen>
  );
}
