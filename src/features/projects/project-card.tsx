import { Link } from 'expo-router';
import { Pressable, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import type { ProjectSummary } from '@/types/task-planner';

type ProjectCardProps = {
  project: ProjectSummary;
};

export function ProjectCard({ project }: ProjectCardProps) {
  const completion = Math.round((project.completedCount / project.taskCount) * 100);

  return (
    <Link href={{ pathname: '/projects/[projectId]', params: { projectId: project.id } }} asChild>
      <Pressable style={({ pressed }) => ({ opacity: pressed ? 0.72 : 1 })}>
        <ThemedView
          type="backgroundElement"
          style={{
            padding: Spacing.three,
            borderRadius: 8,
            gap: Spacing.three,
            borderCurve: 'continuous',
          }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.two }}>
            <View
              style={{
                width: 36,
                height: 36,
                borderRadius: 8,
                backgroundColor: project.color,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <ThemedText style={{ color: '#FFFFFF', fontWeight: '800' }}>{project.key}</ThemedText>
            </View>
            <View style={{ flex: 1, gap: Spacing.half }}>
              <ThemedText type="smallBold" selectable>
                {project.name}
              </ThemedText>
              <ThemedText type="small" themeColor="textSecondary" selectable>
                Lead: {project.lead} · Updated {project.updatedAt}
              </ThemedText>
            </View>
          </View>

          <ThemedText type="small" themeColor="textSecondary" selectable>
            {project.description}
          </ThemedText>

          <View style={{ gap: Spacing.one }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <ThemedText type="small" selectable>
                {project.completedCount}/{project.taskCount} tasks done
              </ThemedText>
              <ThemedText type="smallBold" selectable>
                {completion}%
              </ThemedText>
            </View>
            <View style={{ height: 8, borderRadius: 4, backgroundColor: 'rgba(127,127,127,0.22)' }}>
              <View
                style={{
                  width: `${completion}%`,
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: project.color,
                }}
              />
            </View>
          </View>
        </ThemedView>
      </Pressable>
    </Link>
  );
}
