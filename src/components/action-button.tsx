import { Pressable } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';

type ActionButtonProps = {
  disabled?: boolean;
  label: string;
  onPress: () => void;
};

export function ActionButton({ disabled, label, onPress }: ActionButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => ({ opacity: disabled ? 0.45 : pressed ? 0.72 : 1 })}>
      <ThemedView
        type="backgroundSelected"
        style={{
          alignItems: 'center',
          borderCurve: 'continuous',
          borderRadius: 8,
          paddingHorizontal: Spacing.three,
          paddingVertical: Spacing.two,
        }}>
        <ThemedText type="smallBold" selectable>
          {label}
        </ThemedText>
      </ThemedView>
    </Pressable>
  );
}
