import { DarkTheme, DefaultTheme, ThemeProvider } from 'expo-router';
import { Stack } from 'expo-router/stack';
import { QueryClientProvider } from '@tanstack/react-query';
import { useColorScheme } from 'react-native';

import { AuthProvider } from '@/features/auth/auth-provider';
import { queryClient } from '@/lib/query/query-client';

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(app)" />
            <Stack.Screen name="(auth)/sign-in" />
          </Stack>
        </AuthProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
