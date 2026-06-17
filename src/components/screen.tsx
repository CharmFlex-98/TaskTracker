import { ScrollView, type ScrollViewProps } from 'react-native';

import { MaxContentWidth, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type ScreenProps = ScrollViewProps & {
  compact?: boolean;
};

export function Screen({ children, contentContainerStyle, compact, ...props }: ScreenProps) {
  const theme = useTheme();

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      style={{ flex: 1, backgroundColor: theme.background }}
      contentContainerStyle={[
        {
          alignSelf: 'center',
          width: '100%',
          maxWidth: MaxContentWidth,
          padding: compact ? Spacing.three : Spacing.four,
          gap: Spacing.three,
        },
        contentContainerStyle,
      ]}
      {...props}>
      {children}
    </ScrollView>
  );
}
