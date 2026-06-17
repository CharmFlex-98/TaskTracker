# Task Planner App Background

## Goal

Build a mobile task planner inspired by Jira to relearn modern React Native with Expo while producing a portfolio-quality app that demonstrates TypeScript, React Native, Expo Router, React Query, Context API, REST API integration, Google OAuth, reusable UI, performance awareness, testing, and maintainable frontend architecture.

The app should be functional, not just a UI demo. It should support login, online data persistence through the Spring Boot backend, and full CRUD workflows for projects, boards, tasks, progress, and user-facing task planning views.

## Current Project Baseline

- Expo SDK: `56`
- React Native: `0.85.3`
- React: `19.2.3`
- Expo Router: `~56.2.11`
- TypeScript: `~6.0.3`
- Current source root: `src`
- Current route root: `src/app`
- Current app config enables typed routes and React Compiler.

Expo SDK 56 documentation reference: https://docs.expo.dev/versions/v56.0.0/

Important SDK 56 notes for this project:

- Expo SDK 56 targets React Native `0.85`, React `19.2.3`, React Native Web `0.21.0`, and minimum Node.js `22.13.x`.
- Use `npx expo install` for Expo SDK packages so package versions match SDK 56.
- OAuth browser flows are supported through `expo-auth-session`, but the Expo docs recommend provider-owned libraries where available for Google auth. For a learning app, start with `expo-auth-session` only if the backend controls token exchange and no client secrets are embedded in the app.
- Store auth tokens with `expo-secure-store`, not AsyncStorage.
- The existing `scheme` is `tasktracker`, which is useful for OAuth/deep-link redirects.

## Product Scope

The app is a mobile-first project and task planning tool for personal or small-team use.

Core entities:

- User
- Workspace
- Project
- Board
- Sprint or milestone
- Task
- Comment
- Attachment metadata
- Activity event
- Label
- Task status

Minimum task fields:

- `id`
- `title`
- `description`
- `status`
- `priority`
- `assignee`
- `reporter`
- `labels`
- `projectId`
- `boardId`
- `sprintId`
- `dueDate`
- `estimate`
- `progress`
- `createdAt`
- `updatedAt`

Main user flows:

- Sign in with Google OAuth.
- View workspaces and projects.
- Create, update, delete, and archive projects.
- View a board grouped by task status.
- Create, update, delete, and move tasks.
- Edit task details, labels, priority, due date, assignee, and progress.
- Search and filter tasks.
- View task activity and comments.
- Track progress through board metrics, sprint progress, and project summary screens.
- Handle loading, empty, error, offline, and refresh states cleanly.

## Learning Roadmap

### Phase 1: Modern React Native and Expo Foundation

Objective: Rebuild fluency with Expo SDK 56, Expo Router, TypeScript, styling, navigation, and mobile UI basics.

Build:

- Replace the starter screens with the real app shell.
- Configure route groups for authenticated and unauthenticated areas.
- Create reusable primitives: screen container, text, button, icon button, input, empty state, error state, loading state, badge, avatar, task card, project row.
- Add light and dark theme support.
- Use responsive flex layouts instead of fixed dimensions.

Topics covered:

- Expo Router file-based routing
- Native stack navigation
- Typed routes
- React Native layout and styling
- Theme Context
- Reusable components
- TypeScript props and domain models

### Phase 2: Authentication

Objective: Implement secure login and session management with the Spring Boot backend.

Recommended architecture:

- Mobile app starts a Google OAuth flow.
- Backend validates Google identity and issues the app's own access token and refresh token.
- App stores tokens in `expo-secure-store`.
- React Query uses the access token for API calls.
- App refreshes tokens through the backend when needed.
- App never stores Google client secrets.

Build:

- Login screen.
- OAuth redirect handling.
- Auth provider using Context API.
- Secure token storage adapter.
- Session restore on app launch.
- Logout flow.
- Protected routes.

Topics covered:

- OAuth redirect flow
- Secure local persistence
- Context API for auth state
- Deep linking
- Backend token exchange
- Error handling for cancelled, failed, and expired auth sessions

### Phase 3: API Integration and Server State

