# Kotlin to TypeScript Pattern Guide

This guide is for a Kotlin developer moving into TypeScript, React, and React Native. The goal is not to abandon architecture. The goal is to use TypeScript idioms instead of forcing Kotlin/OOP shapes into a language and framework that work differently.

## Core Mindset

Kotlin often pushes you toward explicit architecture:

- classes
- interfaces
- sealed classes
- constructor injection
- repositories
- ViewModels
- source-set boundaries

TypeScript can model those ideas, but React code usually stays lighter:

- plain functions
- object types
- discriminated unions
- hooks
- module-level functions
- composition through imports
- convention-backed folder boundaries

Use interfaces and classes when they reduce coupling or improve testability. Do not add them just because Kotlin would.

## Data Shape: `data class` -> `type`

Kotlin:

```kotlin
data class Project(
    val id: String,
    val name: String,
    val taskCount: Int
)
```

TypeScript:

```ts
export type Project = {
  id: string;
  name: string;
  taskCount: number;
};
```

Prefer `type` for app data models unless you specifically need interface merging or class instances.

Common TypeScript style:

```ts
export type CreateProjectRequest = {
  name: string;
  description?: string;
};
```

Avoid:

```ts
class Project {
  constructor(
    public id: string,
    public name: string
  ) {}
}
```

Use classes only when you need behavior, identity, inheritance, or runtime instances. API data is usually plain JSON, so plain object types fit better.

## `type` vs `interface`

For many object shapes, `type` and `interface` look almost the same.

These are similar:

```ts
type Project = {
  id: string;
  name: string;
};
```

```ts
interface Project {
  id: string;
  name: string;
}
```

Both describe an object with `id` and `name`.

The reason this guide defaults to `type` for app data is that `type` is more general. It can describe object shapes, unions, aliases, intersections, and state machines:

```ts
type TaskStatus = 'todo' | 'in_progress' | 'done';

type ProjectId = string;

type SaveState =
  | { status: 'idle' }
  | { status: 'saving' }
  | { status: 'success'; projectId: string }
  | { status: 'error'; message: string };

type ProjectWithTasks = Project & {
  tasks: Task[];
};
```

`interface` is strongest when describing an object contract that may be implemented, extended, or augmented:

```ts
interface ProjectRepository {
  listProjects(): Promise<Project[]>;
  getProject(projectId: string): Promise<Project>;
}
```

The biggest behavioral difference is declaration merging. Interfaces with the same name are merged:

```ts
interface User {
  id: string;
}

interface User {
  name: string;
}
```

TypeScript treats that like:

```ts
interface User {
  id: string;
  name: string;
}
```

`type` does not merge:

```ts
type User = {
  id: string;
};

type User = {
  name: string;
}; // error
```

Declaration merging is useful when extending library or global types:

```ts
declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}
```

For normal app/domain models, merging can be confusing because fields may be added from another file. Prefer one explicit definition.

Practical rule:

```text
Use type for data shapes, unions, aliases, props, and UI/API state.
Use interface for object contracts that are implemented, extended, or intentionally augmented.
```

In this project:

```ts
type ProjectResponse = { ... };
type TaskStatus = 'todo' | 'in_progress' | 'done';
type ProjectCardProps = { ... };

interface StorageAdapter { ... } // only if we need a replaceable contract
interface Repository { ... }     // only if a real abstraction pays off
```

## Nullable Values: `T?` -> `T | null` or `T | undefined`

Kotlin:

```kotlin
val session: AuthSession? = null
```

TypeScript:

```ts
const session: AuthSession | null = null;
```

Use `null` when the value is intentionally empty:

```ts
type AuthState = {
  session: AuthSession | null;
};
```

Use `undefined` when a property may be absent:

```ts
type AuthUser = {
  id: string;
  avatarUrl?: string;
};
```

With `exactOptionalPropertyTypes`, this matters:

```ts
type User = {
  avatarUrl?: string;
};

const user: User = {};
```

This means `avatarUrl` may be omitted. It does not mean you should always set `avatarUrl: undefined`.

## Smart Casts: Kotlin `is` -> TypeScript Narrowing

