import { useState } from 'react';
import { View } from 'react-native';

import { ActionButton } from '@/components/action-button';
import { FieldPreview } from '@/components/field-preview';
import { FormField } from '@/components/form-field';
import { Screen } from '@/components/screen';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';

export default function NewTaskScreen() {
  const [title, setTitle] = useState('');
  const [projectKey, setProjectKey] = useState('');
  const [assignee, setAssignee] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [description, setDescription] = useState('');
  const [draftSaved, setDraftSaved] = useState(false);

  return (
    <Screen keyboardShouldPersistTaps="handled">
      <ThemedView style={{ gap: Spacing.two }}>
        <ThemedText type="subtitle" selectable>
          New task
        </ThemedText>
        <ThemedText themeColor="textSecondary" selectable>
          This is the create-task form shell. Saving is local-only until the API mutation is added.
        </ThemedText>
      </ThemedView>

      <FormField label="Title" value={title} onChangeText={setTitle} placeholder="Build task detail screen" />
      <FormField label="Project key" value={projectKey} onChangeText={setProjectKey} placeholder="MOB" />
      <FormField label="Assignee" value={assignee} onChangeText={setAssignee} placeholder="Jiaming" />
      <FormField label="Due date" value={dueDate} onChangeText={setDueDate} placeholder="Jun 30" />
      <FormField
        label="Description"
        value={description}
        onChangeText={setDescription}
        placeholder="Acceptance criteria and context"
        multiline
        style={{ minHeight: 96, textAlignVertical: 'top' }}
      />

      <View style={{ alignItems: 'flex-start' }}>
        <ActionButton label="Preview draft" onPress={() => setDraftSaved(true)} />
      </View>

      {draftSaved ? (
        <ThemedView style={{ gap: Spacing.two }}>
          <ThemedText type="smallBold" selectable>
            Draft preview
          </ThemedText>
          <FieldPreview label="Title" value={title} />
          <FieldPreview label="Project key" value={projectKey} />
          <FieldPreview label="Assignee" value={assignee} />
          <FieldPreview label="Due date" value={dueDate} />
          <FieldPreview label="Description" value={description} />
        </ThemedView>
      ) : null}
    </Screen>
  );
}
