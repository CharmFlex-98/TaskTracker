# Progress

## Completed

- Phase 1: Modern React Native and Expo Foundation is complete.
- Phase 2: Authentication frontend foundation is complete.
- Phase 3: API Integration and Server State is complete for the current project/task API scope.
- Created `app_background.md` with product scope, learning roadmap, JD coverage, backend expectations, milestones, and first implementation sequence.
- Confirmed the app baseline is Expo SDK 56 with React 19.2.3, React Native 0.85.3, Expo Router, TypeScript, typed routes, and React Compiler enabled.
- Replaced the Expo starter home screen with a TaskTracker dashboard.
- Removed the starter `explore` route.
- Added real app tabs for Home, Projects, Tasks, Search, and Settings.
- Added route groups for app and auth shells:
  - `src/app/(app)/_layout.tsx`
  - `src/app/(auth)/sign-in.tsx`
- Added starter screens:
  - `src/app/(app)/projects/index.tsx`
  - `src/app/(app)/tasks/index.tsx`
  - `src/app/(app)/search.tsx`
  - `src/app/(app)/settings.tsx`
- Added reusable app shell/UI pieces:
  - `src/components/screen.tsx`
  - `src/components/stat-card.tsx`
  - `src/features/projects/project-card.tsx`
  - `src/features/tasks/task-card.tsx`
- Added starter planner domain types in `src/types/task-planner.ts`.
- Added local sample project/task/board data in `src/features/tasks/sample-data.ts`.
- Converted Projects and Tasks from flat routes into route folders so detail/create screens can live under:
  - `src/app/(app)/projects/index.tsx`
  - `src/app/(app)/tasks/index.tsx`
- Added exact-id detail routes:
  - `src/app/(app)/projects/[projectId].tsx`
  - `src/app/(app)/tasks/[taskId].tsx`
- Added local draft create routes:
  - `src/app/(app)/projects/new.tsx`
  - `src/app/(app)/tasks/new.tsx`
- Added local draft edit routes:
  - `src/app/(app)/projects/[projectId]/edit.tsx`
  - `src/app/(app)/tasks/[taskId]/edit.tsx`
- Added reusable form/navigation helpers:
  - `src/components/action-button.tsx`
  - `src/components/link-button.tsx`
  - `src/components/form-field.tsx`
  - `src/components/field-preview.tsx`
  - `src/components/segmented-options.tsx`
- Added reusable Phase 1 UI states/primitives:
  - `src/components/avatar.tsx`
  - `src/components/feedback-state.tsx`
  - `src/components/icon-button.tsx`
  - `src/components/status-badge.tsx`
- Made project and task cards link to their detail screens.
- Made project and task detail screens link to edit screens.
- Added local status and priority controls for the task edit flow.
- Installed and configured ESLint through Expo.
- Verified that `npm run lint` works after switching to a supported Node version.
- Fixed the web color-scheme hook to avoid React's `set-state-in-effect` lint rule by using `useSyncExternalStore`.
- Installed SDK 56 auth/storage packages:
  - `expo-auth-session`
  - `expo-crypto`
  - `expo-secure-store`
- Added auth domain types in `src/types/auth.ts`.
- Added environment typing in `src/types/env.d.ts`.
- Added SecureStore-backed auth session storage in `src/lib/storage/auth-session-storage.ts`.
- Added fail-closed backend auth exchange boundary in `src/lib/api/auth-api.ts`.
- Added `AuthProvider` and `useAuth` in `src/features/auth/auth-provider.tsx`.
- Protected the `(app)` route group and redirects unauthenticated users to `/sign-in`.
- Added Google OAuth sign-in flow shell in `src/app/(auth)/sign-in.tsx`.
- Added explicit local preview sign-in for development before the backend OAuth endpoint is available.
- Added session display and sign-out in Settings.
- Added `.env.example` with required public auth configuration keys.
- Refactored the frontend API client into a reusable base request with explicit authenticated request wrapping.
- Modularized frontend API, query keys, and domain types into auth, projects, tasks, and task-planner feature folders.
- Created `server/` Spring Boot backend project following the setup in `~/IDEAProject/flexiexpensesmanager`.
- Switched backend setup to Kotlin + Gradle Kotlin DSL with Gradle wrapper.
- Added backend dependencies for Spring Web, Validation, JDBC, Flyway, PostgreSQL runtime, Firebase Admin, Jackson Kotlin, and Kotlin reflection.
- Added backend entry point:
  - `server/src/main/kotlin/com/tasktracker/server/TaskTrackerServerApplication.kt`
- Added public backend health endpoint:
  - `GET /api/health`
- Replaced the direct Google auth exchange contract with Firebase auth verification:
  - `POST /auth/firebase`
- Added Firebase Admin ID-token verification and a fail-closed Firebase auth filter for protected API routes.
- Added backend user/project/task persistence schema:
  - `server/src/main/resources/db/migration/V1__create_tasktracker_schema.sql`