Kotlin:

```kotlin
if (value is String) {
    value.uppercase()
}
```

TypeScript:

```ts
if (typeof value === 'string') {
  value.toUpperCase();
}
```

Common narrowing checks:

```ts
typeof value === 'string'
typeof value === 'number'
value instanceof Error
value !== null
Array.isArray(value)
status === 'success'
```

This is heavily used in React Native because UI often starts from uncertain state:

```tsx
if (!projectId) {
  return <FeedbackState title="Missing project" />;
}

return <ProjectDetail projectId={projectId} />;
```

After the guard, TypeScript knows `projectId` is a real string.

## Sealed Classes: Discriminated Unions

Kotlin:

```kotlin
sealed interface SaveState {
    data object Idle : SaveState
    data object Saving : SaveState
    data class Success(val projectId: String) : SaveState
    data class Error(val message: String) : SaveState
}
```

TypeScript:

```ts
type SaveState =
  | { status: 'idle' }
  | { status: 'saving' }
  | { status: 'success'; projectId: string }
  | { status: 'error'; message: string };
```

Usage:

```tsx
if (saveState.status === 'error') {
  return <FeedbackState title="Save failed" message={saveState.message} />;
}
```

The `status` field is the discriminator. Once you check it, TypeScript knows which fields exist.

This is one of the most important TypeScript patterns for Kotlin developers.

## `when` Expressions: Exhaustive `switch`

Kotlin:

```kotlin
when (state) {
    is SaveState.Idle -> ...
    is SaveState.Saving -> ...
    is SaveState.Success -> ...
    is SaveState.Error -> ...
}
```

TypeScript:

```ts
function renderSaveState(state: SaveState) {
  switch (state.status) {
    case 'idle':
      return null;
    case 'saving':
      return <ActivityIndicator />;
    case 'success':
      return <Text>{state.projectId}</Text>;
    case 'error':
      return <FeedbackState title="Save failed" message={state.message} />;
  }
}
```

For stricter exhaustiveness:

```ts
function assertNever(value: never): never {
  throw new Error(`Unhandled case: ${String(value)}`);
}

function renderSaveState(state: SaveState) {
  switch (state.status) {
    case 'idle':
      return null;
    case 'saving':
      return <ActivityIndicator />;
    case 'success':
      return <Text>{state.projectId}</Text>;
    case 'error':
      return <FeedbackState title="Save failed" message={state.message} />;
    default:
      return assertNever(state);
  }
}
```

## ViewModel: Custom Hook

Kotlin ViewModel:

```kotlin
class ProjectViewModel(
    private val repository: ProjectRepository
) : ViewModel() {
    val state: StateFlow<ProjectUiState> = ...
}
```

React Native / TypeScript:

```ts
export function useProjectDetail(projectId: string) {
  const projectQuery = useProjectQuery(projectId);
  const updateMutation = useUpdateProjectMutation(projectId);

  return {
    project: projectQuery.data,
    isLoading: projectQuery.isPending,
    error: projectQuery.error,
    updateProject: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
  };
}
```

The hook coordinates state, queries, mutations, navigation, and service calls. The screen consumes the hook.

Good direction:

```text
screen -> hook -> API/service -> vendor/platform
```

Avoid:

```text
screen -> fetch/SecureStore/Firebase directly
```

## Repository: API Module or Small Service Contract

Kotlin:

```kotlin
interface ProjectRepository {
    suspend fun listProjects(): List<Project>
}
```

TypeScript simple version:

```ts
export function listProjects() {
  return authenticatedApiRequest<ProjectResponse[]>('/api/projects');
}
```

TypeScript contract version, only when useful:

```ts
export type ProjectRepository = {
  listProjects: () => Promise<ProjectResponse[]>;
  getProject: (projectId: string) => Promise<ProjectResponse>;
};
```

Use the simple module function first. Add an interface when:

- you have multiple implementations
- you need dependency injection for tests
- the vendor may realistically change
- the boundary is shared by many features

Do not create repository interfaces for every file by default.

## Suspend Function: Promise

Kotlin:

```kotlin
suspend fun listProjects(): List<Project>
```

