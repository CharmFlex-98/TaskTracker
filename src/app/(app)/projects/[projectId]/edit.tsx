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
import { useProjectQuery, useUpdateProjectMutation } from '@/features/projects/project-queries';
import type { ProjectResponse } from '@/features/projects/types';

const projectStatusOptions = ['active', 'archived'] as const satisfies readonly ProjectResponse['status'][];
const projectStatusLabels: Record<ProjectResponse['status'], string> = {
  active: 'Active',
  archived: 'Archived',
};

export default function EditProjectScreen() {
  const { projectId } = useLocalSearchParams<{ projectId?: string }>();

  if (typeof projectId !== 'string') {
    return <MissingProject message="Project route is missing a valid project id." />;
  }

  return <EditProjectForm projectId={projectId} />;
}

function EditProjectForm({ projectId }: { projectId: string }) {
  const router = useRouter();
  const projectQuery = useProjectQuery(projectId);
  const project = projectQuery.data;

  return (
    <Screen keyboardShouldPersistTaps="handled">
      <ThemedView style={{ gap: Spacing.two }}>
        <ThemedText type="subtitle" selectable>
          Edit project
        </ThemedText>
        <ThemedText themeColor="textSecondary" selectable>
          Update project fields through the Spring Boot API.
        </ThemedText>
      </ThemedView>

      {projectQuery.isLoading ? (
        <FeedbackState title="Loading project" message="Project fields are loading." variant="loading" />
      ) : null}

      {projectQuery.error ? (
        <FeedbackState title="Project unavailable" message={projectQuery.error.message} variant="error" />
      ) : null}

      {project ? (
        <LoadedProjectForm key={project.id} project={project} router={router} />
      ) : null}
    </Screen>
  );
}

function LoadedProjectForm({ project, router }: { project: ProjectResponse; router: ReturnType<typeof useRouter> }) {
  const updateProjectMutation = useUpdateProjectMutation(project.id);
  const [name, setName] = useState(project.name);
  const [description, setDescription] = useState(project.description ?? '');
  const [status, setStatus] = useState<ProjectResponse['status']>(project.status);

  async function handleUpdateProject() {
    await updateProjectMutation.mutateAsync({
      description,
      name,
      status,
    });
    router.replace({ pathname: '/projects/[projectId]', params: { projectId: project.id } });
  }

  return (
    <>
      <FormField label="Project name" value={name} onChangeText={setName} />
      <FormField
        label="Description"
        value={description}
        onChangeText={setDescription}
        multiline
        style={{ minHeight: 96, textAlignVertical: 'top' }}
      />
      <SegmentedOptions
        label="Status"
        value={status}
        options={projectStatusOptions}
        labels={projectStatusLabels}
        onChange={setStatus}
      />

      {updateProjectMutation.error ? (
        <FeedbackState title="Project not updated" message={updateProjectMutation.error.message} variant="error" />
      ) : null}

      <View style={{ alignItems: 'flex-start', flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.two }}>
        <ActionButton
          disabled={updateProjectMutation.isPending}
          label={updateProjectMutation.isPending ? 'Saving...' : 'Save project'}
          onPress={handleUpdateProject}
        />
        <LinkButton href={{ pathname: '/projects/[projectId]', params: { projectId: project.id } }} label="Back to project" />
      </View>
    </>
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
