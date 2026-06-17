import { View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';

type StatCardProps = {
  label: string;
  value: string;
  detail: string;
};

export function StatCard({ label, value, detail }: StatCardProps) {
  return (
    <ThemedView
      type="backgroundElement"
      style={{
        flex: 1,
        minWidth: 145,
        padding: Spacing.three,
        borderRadius: 8,
        gap: Spacing.one,
        borderCurve: 'continuous',
      }}>
      <ThemedText type="small" themeColor="textSecondary" selectable>
        {label}
      </ThemedText>
      <ThemedText
        style={{ fontSize: 28, lineHeight: 34, fontWeight: '700', fontVariant: ['tabular-nums'] }}
        selectable>
        {value}
      </ThemedText>
      <ThemedText type="small" themeColor="textSecondary" selectable>
        {detail}
      </ThemedText>
      <View />
    </ThemedView>
  );
}
