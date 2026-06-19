import type { BoardColumn, ProjectSummary, TaskSummary } from '@/features/task-planner/types';

export const projects: ProjectSummary[] = [
  {
    id: 'project-mobile',
    key: 'MOB',
    name: 'Mobile task planner',
    description: 'Expo app for planning projects, board work, and progress tracking.',
    lead: 'Jiaming',
    taskCount: 24,
    completedCount: 9,
    updatedAt: 'Today',
    color: '#246BFE',
  },
  {
    id: 'project-backend',
    key: 'API',
    name: 'Spring Boot API',
    description: 'Authentication, project CRUD, task CRUD, and activity endpoints.',
    lead: 'Backend',
    taskCount: 18,
    completedCount: 6,
    updatedAt: 'Yesterday',
    color: '#0E9F6E',
  },
  {
    id: 'project-interview',
    key: 'JD',
    name: 'Frontend portfolio',
    description: 'Reusable components, React Query, testing, docs, and CI/CD polish.',
    lead: 'Jiaming',
    taskCount: 12,
    completedCount: 3,
    updatedAt: 'Mon',
    color: '#D97706',
  },
];

export const tasks: TaskSummary[] = [
  {
    id: 'task-shell',
    key: 'MOB-1',
    title: 'Replace starter screens with app shell',
    projectKey: 'MOB',
    status: 'inProgress',
    priority: 'high',
    assignee: 'Jiaming',
    dueDate: 'Jun 18',
    progress: 65,
  },
  {
    id: 'task-auth',
    key: 'MOB-2',
    title: 'Design Google OAuth and backend token exchange',
    projectKey: 'MOB',
    status: 'todo',
    priority: 'urgent',
    assignee: 'Jiaming',
    dueDate: 'Jun 20',
    progress: 0,
  },
  {
    id: 'task-query',
    key: 'MOB-3',
    title: 'Add React Query API client boundary',
    projectKey: 'MOB',
    status: 'todo',
    priority: 'high',
    assignee: 'Jiaming',
    dueDate: 'Jun 21',
    progress: 0,
  },
  {
    id: 'task-board',
    key: 'MOB-4',
    title: 'Build mobile board grouped by status',
    projectKey: 'MOB',
    status: 'review',
    priority: 'medium',
    assignee: 'Jiaming',
    dueDate: 'Jun 24',
    progress: 85,
  },
  {
    id: 'task-contract',
    key: 'API-1',
    title: 'Define REST contract for projects and tasks',
    projectKey: 'API',
    status: 'done',
    priority: 'medium',
    assignee: 'Backend',
    dueDate: 'Jun 17',
    progress: 100,
  },
  {
    id: 'task-tests',
    key: 'JD-1',
    title: 'Add quality gates for lint, type-check, and tests',
    projectKey: 'JD',
    status: 'blocked',
    priority: 'medium',
    assignee: 'Jiaming',
    dueDate: 'Jun 28',
    progress: 15,
  },
];

export const boardColumns: BoardColumn[] = [
  { status: 'todo', title: 'To do', tasks: tasks.filter((task) => task.status === 'todo') },
  {
    status: 'inProgress',
    title: 'In progress',
    tasks: tasks.filter((task) => task.status === 'inProgress'),
  },
  { status: 'review', title: 'Review', tasks: tasks.filter((task) => task.status === 'review') },
  { status: 'done', title: 'Done', tasks: tasks.filter((task) => task.status === 'done') },
  { status: 'blocked', title: 'Blocked', tasks: tasks.filter((task) => task.status === 'blocked') },
];

export function getProjectById(projectId: string) {
  return projects.find((project) => project.id === projectId);
}

export function getTaskById(taskId: string) {
  return tasks.find((task) => task.id === taskId);
}

export function getTasksByProjectKey(projectKey: string) {
  return tasks.filter((task) => task.projectKey === projectKey);
}