TypeScript:

```ts
export async function listProjects(): Promise<ProjectResponse[]> {
  return authenticatedApiRequest<ProjectResponse[]>('/api/projects');
}
```

Or, if the called function already returns a promise:

```ts
export function listProjects() {
  return authenticatedApiRequest<ProjectResponse[]>('/api/projects');
}
```

Both are fine. Avoid unnecessary `async` when you are only returning another promise and do not need `await`, `try/catch`, or extra logic.

## Result Wrappers: Prefer Throwing for React Query

Kotlin often uses:

```kotlin
sealed interface Result<out T> {
    data class Success<T>(val data: T) : Result<T>
    data class Error(val message: String) : Result<Nothing>
}
```

In React Query, prefer this:

```ts
export async function apiRequest<T>(path: string): Promise<T> {
  const response = await fetch(path);

  if (!response.ok) {
    throw new ApiError('Request failed', response.status, 'API_REQUEST_FAILED');
  }

  return response.json() as Promise<T>;
}
```

Then React Query gives you:

```ts
query.isPending
query.isError
query.isSuccess
query.data
query.error
```

Do not wrap every successful API response like this unless there is a clear reason:

```ts
{ success: true, data }
```

React Query already models async state.

## React Query State: Loading/Error/Success Union

React Query results behave like a discriminated union:

```tsx
const projectsQuery = useProjectsQuery();

if (projectsQuery.isPending) {
  return <FeedbackState title="Loading projects" />;
}

if (projectsQuery.isError) {
  return <FeedbackState title="Projects unavailable" message={projectsQuery.error.message} />;
}

return <ProjectList projects={projectsQuery.data} />;
```

Before checks:

```ts
projectsQuery.data; // ProjectResponse[] | undefined
```

After pending/error checks:

```ts
projectsQuery.data; // ProjectResponse[]
```

This is the React Query equivalent of modeling API UI state with a sealed class.

## Query Keys: Typed Cache Names

TypeScript:

```ts
export const queryKeys = {
  projects: ['projects'] as const,
  project: (projectId: string) => ['projects', projectId] as const,
  tasksRoot: ['tasks'] as const,
  tasks: (filters?: Record<string, string | undefined>) => ['tasks', filters ?? 'all'] as const,
  task: (taskId: string) => ['tasks', 'detail', taskId] as const,
};
```

Think of query keys like structured cache paths:

```ts
['projects']
['projects', projectId]
['tasks', { status: 'done' }]
```

Use them consistently:

```ts
useQuery({
  queryKey: queryKeys.projects,
  queryFn: listProjects,
});

queryClient.invalidateQueries({
  queryKey: queryKeys.projects,
});
```

`as const` makes the array an exact readonly tuple instead of a loose `string[]`.

## Function Values: Passing Behavior Around

Kotlin:

```kotlin
fun loadProjects(): List<Project> = repository.listProjects()
```

TypeScript:

```ts
useQuery({
  queryKey: queryKeys.projects,
  queryFn: listProjects,
});
```

This passes the function itself.

When parameters are needed:

```ts
useQuery({
  queryKey: queryKeys.project(projectId),
  queryFn: () => getProject(projectId),
});
```

Use an arrow function so React Query can call it later. Do not call the function immediately:

```ts
queryFn: getProject(projectId); // wrong
```

## Object Destructuring Instead of Boilerplate Getters

Kotlin:

```kotlin
val auth = options.auth ?: false
val body = options.body
val headers = options.headers
```

TypeScript:

```ts
const {
  auth = false,
  body,
  headers,
  ...requestInit
} = options;
```

This means:

- pull `auth`, `body`, and `headers` out of `options`
- default `auth` to `false`
- put the remaining properties into `requestInit`

Useful when wrapping APIs:

```ts
fetch(url, {
  ...requestInit,
  body: body === undefined ? undefined : JSON.stringify(body),
  headers: {
    'Content-Type': 'application/json',
    ...headers,
  },
});
```

## Object Spread Instead of Builders

Kotlin often uses builders or copy:

```kotlin
val updated = project.copy(name = "New name")
```

