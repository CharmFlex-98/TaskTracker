import { Redirect } from 'expo-router';

import AppTabs from '@/components/app-tabs';
import { FeedbackState } from '@/components/feedback-state';
import { Screen } from '@/components/screen';
import { useAuth } from '@/features/auth/auth-provider';

export default function AppLayout() {
  const { status } = useAuth();

  if (status === 'loading') {
    return (
      <Screen>
        <FeedbackState title="Restoring session" message="Checking secure auth storage." variant="loading" />
      </Screen>
    );
  }

  if (status === 'unauthenticated') {
    return <Redirect href="/sign-in" />;
  }

  return <AppTabs />;
}