- Enabled Flyway database migrations and disabled Spring's automatic `schema.sql` initialization.
- Removed H2 and made the backend PostgreSQL-only.
- Added server-local Docker Compose support for PostgreSQL plus the Gradle-built Spring Boot server image.
- Added GitHub Actions workflow to publish the Gradle buildpack image and deploy with Docker Compose.
- Removed the unused backend `UserRecord` class; user persistence currently uses the verified `AuthenticatedUser` directly.
- Added authenticated backend project CRUD:
  - `GET /api/projects`
  - `GET /api/projects/{projectId}`
  - `POST /api/projects`
  - `PUT /api/projects/{projectId}`
  - `DELETE /api/projects/{projectId}`
- Added authenticated backend task CRUD:
  - `GET /api/tasks`
  - `GET /api/tasks/{taskId}`
  - `POST /api/tasks`
  - `PUT /api/tasks/{taskId}`
  - `DELETE /api/tasks/{taskId}`
- Added custom exception base and global exception handler following the reference project's style.
- Added `server/README.md` with run, verify, and auth contract notes.
- Added `server/.gitignore` so Gradle build output, IntelliJ metadata, and local backend env files are not tracked.
- Removed backend tests and test-only dependencies because the current learning phase does not need test scaffolding yet.
- Installed Firebase client SDK, TanStack Query, and AsyncStorage.
- Added Firebase client config boundary in `src/lib/firebase/firebase.ts`.
- Added React Query client provider in `src/app/_layout.tsx`.
- Added typed API client boundaries for auth, projects, and tasks.
- Connected Home, Projects, and Tasks screens to React Query-backed API data.
- Connected New Project and New Task forms to real create mutations.
- Connected project and task detail screens to server-backed React Query data.
- Connected project and task edit screens to real update mutations.
- Added project and task delete mutations to the detail screens.
- Added task status transition mutation from the task detail screen.
- Added backend task filters for project, status, priority, and search text.
- Connected Search to backend-backed task query parameters.
- Added pull-to-refresh to Home, Projects, Tasks, Project Detail, Task Detail, and Search screens.
- Tightened React Query invalidation so all task list variants refresh after create, update, delete, or project delete mutations.
- Renamed the Android application package from `com.anonymous.TaskTracker` to `com.charmflex.app.planstack`.
- Bound the server-side `./secrets` folder into the backend container at `/run/secrets/tasktracker:ro` and defaulted Firebase Admin to `/run/secrets/tasktracker/firebase-service-account.json`.
- Fixed production Docker Compose interpolation for `TASKTRACKER_DB_URL` and removed the stale `postgres` dependency from the server-only deploy file.
- Deferred Firebase client initialization until real Firebase auth is used and added development API request logging.
- Fixed the root Expo Router stack config to reference `(auth)/sign-in` instead of the non-existent `(auth)` layout route.
- Registered the Android application ID as an OAuth redirect scheme and added development logging for Google AuthSession redirect/client IDs.
- Added an Expo Router native intent rewrite so Google OAuth callback links do not render as unmatched `/oauthredirect` routes.
- Fixed Google sign-in to wait for Expo AuthSession's post-code-exchange response before reading the returned ID token.

## Verification

- `npx tsc --noEmit` passes.
- `npm run lint` passes when the active Node version satisfies Expo SDK 56 requirements.
- `npx expo lint` now exits cleanly after Node was updated.
- `cd server && ./gradlew classes` passes.
- `npx tsc --noEmit` passes after completing Phase 3.
- `npx expo lint` passes after completing Phase 3.
- `cd server && ./gradlew classes` passes after completing Phase 3.

## Environment Notes

- Expo SDK 56 / React Native 0.85 requires Node `>=20.19.4`.
- The machine has nvm Node versions:
  - `v20.16.0`
  - `v22.14.0`
- Use Node `v22.14.0` for this project.
- Android Studio may not see nvm-managed Node when launched from the macOS GUI.
- If Android Studio Gradle sync fails with `Cannot run program "node"`, launch Android Studio from a terminal where Node 22 is active:

```bash
source "$HOME/.nvm/nvm.sh"
nvm use 22.14.0
open -a "Android Studio"
```

## Not Done Yet

- End-to-end Firebase Google login verification with real Firebase credentials.
- Backend domain model for boards, comments, labels, and activity.
- Tests and CI/CD workflow.
- Production-ready Android/iOS build validation.

## Next Steps

1. Add real Firebase project credentials to `.env`.
2. Configure Spring Boot with `FIREBASE_SERVICE_ACCOUNT_PATH` or `FIREBASE_SERVICE_ACCOUNT_JSON`.
3. Verify end-to-end Firebase Google login on the emulator.
4. Start Phase 4 board/detail planning features on top of the stable project/task API flow.
5. Add backend domain model for boards, comments, labels, and activity.
6. Add tests around API mappers, query hooks, and mutation flows.
