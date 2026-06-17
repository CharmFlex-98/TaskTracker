import { useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';

import { ActionButton } from '@/components/action-button';
import { FieldPreview } from '@/components/field-preview';
import { FormField } from '@/components/form-field';
import { LinkButton } from '@/components/link-button';
import { Screen } from '@/components/screen';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { getProjectById } from '@/features/tasks/sample-data';
import type { ProjectSummary } from '@/types/task-planner';

export default function EditProjectScreen() {
  const { projectId } = useLocalSearchParams<{ projectId?: string }>();

  if (typeof projectId !== 'string') {
    return <MissingProject message="Project route is missing a valid project id." />;
  }

  const project = getProjectById(projectId);

  if (!project) {
    return <MissingProject message="Project was not found in the local sample data." />;
  }

  return <EditProjectForm project={project} />;
}

function EditProjectForm({ project }: { project: ProjectSummary }) {
  const [name, setName] = useState(project.name);
  const [key, setKey] = useState(project.key);
  const [description, setDescription] = useState(project.description);
  const [lead, setLead] = useState(project.lead);
  const [previewSaved, setPreviewSaved] = useState(false);

  return (
    <Screen keyboardShouldPersistTaps="handled">
      <ThemedView style={{ gap: Spacing.two }}>
        <ThemedText type="subtitle" selectable>
          Edit project
        </ThemedText>
        <ThemedText themeColor="textSecondary" selectable>
          Update the local draft values for {project.name}. API persistence will be added later.
        </ThemedText>
      </ThemedView>

      <FormField label="Project name" value={name} onChangeText={setName} />
      <FormField label="Project key" value={key} onChangeText={setKey} autoCapitalize="characters" />
      <FormField
        label="Description"
        value={description}
        onChangeText={setDescription}
        multiline
        style={{ minHeight: 96, textAlignVertical: 'top' }}
      />
      <FormField label="Lead" value={lead} onChangeText={setLead} />

      <View style={{ alignItems: 'flex-start', flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.two }}>
        <ActionButton label="Preview changes" onPress={() => setPreviewSaved(true)} />
        <LinkButton
          href={{ pathname: '/projects/[projectId]', params: { projectId: project.id } }}
          label="Back to project"
        />
      </View>

      {previewSaved ? (
        <ThemedView style={{ gap: Spacing.two }}>
          <ThemedText type="smallBold" selectable>
            Change preview
          </ThemedText>
          <FieldPreview label="Name" value={name} />
          <FieldPreview label="Key" value={key} />
          <FieldPreview label="Description" value={description} />
          <FieldPreview label="Lead" value={lead} />
        </ThemedView>
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
