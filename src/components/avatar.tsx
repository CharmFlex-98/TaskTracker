import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

type AvatarProps = {
  name: string;
  color?: string;
};

export function Avatar({ name, color = '#246BFE' }: AvatarProps) {
  const initials = name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');

  return (
    <ThemedView
      style={{
        alignItems: 'center',
        backgroundColor: color,
        borderCurve: 'continuous',
        borderRadius: 8,
        height: 36,
        justifyContent: 'center',
        width: 36,
      }}>
      <ThemedText style={{ color: '#FFFFFF', fontWeight: '800' }} selectable>
        {initials}
      </ThemedText>
    </ThemedView>
  );
}
