import { useState } from 'react';
import { View } from 'react-native';

import { ActionButton } from '@/components/action-button';
import { FieldPreview } from '@/components/field-preview';
import { FormField } from '@/components/form-field';
import { Screen } from '@/components/screen';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';

export default function NewProjectScreen() {
  const [name, setName] = useState('');
  const [key, setKey] = useState('');
  const [description, setDescription] = useState('');
  const [lead, setLead] = useState('');
  const [draftSaved, setDraftSaved] = useState(false);

  return (
    <Screen keyboardShouldPersistTaps="handled">
      <ThemedView style={{ gap: Spacing.two }}>
        <ThemedText type="subtitle" selectable>
          New project
        </ThemedText>
        <ThemedText themeColor="textSecondary" selectable>
          This is the create-project form shell. Saving is local-only until the API mutation is added.
        </ThemedText>
      </ThemedView>

      <FormField label="Project name" value={name} onChangeText={setName} placeholder="Mobile task planner" />
      <FormField label="Project key" value={key} onChangeText={setKey} placeholder="MOB" autoCapitalize="characters" />
      <FormField
        label="Description"
        value={description}
        onChangeText={setDescription}
        placeholder="What this project is responsible for"
        multiline
        style={{ minHeight: 96, textAlignVertical: 'top' }}
      />
      <FormField label="Lead" value={lead} onChangeText={setLead} placeholder="Project owner" />

      <View style={{ alignItems: 'flex-start' }}>
        <ActionButton label="Preview draft" onPress={() => setDraftSaved(true)} />
      </View>

      {draftSaved ? (
        <ThemedView style={{ gap: Spacing.two }}>
          <ThemedText type="smallBold" selectable>
            Draft preview
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
