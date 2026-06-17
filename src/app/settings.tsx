import { Screen } from '@/components/screen';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';

const settingsSections = [
  {
    title: 'Account',
    detail: 'Google OAuth, secure token storage, and logout will be implemented here.',
  },
  {
    title: 'Backend',
    detail: 'The API base URL will come from EXPO_PUBLIC_API_URL and call the Spring Boot service.',
  },
  {
    title: 'Quality',
    detail: 'TypeScript, lint, tests, docs, and CI/CD checks belong in this project milestone.',
  },
];

export default function SettingsScreen() {
  return (
    <Screen>
      <ThemedView style={{ gap: Spacing.two }}>
        <ThemedText type="subtitle" selectable>
          Settings
        </ThemedText>
        <ThemedText themeColor="textSecondary" selectable>
          Configuration and account controls for the mobile planner.
        </ThemedText>
      </ThemedView>

      {settingsSections.map((section) => (
        <ThemedView
          key={section.title}
          type="backgroundElement"
          style={{ padding: Spacing.three, borderRadius: 8, gap: Spacing.one }}>
          <ThemedText type="smallBold" selectable>
            {section.title}
          </ThemedText>
          <ThemedText type="small" themeColor="textSecondary" selectable>
            {section.detail}
          </ThemedText>
        </ThemedView>
      ))}
    </Screen>
  );
}
