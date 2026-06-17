import { Screen } from '@/components/screen';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { ProjectCard } from '@/features/projects/project-card';
import { projects } from '@/features/tasks/sample-data';

export default function ProjectsScreen() {
  return (
    <Screen>
      <ThemedView style={{ gap: 8 }}>
        <ThemedText type="subtitle" selectable>
          Projects
        </ThemedText>
        <ThemedText themeColor="textSecondary" selectable>
          Start with project CRUD, then connect these cards to the Spring Boot backend.
        </ThemedText>
      </ThemedView>

      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </Screen>
  );
}