TypeScript:

```ts
const updated = {
  ...project,
  name: 'New name',
};
```

For conditional properties:

```ts
const headers = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
  ...(token ? { Authorization: `Bearer ${token}` } : {}),
};
```

This is common in React props, request options, and state updates.

## Optional Chaining and Nullish Coalescing

Kotlin:

```kotlin
val name = user?.name ?: "Unknown"
```

TypeScript:

```ts
const name = user?.name ?? 'Unknown';
```

Use `??` when only `null` or `undefined` should fall back.

Avoid using `||` for default values when empty string or `0` are valid:

```ts
const count = value || 10; // treats 0 as missing
const count = value ?? 10; // only null/undefined are missing
```

## `unknown` Instead of `Any?`

Kotlin:

```kotlin
fun handle(value: Any?) {
    if (value is String) {
        value.uppercase()
    }
}
```

TypeScript:

```ts
function handle(value: unknown) {
  if (typeof value === 'string') {
    value.toUpperCase();
  }
}
```

Use `unknown` for untrusted data:

- API response fields before validation
- caught errors
- external library payloads
- JSON parsed from storage

Avoid `any` unless you intentionally want to turn off type checking.

## Runtime Validation at Boundaries

TypeScript types do not validate runtime data.

This is only a compile-time promise:

```ts
const body = (await response.json()) as AuthSessionResponse;
```

Validate important data before trusting it:

```ts
function parseAuthSession(body: AuthSessionResponse): AuthSession {
  if (
    typeof body.accessToken !== 'string' ||
    typeof body.refreshToken !== 'string' ||
    !body.user ||
    typeof body.user.id !== 'string'
  ) {
    throw new ApiError('Auth response is missing required session fields.', 0, 'INVALID_AUTH_RESPONSE');
  }

  return {
    accessToken: body.accessToken,
    refreshToken: body.refreshToken,
    expiresAt: typeof body.expiresAt === 'string' ? body.expiresAt : '',
    user: {
      id: body.user.id,
      email: body.user.email,
      name: body.user.name,
    },
  };
}
```

Kotlin serialization often gives stronger runtime parsing. In TypeScript, you must deliberately validate important boundaries.

## Interfaces: Use for Contracts, Not Everything

Good use:

```ts
export type AuthSessionStorage = {
  getSession: () => Promise<AuthSession | null>;
  setSession: (session: AuthSession) => Promise<void>;
  clearSession: () => Promise<void>;
};
```

Overuse:

```ts
interface ProjectServiceInterface {
  listProjects(): Promise<Project[]>;
}

class ProjectServiceImplementation implements ProjectServiceInterface {
  async listProjects() {
    return listProjects();
  }
}
```

In TypeScript, module functions are already easy to import and test. Add the contract only when the extra boundary pays for itself.

## Classes: Rare in React App Code

Good class use:

```ts
export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public code: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}
```

Less useful:

```ts
class ProjectApi {
  listProjects() {
    return authenticatedApiRequest<ProjectResponse[]>('/api/projects');
  }
}
```

Prefer:

```ts
export function listProjects() {
  return authenticatedApiRequest<ProjectResponse[]>('/api/projects');
}
```

Classes are useful for errors, SDK wrappers, stateful objects, and cases where runtime identity matters. Most React app code does not need them.

## Dependency Injection: Composition by Module and Provider

Kotlin:

```kotlin
single<ProjectRepository> { FirebaseProjectRepository(get()) }
```

TypeScript usually starts simpler:

```ts
import { listProjects } from '@/lib/api/projects-api';
```

For app-wide dependencies, React uses providers:

```tsx
<QueryClientProvider client={queryClient}>
  <AuthProvider>
    <Stack />
  </AuthProvider>
</QueryClientProvider>
```

For replaceable services, select the implementation in one composition point:

```ts
const authSessionStorage = secureStoreAuthSessionStorage;
```

Do not build a DI container unless the app genuinely needs one.

## Error Handling: `try/catch` + Narrowing

Kotlin:

```kotlin
try {
    saveProject()
} catch (error: Throwable) {
    message = error.message ?: "Save failed"
}
```

