import { Link } from 'expo-router';
import { Pressable, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import type { TaskPriority, TaskStatus, TaskSummary } from '@/types/task-planner';

const statusLabels: Record<TaskStatus, string> = {
  todo: 'To do',
  inProgress: 'In progress',
  review: 'Review',
  done: 'Done',
  blocked: 'Blocked',
};

const priorityColors: Record<TaskPriority, string> = {
  low: '#0E9F6E',
  medium: '#246BFE',
  high: '#D97706',
  urgent: '#DC2626',
};

type TaskCardProps = {
  task: TaskSummary;
};

export function TaskCard({ task }: TaskCardProps) {
  return (
    <Link href={{ pathname: '/tasks/[taskId]', params: { taskId: task.id } }} asChild>
      <Pressable style={({ pressed }) => ({ opacity: pressed ? 0.72 : 1 })}>
        <ThemedView
          type="backgroundElement"
          style={{
            padding: Spacing.three,
            borderRadius: 8,
            gap: Spacing.two,
            borderCurve: 'continuous',
          }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.two }}>
            <ThemedText type="code" themeColor="textSecondary" selectable>
              {task.key}
            </ThemedText>
            <View
              style={{
                width: 8,
                height: 8,
                borderRadius: 4,
                backgroundColor: priorityColors[task.priority],
              }}
            />
            <ThemedText type="small" themeColor="textSecondary" selectable>
              {task.priority}
            </ThemedText>
          </View>

          <ThemedText type="smallBold" selectable>
            {task.title}
          </ThemedText>

          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.two }}>
            <ThemedText type="small" themeColor="textSecondary" selectable>
              {statusLabels[task.status]}
            </ThemedText>
            <ThemedText type="small" themeColor="textSecondary" selectable>
              {task.assignee}
            </ThemedText>
            <ThemedText type="small" themeColor="textSecondary" selectable>
              Due {task.dueDate}
            </ThemedText>
          </View>

          <View style={{ height: 6, borderRadius: 3, backgroundColor: 'rgba(127,127,127,0.22)' }}>
            <View
              style={{
                width: `${task.progress}%`,
                height: 6,
                borderRadius: 3,
                backgroundColor: priorityColors[task.priority],
              }}
            />
          </View>
        </ThemedView>
      </Pressable>
    </Link>
  );
}
