import type { ProjectResponse } from '@/features/projects/types';
import type { TaskResponse } from '@/features/tasks/types';
import type { BoardColumn, ProjectSummary, TaskStatus, TaskSummary } from '@/features/task-planner/types';

const projectColors = ['#246BFE', '#0E9F6E', '#D97706', '#7C3AED', '#DC2626'];

const statusFromApi: Record<TaskResponse['status'], TaskStatus> = {
  blocked: 'blocked',
  done: 'done',
  in_progress: 'inProgress',
  todo: 'todo',
};

export function toProjectSummary(project: ProjectResponse, index: number, tasks: TaskResponse[]): ProjectSummary {
  const projectTasks = tasks.filter((task) => task.projectId === project.id);
  const completedCount = projectTasks.filter((task) => task.status === 'done').length;

  return {
    id: project.id,
    key: createProjectKey(project.name),
    name: project.name,
    description: project.description ?? '',
    lead: 'You',
    taskCount: projectTasks.length,
    completedCount,
    updatedAt: formatDate(project.updatedAt),
    color: projectColors[index % projectColors.length],
  };
}

export function toTaskSummary(task: TaskResponse, project?: ProjectResponse): TaskSummary {
  return {
    id: task.id,
    key: task.id.slice(0, 8).toUpperCase(),
    title: task.title,
    projectKey: project ? createProjectKey(project.name) : 'TASK',
    status: statusFromApi[task.status],
    priority: task.priority,
    assignee: 'You',
    dueDate: task.dueDate ?? 'No due date',
    progress: task.progress,
  };
}

export function toBoardColumns(tasks: TaskResponse[], projects: ProjectResponse[]): BoardColumn[] {
  const summaries = tasks.map((task) =>
    toTaskSummary(
      task,
      projects.find((project) => project.id === task.projectId)
    )
  );

  return [
    { status: 'todo', title: 'To do', tasks: summaries.filter((task) => task.status === 'todo') },
    {
      status: 'inProgress',
      title: 'In progress',
      tasks: summaries.filter((task) => task.status === 'inProgress'),
    },
    { status: 'blocked', title: 'Blocked', tasks: summaries.filter((task) => task.status === 'blocked') },
    { status: 'done', title: 'Done', tasks: summaries.filter((task) => task.status === 'done') },
  ];
}

function createProjectKey(name: string) {
  const letters = name
    .split(/\s+/)
    .map((part) => part[0])
    .join('')
    .replace(/[^a-z]/gi, '')
    .slice(0, 3)
    .toUpperCase();
  return letters || 'PRJ';
}

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}
