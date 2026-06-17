import { Pressable } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';

type ActionButtonProps = {
  label: string;
  onPress: () => void;
};

export function ActionButton({ label, onPress }: ActionButtonProps) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => ({ opacity: pressed ? 0.72 : 1 })}>
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
