import { View } from 'react-native';

import { LinkButton } from '@/components/link-button';
import { Screen } from '@/components/screen';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';

export default function SignInScreen() {
  return (
    <Screen>
      <ThemedView style={{ gap: Spacing.two }}>
        <ThemedText type="subtitle" selectable>
          Sign in
        </ThemedText>
        <ThemedText themeColor="textSecondary" selectable>
          Google OAuth will live here in Phase 2. This route completes the unauthenticated shell
          without storing tokens or calling the backend.
        </ThemedText>
      </ThemedView>

      <ThemedView
        type="backgroundElement"
        style={{ borderCurve: 'continuous', borderRadius: 8, gap: Spacing.two, padding: Spacing.three }}>
        <ThemedText type="smallBold" selectable>
          Planned auth flow
        </ThemedText>
        <ThemedText type="small" themeColor="textSecondary" selectable>
          Start Google OAuth, send the identity result to Spring Boot, receive app tokens, and store
          them with SecureStore.
        </ThemedText>
      </ThemedView>

      <View style={{ alignItems: 'flex-start' }}>
        <LinkButton href="/" label="Back to app preview" />
      </View>
    </Screen>
  );
}
