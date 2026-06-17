import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';

type StatusBadgeProps = {
  label: string;
  tone?: 'neutral' | 'success' | 'warning' | 'danger' | 'info';
};

const toneColors = {
  neutral: '#6B7280',
  success: '#0E9F6E',
  warning: '#D97706',
  danger: '#DC2626',
  info: '#246BFE',
} as const;

export function StatusBadge({ label, tone = 'neutral' }: StatusBadgeProps) {
  return (
    <ThemedView
      style={{
        alignSelf: 'flex-start',
        backgroundColor: `${toneColors[tone]}22`,
        borderCurve: 'continuous',
        borderRadius: 8,
        paddingHorizontal: Spacing.two,
        paddingVertical: Spacing.one,
      }}>
      <ThemedText type="code" style={{ color: toneColors[tone], textTransform: 'uppercase' }} selectable>
        {label}
      </ThemedText>
    </ThemedView>
  );
}
