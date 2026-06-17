# Progress

## Completed

- Created `app_background.md` with product scope, learning roadmap, JD coverage, backend expectations, milestones, and first implementation sequence.
- Confirmed the app baseline is Expo SDK 56 with React 19.2.3, React Native 0.85.3, Expo Router, TypeScript, typed routes, and React Compiler enabled.
- Replaced the Expo starter home screen with a TaskTracker dashboard.
- Removed the starter `explore` route.
- Added real app tabs for Home, Projects, Tasks, Search, and Settings.
- Added starter screens:
  - `src/app/projects.tsx`
  - `src/app/tasks.tsx`
  - `src/app/search.tsx`
  - `src/app/settings.tsx`
- Added reusable app shell/UI pieces:
  - `src/components/screen.tsx`
  - `src/components/stat-card.tsx`
  - `src/features/projects/project-card.tsx`
  - `src/features/tasks/task-card.tsx`
- Added starter planner domain types in `src/types/task-planner.ts`.
- Added local sample project/task/board data in `src/features/tasks/sample-data.ts`.
- Installed and configured ESLint through Expo.
- Verified that `npm run lint` works after switching to a supported Node version.
- Fixed the web color-scheme hook to avoid React's `set-state-in-effect` lint rule by using `useSyncExternalStore`.

## Verification

- `npx tsc --noEmit` passes.
- `npm run lint` passes when the active Node version satisfies Expo SDK 56 requirements.
- `npx expo lint` now exits cleanly after Node was updated.

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

- Google OAuth login.
- Secure token storage with `expo-secure-store`.
- Auth provider and protected route flow.
- Spring Boot API client.
- React Query setup.
- Real project CRUD.
- Real task CRUD.
- Task detail and edit screens.
- Status transition mutations.
- Backend search/filter integration.
- Tests and CI/CD workflow.
- Production-ready Android/iOS build validation.

## Next Steps

1. Add auth architecture files without wiring real Google OAuth yet:
   - auth types
   - auth context/provider
   - secure storage adapter
   - protected route strategy
2. Add React Query and API client boundaries.
3. Add project CRUD screens and form components.
4. Add task CRUD screens and detail/edit flows.
5. Connect to the Spring Boot backend once endpoint contracts are ready.