Objective: Make the app online-first with real backend CRUD through React Query.

Build:

- API client wrapper around `fetch`.
- Typed request and response models.
- React Query setup.
- Queries for workspaces, projects, boards, tasks, comments, labels, and users.
- Mutations for create, update, delete, assign, move, and comment actions.
- Query invalidation strategy.
- Pull-to-refresh.
- Retry and error handling.

Recommended folder direction:

```text
src/
  app/
  components/
  constants/
  features/
    auth/
    projects/
    boards/
    tasks/
    comments/
  lib/
    api/
    query/
    storage/
  types/
```

Topics covered:

- REST API integration
- React Query server state
- Optimistic updates
- Loading and error UX
- Typed API boundaries
- Separation of server state and local UI state

### Phase 4: Jira-Like Planning Features

Objective: Build the core product behavior that makes the app more than a CRUD demo.

Build:

- Project list and project detail.
- Board screen grouped by status.
- Task detail screen.
- Task editor screen.
- Status transition flow.
- Search and filter screen.
- Sprint or milestone progress screen.
- Basic analytics: completed count, in-progress count, blocked count, overdue count, completion percentage.

Mobile-first simplification:

- Avoid desktop-style drag-and-drop as the primary interaction.
- Use task card actions, status menus, swipe actions, and detail editing instead.
- Later, add gesture-based movement if the basic board is stable.

Topics covered:

- Complex list rendering
- Derived UI state
- Mutations with optimistic updates
- Navigation between nested resources
- Mobile UX decisions
- Progress visualization

### Phase 5: Quality, Testing, and Maintainability

Objective: Make the app credible for frontend interview discussion and real team workflows.

Build:

- Unit tests for pure utilities and API mappers.
- Component tests for reusable UI.
- Integration-style tests for auth state and task mutation flows.
- Mock API handlers for development and tests.
- Linting and type-checking scripts.
- README with architecture decisions and setup.
- API contract notes for the Spring Boot backend.

Topics covered:

- Testing strategy
- Code review readiness
- Documentation
- Error boundary thinking
- Maintainable folder structure
- Reusable component design

### Phase 6: Performance, Polish, and CI/CD

Objective: Show ownership beyond feature implementation.

Build:

- Large task list optimization.
- Memoized expensive derived data.
- Stable query keys.
- Skeleton/loading states.
- Empty and error state polish.
- Accessibility labels and readable touch targets.
- GitHub Actions or EAS workflow for lint, type-check, test, and build.
- EAS Update or build notes if publishing becomes a goal.

Topics covered:

- Performance profiling mindset
- CI/CD pipelines
- Release discipline
- Accessibility
- Production readiness

## Backend API Expectations

The Spring Boot backend should provide a clean REST API for the mobile app.

Suggested endpoints:

- `POST /auth/google`
- `POST /auth/refresh`
- `POST /auth/logout`
- `GET /me`
- `GET /workspaces`
- `POST /workspaces`
- `GET /projects`
- `POST /projects`
- `GET /projects/{projectId}`
- `PATCH /projects/{projectId}`
- `DELETE /projects/{projectId}`
- `GET /projects/{projectId}/board`
- `GET /tasks`
- `POST /tasks`
- `GET /tasks/{taskId}`
- `PATCH /tasks/{taskId}`
- `DELETE /tasks/{taskId}`
- `POST /tasks/{taskId}/comments`
- `GET /tasks/{taskId}/activity`

API requirements:

- Use JSON consistently.
- Use stable IDs.
- Return validation errors in a predictable shape.
- Support pagination for task lists and activity.
- Support filtering by project, status, assignee, priority, due date, and search keyword.
- Use server-owned timestamps.
- Use backend authorization for workspace/project access.

## State Management Plan

Use React Query for server state:

- Remote lists
- Remote detail records
- Create/update/delete mutations
- Cache invalidation
- Refreshing
- Optimistic updates

Use Context API for app-level client state:

- Auth session
- Theme preference
- Feature flags or dev settings if needed

Use component state for local UI state:

- Form fields
- Open menus
- Selected filter chips
- Temporary sort order
- Modal state

