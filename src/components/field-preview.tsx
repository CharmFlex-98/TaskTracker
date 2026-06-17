import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';

type FieldPreviewProps = {
  label: string;
  value: string;
};

export function FieldPreview({ label, value }: FieldPreviewProps) {
  return (
    <ThemedView
      type="backgroundElement"
      style={{ borderCurve: 'continuous', borderRadius: 8, gap: Spacing.one, padding: Spacing.three }}>
      <ThemedText type="small" themeColor="textSecondary" selectable>
        {label}
      </ThemedText>
      <ThemedText selectable>{value}</ThemedText>
    </ThemedView>
  );
}
