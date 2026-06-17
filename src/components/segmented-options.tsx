import { Pressable, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';

type SegmentedOptionsProps<T extends string> = {
  label: string;
  value: T;
  options: readonly T[];
  labels?: Partial<Record<T, string>>;
  onChange: (value: T) => void;
};

export function SegmentedOptions<T extends string>({
  label,
  value,
  options,
  labels,
  onChange,
}: SegmentedOptionsProps<T>) {
  return (
    <ThemedView style={{ gap: Spacing.one }}>
      <ThemedText type="smallBold" selectable>
        {label}
      </ThemedText>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.two }}>
        {options.map((option) => {
          const selected = option === value;

          return (
            <Pressable
              key={option}
              onPress={() => onChange(option)}
              style={({ pressed }) => ({ opacity: pressed ? 0.72 : 1 })}>
              <ThemedView
                type={selected ? 'backgroundSelected' : 'backgroundElement'}
                style={{
                  borderCurve: 'continuous',
                  borderRadius: 8,
                  paddingHorizontal: Spacing.three,
                  paddingVertical: Spacing.two,
                }}>
                <ThemedText type="small" selectable>
                  {labels?.[option] ?? option}
                </ThemedText>
              </ThemedView>
            </Pressable>
          );
        })}
      </View>
    </ThemedView>
  );
}