Avoid putting server data into Context unless it is truly global and stable. React Query should remain the source of truth for backend data.

## Suggested Screen Map

Unauthenticated:

- `/sign-in`

Authenticated:

- `/`
- `/projects`
- `/projects/new`
- `/projects/[projectId]`
- `/projects/[projectId]/board`
- `/projects/[projectId]/progress`
- `/tasks/new`
- `/tasks/[taskId]`
- `/tasks/[taskId]/edit`
- `/search`
- `/settings`

Suggested tab areas:

- Projects
- My Tasks
- Search
- Settings

Suggested stack behavior:

- Use stack titles instead of custom page title text.
- Use modals for create/edit flows where appropriate.
- Keep the first child of stack screens scrollable or list-based with automatic content inset handling.

## JD Coverage Matrix

This project should deliberately demonstrate the JD requirements.

- Robust, scalable, user-friendly frontend: real authenticated app, typed models, reusable UI, error states, responsive mobile layouts.
- Collaboration with product/design/backend: document API contracts, UX decisions, and backend assumptions.
- Reusable components: shared primitives, task cards, project rows, form fields, status badges, empty states.
- Optimized state management: React Query for server state, Context API for auth/theme, local state for forms.
- Responsive designs: mobile-first screens, safe areas, list ergonomics, touch-friendly controls.
- Testing and code reviews: add tests, linting, type checking, and documented architecture decisions.
- Debugging and optimization: handle network errors, token expiry, large lists, cache invalidation, and optimistic update rollback.
- Mentoring and leadership: write clear implementation notes and explain tradeoffs in documentation.
- Emerging frontend tech: Expo SDK 56, React 19, React Compiler, typed routes, modern Expo Router.
- TypeScript: strict domain models, typed API client, typed navigation params.
- React Native and cross-platform: iOS, Android, and optional web support through Expo.
- REST API integration: Spring Boot backend, auth token flow, CRUD resources, server validation.
- User-centric mindset: clear mobile flows for creating, tracking, filtering, and updating work.

## Milestones

### Milestone 1: App Shell

Deliverable:

- Real navigation shell, theme, app layout, and placeholder screens for auth, projects, tasks, search, and settings.

Definition of done:

- App runs in Expo Go.
- Routes are typed.
- No starter tutorial UI remains.
- Basic components are reusable and documented by usage.

### Milestone 2: Auth

Deliverable:

- Google OAuth login connected to backend token exchange.

Definition of done:

- User can sign in, restore session, and sign out.
- Tokens are stored in SecureStore.
- Protected routes block unauthenticated access.

### Milestone 3: Project and Task CRUD

Deliverable:

- Online CRUD for projects and tasks.

Definition of done:

- User can create, read, update, and delete projects.
- User can create, read, update, and delete tasks.
- React Query cache updates correctly.
- Loading, empty, and error states are implemented.

### Milestone 4: Board and Progress

Deliverable:

- Jira-like board and progress tracking.

Definition of done:

- Tasks are grouped by status.
- User can move tasks between statuses.
- Project progress summary is visible.
- Filters and search are useful on mobile.

### Milestone 5: Quality Layer

Deliverable:

- Tests, docs, CI checks, and performance pass.

Definition of done:

- Type-check, lint, and tests run from scripts.
- Core API and state utilities have tests.
- README explains setup and architecture.
- Large lists remain responsive.

## First Implementation Sequence

1. Clean the starter Expo screens.
2. Create the folder structure under `src/features`, `src/lib`, and `src/types`.
3. Add app shell routes and protected route strategy.
4. Add design primitives and task/project UI components.
5. Add React Query and the API client.
6. Implement auth storage and backend token exchange.
7. Implement project CRUD.
8. Implement task CRUD.
9. Implement board grouping and status transitions.
10. Add progress metrics, search, filters, tests, and CI.

## Non-Goals for the First Version

- Real-time collaboration.
- Push notifications.
- File upload.
- Complex drag-and-drop board interactions.
- Offline-first sync.
- Role-based admin UI.

These can be added later after the authenticated CRUD app is stable.

