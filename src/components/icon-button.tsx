import { Pressable } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

type IconButtonProps = {
  label: string;
  symbol: string;
  onPress: () => void;
};

export function IconButton({ label, symbol, onPress }: IconButtonProps) {
  return (
    <Pressable
      accessibilityLabel={label}
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => ({ opacity: pressed ? 0.72 : 1 })}>
      <ThemedView
        type="backgroundElement"
        style={{
          alignItems: 'center',
          borderCurve: 'continuous',
          borderRadius: 8,
          height: 44,
          justifyContent: 'center',
          width: 44,
        }}>
        <ThemedText type="smallBold" selectable={false}>
          {symbol}
        </ThemedText>
      </ThemedView>
    </Pressable>
  );
}
