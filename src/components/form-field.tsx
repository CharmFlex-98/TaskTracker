import { TextInput, type TextInputProps } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type FormFieldProps = TextInputProps & {
  label: string;
};

export function FormField({ label, style, ...props }: FormFieldProps) {
  const theme = useTheme();

  return (
    <ThemedView style={{ gap: Spacing.one }}>
      <ThemedText type="smallBold" selectable>
        {label}
      </ThemedText>
      <TextInput
        placeholderTextColor={theme.textSecondary}
        style={[
          {
            backgroundColor: theme.backgroundElement,
            borderCurve: 'continuous',
            borderRadius: 8,
            color: theme.text,
            fontSize: 16,
            minHeight: 44,
            paddingHorizontal: Spacing.three,
            paddingVertical: Spacing.two,
          },
          style,
        ]}
        {...props}
      />
    </ThemedView>
  );
}
