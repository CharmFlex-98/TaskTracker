import { Link, type Href } from 'expo-router';
import { Pressable } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';

type LinkButtonProps = {
  href: Href;
  label: string;
};

export function LinkButton({ href, label }: LinkButtonProps) {
  return (
    <Link href={href} asChild>
      <Pressable style={({ pressed }) => ({ opacity: pressed ? 0.72 : 1 })}>
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
    </Link>
  );
}
