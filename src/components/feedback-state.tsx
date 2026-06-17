import { ActivityIndicator } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type FeedbackStateProps = {
  title: string;
  message: string;
  variant?: 'empty' | 'error' | 'loading';
};

export function FeedbackState({ title, message, variant = 'empty' }: FeedbackStateProps) {
  const theme = useTheme();

  return (
    <ThemedView
      type="backgroundElement"
      style={{
        alignItems: 'center',
        borderCurve: 'continuous',
        borderRadius: 8,
        gap: Spacing.two,
        padding: Spacing.four,
      }}>
      {variant === 'loading' ? <ActivityIndicator color={theme.text} /> : null}
      <ThemedText type="smallBold" selectable>
        {title}
      </ThemedText>
      <ThemedText type="small" themeColor="textSecondary" style={{ textAlign: 'center' }} selectable>
        {message}
      </ThemedText>
    </ThemedView>
  );
}