TypeScript:

```ts
try {
  await saveProject();
} catch (error) {
  setMessage(error instanceof Error ? error.message : 'Save failed.');
}
```

The caught value can be unknown. Narrow it before reading `.message`.

For API calls, throw typed errors:

```ts
throw new ApiError(message, response.status, 'API_REQUEST_FAILED');
```

Then:

```ts
if (error instanceof ApiError) {
  console.log(error.status, error.code);
}
```

## Props: Function Parameters for Components

Kotlin Compose:

```kotlin
@Composable
fun ProjectCard(project: Project, onPress: () -> Unit) { ... }
```

React Native:

```tsx
type ProjectCardProps = {
  project: ProjectResponse;
  onPress?: () => void;
};

export function ProjectCard({ project, onPress }: ProjectCardProps) {
  return <Pressable onPress={onPress}>{/* ... */}</Pressable>;
}
```

Props are just a typed object parameter.

Destructuring props is idiomatic:

```tsx
function Screen({ children, style }: ScreenProps) {
  return <ScrollView style={style}>{children}</ScrollView>;
}
```

## State Updates: Immutable Values

Kotlin:

```kotlin
state = state.copy(title = "New")
```

React:

```ts
setForm((current) => ({
  ...current,
  title: 'New',
}));
```

Do not mutate state directly:

```ts
form.title = 'New'; // wrong for React state
```

React needs a new object reference to know state changed.

## Event Handlers: Closures Instead of Listener Classes

Kotlin:

```kotlin
fun onSaveClicked() {
    viewModel.save()
}
```

React Native:

```tsx
async function handleSave() {
  await updateProjectMutation.mutateAsync(request);
  router.back();
}

return <ActionButton label="Save" onPress={handleSave} />;
```

Handlers close over local variables:

```tsx
function ProjectRow({ project }: Props) {
  return (
    <Pressable onPress={() => router.push(`/projects/${project.id}`)}>
      <Text>{project.name}</Text>
    </Pressable>
  );
}
```

This is normal React style.

## Modules Are Boundaries

Kotlin uses packages and visibility modifiers.

TypeScript uses files/modules and exports:

```ts
function parseAuthSession(...) {
  ...
}

export async function exchangeFirebaseTokenForSession(...) {
  ...
}
```

Only exported values are available to other modules.

Keep helper functions private by not exporting them.

## Avoid Translating These Kotlin Patterns Directly

Avoid defaulting to:

- class per service
- interface per implementation
- use case class per action
- DI container for simple imports
- inheritance for shared UI behavior
- result wrappers around every API response
- deep folder layering before the app needs it

Prefer:

- functions for actions
- hooks for UI coordination
- API modules for network calls
- object types for data
- discriminated unions for state
- providers for app-wide runtime dependencies
- small interfaces only at real change/test boundaries

## Practical Mapping Table

| Kotlin/KMP | TypeScript/React Native |
| --- | --- |
| `data class` | `type` object |
| nullable `T?` | `T \| null` or optional `field?: T` |
| smart cast `is String` | `typeof value === 'string'` |
| sealed class UI state | discriminated union |
| `when` | `switch` or `if` narrowing |
| `suspend fun` | `Promise<T>` / `async function` |
| ViewModel | custom hook |
| Repository interface | API module or small service contract |
| StateFlow | React state, Context, or React Query result |
| Koin module | provider or composition module |
| `copy(...)` | object spread `{ ...value, field }` |
| extension function | plain helper function |
| `Any?` | `unknown` with narrowing |
| exception subclass | `class ApiError extends Error` |

## Rule of Thumb

When writing TypeScript, ask:

```text
Is this data? Use a type.
Is this a state machine? Use a discriminated union.
Is this async server data? Use React Query.
Is this UI coordination? Use a hook.
Is this a network boundary? Use an API module.
Is this a replaceable dependency? Add a small contract.
Is this only Kotlin muscle memory? Keep it simpler.
```

Idiomatic TypeScript is not less architectural. It is less ceremonious. The architecture comes from clear boundaries, typed data, small functions, hooks, and disciplined module dependencies.
