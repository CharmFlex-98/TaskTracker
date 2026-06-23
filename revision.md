# React Native Interview Revision Notes

This file collects questions asked while building the TaskTracker React Native app. The goal is interview preparation, so the notes focus on React Native, Expo Router, TypeScript, React patterns, state management, authentication, and practical tooling issues that affect real development.

Use this file as a study guide:

- Add new questions under the closest category.
- Keep each question as a `####` heading.
- Include examples when the concept is abstract.
- Prefer explaining why a pattern is used, not just what it does.

## Menu

- [Project Context](#project-context)
- [React Native and JSX](#react-native-and-jsx)
  - [JSX Props and Custom Components](#jsx-props-and-custom-components)
  - [React Native Interaction Styling](#react-native-interaction-styling)
  - [React Native Refresh During Development](#react-native-refresh-during-development)
- [Expo Router and Navigation](#expo-router-and-navigation)
  - [Expo Router File Conventions](#expo-router-file-conventions)
  - [Route Groups](#route-groups)
  - [Dynamic Routes](#dynamic-routes)
  - [Links and Navigation Components](#links-and-navigation-components)
  - [Route Params](#route-params)
- [React State, Hooks, and App State](#react-state-hooks-and-app-state)
  - [Local Component State](#local-component-state)
  - [State Management and Data Fetching](#state-management-and-data-fetching)
- [Authentication and Security](#authentication-and-security)
  - [Environment Variables](#environment-variables)
- [TypeScript](#typescript)
  - [Component Prop Types](#component-prop-types)
  - [`typeof`](#typeof)
  - [Intersection Types](#intersection-types)
  - [React Native Library Type Example](#react-native-library-type-example)
- [Tooling and Environment](#tooling-and-environment)
  - [npm Scripts](#npm-scripts)
  - [Lint](#lint)
  - [Node and Android Studio](#node-and-android-studio)
- [Future Questions Template](#future-questions-template)

## Project Context

This category records what has been built and why. It is useful for interview storytelling: what problem the app solves, what milestones were completed, and what technical decisions were made.

### Did we complete Phase 1?

Yes.

Phase 1 was completed and committed with:

```text
4e6c2f1 Complete Phase 1 app shell foundation
```

Phase 1 covered:

- Expo SDK 56 project baseline.
- Real app shell replacing starter screens.
- Tabs for Home, Projects, Tasks, Search, and Settings.
- Route groups for app and auth areas.
- Project/task list, detail, create, and edit preview screens.
- Reusable UI primitives.
- Theme support through existing light/dark theme hooks.
- TypeScript domain models.
- Lint and type-check passing.

### Did we complete Phase 2?

The frontend foundation for Phase 2 is complete.

Phase 2 added:

- `expo-auth-session`
- `expo-crypto`
- `expo-secure-store`
- auth session types
- SecureStore session persistence
- `AuthProvider`
- protected app routes
- `/sign-in` route
- Google OAuth sign-in shell
- local preview sign-in
- sign-out in Settings

Real Google OAuth still needs the Spring Boot backend endpoint:

```http
POST /auth/google
```

Expected request:

```json
{
  "code": "google-authorization-code",
  "redirectUri": "tasktracker://...",
  "codeVerifier": "pkce-code-verifier"
}
```

Expected response:

```json
{
  "accessToken": "app-access-token",
  "refreshToken": "app-refresh-token",
  "expiresAt": "2026-06-18T00:00:00.000Z",
  "user": {
    "id": "user-id",
    "email": "user@example.com",
    "name": "User Name",
    "avatarUrl": "https://example.com/avatar.png"
  }
}
```

## React Native and JSX

This category covers JSX syntax, component props, React Native components, interaction styling, and development refresh behavior.

### JSX props and custom components

#### What does this mean?

```tsx
<ThemedText type="subtitle" selectable>
  Projects
</ThemedText>
```

`ThemedText` is our custom wrapper around React Native's `Text`.

```tsx
type="subtitle"
```

uses the `subtitle` text style:

```ts
subtitle: {
  fontSize: 32,
  lineHeight: 44,
  fontWeight: 600,
}
```

```tsx
selectable
```

means the user can select/copy the text.

#### Why does `selectable` not have `true` or `false`?

In JSX, a prop without a value means `true`.

This:

```tsx
<ThemedText selectable />
```

is the same as:

```tsx
<ThemedText selectable={true} />
```

To disable:

```tsx
<ThemedText selectable={false} />
```

Other examples:

```tsx
<Button disabled />
```

means:

```tsx
<Button disabled={true} />
```

```tsx
<TextInput multiline />
```

means:

```tsx
<TextInput multiline={true} />
```

### React Native interaction styling

#### Why is `Pressable` style a function?

Example:

```tsx
<Pressable style={({ pressed }) => ({ opacity: pressed ? 0.72 : 1 })}>
```

`Pressable` supports two forms of `style`.

Static object:

```tsx
<Pressable style={{ opacity: 1 }} />
```

Function:

```tsx
<Pressable style={({ pressed }) => ({ opacity: pressed ? 0.72 : 1 })} />
```

The function receives interaction state.

`pressed` is `true` while the user is touching the button.

So:

```ts
pressed ? 0.72 : 1
```

means:

```text
while pressed -> opacity 0.72
otherwise -> opacity 1
```

Use function style when styling depends on state:

- pressed
- hovered
- focused

### React Native refresh during development

#### Do I need to rerun the emulator after JS/TS changes?

Usually no.

React Native uses Fast Refresh. When you edit JS/TS/TSX files, Metro updates the running app.

Examples that usually do not need a rebuild:

```text
src/app/index.tsx
src/components/task-card.tsx
src/app/projects/[projectId].tsx
```

If needed, reload from the Expo terminal:

```text
r
```

You need a native rebuild only when changing native things:

- native dependencies
- Android files
- iOS files
- app icons
- splash screen native config
- permissions
- Gradle config

## Tooling and Environment

This category covers npm scripts, linting, Node versions, and Android Studio environment issues.

### npm scripts

#### What does the `scripts` section in `package.json` mean?

The `scripts` section defines shortcut commands.

Example:

```json
"scripts": {
  "start": "expo start",
  "reset-project": "node ./scripts/reset-project.js",
  "android": "expo run:android",
  "ios": "expo run:ios",
  "web": "expo start --web",
  "lint": "expo lint"
}
```

You run them with:

```bash
npm run <script-name>
```

For `start`, you can also run:

```bash
npm start
```

Meaning:

```bash
npm start
```

runs:

```bash
expo start
```

```bash
npm run android
```

runs:

```bash
expo run:android
```

```bash
npm run lint
```

runs:

```bash
expo lint
```

#### What is `reset-project`?

This runs:

```bash
node ./scripts/reset-project.js
```

It is a starter-template helper script. Be careful with it because it may move/delete starter files.

#### Why did we switch the backend from Maven to Gradle?

The first backend scaffold used Maven because Spring Initializr can generate a clean Maven wrapper quickly, and Maven is common in Spring Boot services.

Then you asked to follow:

```text
~/IDEAProject/flexiexpensesmanager
```

That project uses:

```text
Kotlin
Gradle Kotlin DSL
Spring Boot
Java 17 toolchain
package-by-feature source layout
application.properties with optional .env.properties
custom ExceptionBase + GlobalExceptionHandler
```

So the backend was changed to match that setup.

Maven and Gradle both solve the same category of problem:

- dependency management
- compiling code
- running tests
- packaging/running the app

Maven uses:

```text
pom.xml
./mvnw test
./mvnw spring-boot:run
```

Gradle uses:

```text
build.gradle.kts
./gradlew test
./gradlew bootRun
```

For this project, Gradle is now the correct choice because it matches your existing backend reference project.

#### Why did we add H2 to the Spring Boot server?

H2 is an in-memory database used for local development.

It lets the backend start without needing PostgreSQL credentials immediately.

Without H2, this local default would not work:

```properties
spring.datasource.url=jdbc:h2:mem:tasktracker
```

So H2 was added as:

```kotlin
runtimeOnly("com.h2database:h2")
```

That means:

- it is available when the app runs locally
- it is not a test dependency
- it is not intended as the production database

For production or real online data, the app should use PostgreSQL:

```properties
TASKTRACKER_DB_URL=jdbc:postgresql://...
TASKTRACKER_DB_USERNAME=...
TASKTRACKER_DB_PASSWORD=...
TASKTRACKER_DB_DRIVER=org.postgresql.Driver
```

Why not only PostgreSQL right now?

Because requiring PostgreSQL from the first backend commit adds setup friction. H2 gives a quick local backend loop while we are still shaping the API.

Interview angle:

Say H2 is a local development convenience, while PostgreSQL is the real persistence target. A production Spring Boot app should not silently use H2 unless that is an intentional local profile.

#### Why create a compound index like `(owner_id, updated_at)`?

A compound index supports queries that filter and sort by the same predictable pattern.

Example:

```sql
create index if not exists idx_projects_owner_updated
on projects(owner_id, updated_at);
```

This matches the project list query:

```sql
select id, owner_id, name, description, status, created_at, updated_at
from projects
where owner_id = :ownerId
order by updated_at desc;
```

Why `owner_id` first?

Because every project list is scoped to the authenticated user:

```sql
where owner_id = :ownerId
```

The database can quickly find only that user's rows.

Why `updated_at` second?

Because the list is sorted by latest update:

```sql
order by updated_at desc
```

The index is ordered by owner first, then update time. That helps the database avoid scanning all projects for all users.

Same idea for tasks:

```sql
create index if not exists idx_tasks_owner_updated
on tasks(owner_id, updated_at);
```

It supports:

```sql
where owner_id = :ownerId
order by updated_at desc
```

One possible improvement:

```sql
create index if not exists idx_projects_owner_updated
on projects(owner_id, updated_at desc);
```

PostgreSQL can often scan indexes backward, but `desc` documents the exact query pattern.

Interview angle:

Say the index matches the access pattern. `owner_id` enforces user-scoped lookup, and `updated_at` supports recent-first ordering.

#### What is `@Valid`?

`@Valid` tells Spring to validate an incoming request body before the controller method continues.

Example from the backend:

```kotlin
@PostMapping
fun createProject(
    servletRequest: HttpServletRequest,
    @Valid @RequestBody request: CreateProjectRequest
): ProjectResponse
```

The request DTO has validation rules:

```kotlin
data class CreateProjectRequest(
    @field:NotBlank val name: String,
    val description: String?,
)
```

Flow:

```text
Client sends JSON
-> Spring converts JSON into CreateProjectRequest
-> @Valid runs validation annotations like @NotBlank
-> invalid request throws MethodArgumentNotValidException
-> GlobalExceptionHandler returns a structured 400 response
```

Without `@Valid`, annotations like `@NotBlank`, `@Min`, and `@Max` may be present on the DTO but not enforced for that controller request.

Interview angle:

Say `@Valid` is controller-bound request validation. It keeps invalid API input from reaching business logic, while the service layer can still keep additional domain validation for rules that cannot be expressed with simple annotations.

#### What is `npx tsc`?

`tsc` is the TypeScript compiler.

`npx tsc --noEmit` means:

```bash
npx tsc --noEmit
```

- `npx` runs a package binary from the project dependencies
- `tsc` runs the TypeScript compiler
- `--noEmit` tells TypeScript to check the code without generating JavaScript files

In this Expo project, we use it as a type-check command.

Example:

```ts
const count: number = "hello";
```

`npx tsc --noEmit` catches that because `"hello"` is a string, not a number.

It is different from lint:

```text
tsc = checks TypeScript types
lint = checks code quality, React rules, imports, and risky patterns
```

Interview angle:

Say `tsc --noEmit` is a safe CI/local verification step because it validates TypeScript correctness without producing build output.

### Lint

#### What is lint used for?

Lint checks code quality and catches common bugs.

TypeScript checks types:

```ts
const count: number = "hello"; // TypeScript catches this
```

Lint checks code patterns:

- unused imports
- unresolved imports
- invalid React Hook usage
- risky React patterns
- missing hook dependencies
- code style issues

Example from this project:

```ts
useEffect(() => {
  setHasHydrated(true);
}, []);
```

React lint rules warned that calling `setState` directly inside an effect can cause extra render work. We replaced it with `useSyncExternalStore`.

#### Difference between `"lint": "expo lint"` and `"lint": "eslint ."`?

```json
"lint": "expo lint"
```

uses Expo's lint wrapper.

Expo can:

- configure ESLint
- install Expo's ESLint config
- run ESLint with Expo-aware behavior

```json
"lint": "eslint ."
```

runs ESLint directly on the current directory.

The `.` means:

```text
current folder and files below it
```

So:

```bash
eslint .
```

means:

```text
lint this project folder
```

#### Why did `expo lint` initially fail with `Cannot find module 'eslint'`?

The likely cause was the unsupported Node version.

The machine was using:

```text
Node v20.16.0
```

Expo SDK 56 / React Native 0.85 requires:

```text
>=20.19.4
```

After switching to Node 22, `expo lint` worked normally.

The earlier error looked like:

```text
Cannot find module 'eslint'
Require stack:
- node_modules/expo/node_modules/@expo/cli/...
```

ESLint was installed, but Expo's CLI wrapper failed to resolve it from its nested CLI path. Since the Node version was unsupported, this is best treated as a local tooling edge case triggered by wrong Node.

#### Why did `npm run lint` print nothing?

Example:

```bash
npm run lint

> tasktracker@1.0.0 lint
> expo lint
```

If there is no output after that, it means lint passed.

To verify:

```bash
npm run lint; echo $?
```

If it prints:

```text
0
```

then the command succeeded.

### Node and Android Studio

#### How to update or switch Node?

This project uses `nvm`.

Installed versions included:

```text
v20.16.0
v22.14.0
```

Use Node 22:

```bash
source "$HOME/.nvm/nvm.sh"
nvm use 22.14.0
node -v
```

Expected:

```text
v22.14.0
```

Set Node 22 as default:

```bash
nvm alias default 22.14.0
```

#### Do I need to run `nvm use` every time?

Not if you set the default:

```bash
nvm alias default 22.14.0
```

Then new terminals should use Node 22.

You can also create a project `.nvmrc`:

```bash
echo "22.14.0" > .nvmrc
```

Then inside the project:

```bash
nvm use
```

#### Why did Android Studio fail with `Cannot run program "node"`?

Android Studio is a GUI app. On macOS, GUI apps often do not inherit shell configuration like `nvm`.

Terminal knew where Node was:

```text
/Users/jiaming/.nvm/versions/node/v22.14.0/bin/node
```

But Android Studio's Gradle process did not.

Gradle tried to run:

```text
node
```

and failed:

```text
error=2, No such file or directory
```

Fix:

```bash
source "$HOME/.nvm/nvm.sh"
nvm use 22.14.0
open -a "Android Studio"
```

Important:

```bash
open -a "Android Studio"
```

is correct.

This is wrong:

```bash
open -a "Android\ Studio"
```

Inside quotes, do not escape the space.

Alternative:

```bash
open -a Android\ Studio
```

## Expo Router and Navigation

This category covers file-based routing, layouts, route groups, dynamic routes, links, and route params.

### Expo Router file conventions

#### What is `_layout.tsx` for?

`_layout.tsx` defines shared layout/navigation for routes in the folder.

Example:

```text
src/app/_layout.tsx
```

wraps the whole app.

In our project, root layout wraps:

```tsx
<ThemeProvider>
  <AuthProvider>
    <Stack>
      <Stack.Screen name="(app)" />
      <Stack.Screen name="(auth)" />
    </Stack>
  </AuthProvider>
</ThemeProvider>
```

It is not a screen itself. It controls how screens are wrapped.

#### What is `index.tsx` for?

`index.tsx` is the default route for a folder.

Example:

```text
src/app/(app)/index.tsx
```

maps to:

```text
/
```

Example:

```text
src/app/(app)/projects/index.tsx
```

maps to:

```text
/projects
```

Mental model:

```text
_layout.tsx = wrapper/navigation
index.tsx = default screen for that folder
```

#### How do I know which screen opens first?

In Expo Router, the first screen comes from the file-based route tree plus layouts and redirects.

For this project, startup begins at the root layout:

```tsx
<Stack screenOptions={{ headerShown: false }}>
  <Stack.Screen name="(app)" />
  <Stack.Screen name="(auth)" />
</Stack>
```

Because `(app)` is listed first and has an `index.tsx`, the initial route is:

```text
/
```

which maps to:

```text
src/app/(app)/index.tsx
```

But before showing that screen, Expo Router runs the group layout:

```text
src/app/(app)/_layout.tsx
```

That layout checks auth:

```tsx
const { status } = useAuth();

if (status === 'loading') {
  return <RestoringSessionScreen />;
}

if (status === 'unauthenticated') {
  return <Redirect href="/sign-in" />;
}

return <AppTabs />;
```

So the actual startup behavior is:

```text
App opens at /
/ maps to (app)/index.tsx
(app)/_layout checks auth
loading -> Restoring session screen
unauthenticated -> /sign-in
authenticated -> Home tab
```

If the user is authenticated, `(app)/_layout` returns tabs:

```tsx
<NativeTabs.Trigger name="index">
  <NativeTabs.Trigger.Label>Home</NativeTabs.Trigger.Label>
</NativeTabs.Trigger>
```

So the authenticated first screen is:

```text
Home -> src/app/(app)/index.tsx
```

If the user is unauthenticated, the redirect sends them to:

```text
/sign-in -> src/app/(auth)/sign-in.tsx
```

How to debug the first screen:

```text
1. Check src/app/_layout.tsx.
2. Check the first Stack.Screen or route group.
3. Check that group's _layout.tsx.
4. Check that group's index.tsx.
5. Check any <Redirect /> logic.
```

Interview angle:

Say Expo Router starts from the route tree and layout hierarchy. `index.tsx` gives the default route, while layouts can redirect or wrap the screen before it appears.

#### Is `TabLayout` used if I never call it?

Yes.

Expo Router automatically loads the default export from `_layout.tsx`.

Example:

```tsx
export default function RootLayout() {
  return <Stack />;
}
```

You do not manually write:

```tsx
<RootLayout />
```

Expo Router does that because the file is:

```text
src/app/_layout.tsx
```

The function name does not matter. The default export matters.

#### Does `app-tabs.tsx` automatically become tabs?

No.

`app-tabs.tsx` is just a component file. It becomes the app's tab UI only because `_layout.tsx` or `(app)/_layout.tsx` renders it:

```tsx
import AppTabs from '@/components/app-tabs';

export default function AppLayout() {
  return <AppTabs />;
}
```

Inside `AppTabs`, we use:

```tsx
<NativeTabs>
  ...
</NativeTabs>
```

`NativeTabs` creates the tabs.

Only files inside `src/app` have special routing meaning. Files inside `src/components` do not become routes automatically.

#### Why are there two files: `app-tabs.tsx` and `app-tabs.web.tsx`?

React Native supports platform-specific files.

```text
app-tabs.tsx
```

is used on native platforms like Android/iOS.

```text
app-tabs.web.tsx
```

is used on web.

Expo automatically chooses the correct file.

### Route groups

#### Why use route groups like `(app)` and `(auth)`?

Parentheses create route groups.

Example:

```text
src/app/(app)/projects/index.tsx
```

maps to:

```text
/projects
```

not:

```text
/(app)/projects
```

Route groups are hidden from the URL.

We use groups for:

- different layouts
- different access rules
- organization

Example:

```text
(app)
```

contains authenticated app screens and renders tabs.

```text
(auth)
```

contains sign-in screens and does not render tabs.

#### How do you navigate to a route group?

You do not navigate to the group name directly.

You navigate to a route inside the group.

This file:

```text
src/app/(auth)/sign-in.tsx
```

is opened with:

```tsx
router.push('/sign-in');
```

This file:

```text
src/app/(app)/projects/index.tsx
```

is opened with:

```tsx
router.push('/projects');
```

The group controls layout and guards. The URL path stays clean.

#### If groups are hidden, why use them?

Because groups let us separate behavior without changing URLs.

Without groups, `/sign-in` might accidentally be inside the tab layout.

With groups:

```text
(app)/_layout.tsx
```

can render tabs.

```text
(auth)/sign-in.tsx
```

can avoid tabs.

Later, auth guards can say:

```ts
if (!session && currentGroup === '(app)') {
  router.replace('/sign-in');
}
```

So:

```text
URL path = where the user goes
Route group = how that route is organized/wrapped/guarded
```

### Dynamic routes

#### What does `[projectId]` mean?

Square brackets create a dynamic route parameter.

File:

```text
src/app/(app)/projects/[projectId].tsx
```

URL:

```text
/projects/project-mobile
```

Then:

```ts
projectId = "project-mobile"
```

#### Difference between `(app)` and `[projectId]`

```text
(app)
```

is a route group. It is hidden from the URL.

```text
[projectId]
```

is a dynamic route param. It captures a URL value.

Example:

```text
src/app/(app)/projects/[projectId].tsx
```

URL:

```text
/projects/project-mobile
```

Result:

```ts
projectId = "project-mobile"
```

### Links and navigation components

#### What is `LinkButton`?

`LinkButton` is a reusable component written for this project.

File:

```text
src/components/link-button.tsx
```

It wraps Expo Router's `Link` and React Native's `Pressable`.

Instead of writing this every time:

```tsx
<Link href="/tasks/new" asChild>
  <Pressable>
    <ThemedView>
      <ThemedText>New task</ThemedText>
    </ThemedView>
  </Pressable>
</Link>
```

we write:

```tsx
<LinkButton href="/tasks/new" label="New task" />
```

#### What is `asChild`?

`asChild` means:

```text
Do not render Link's default UI. Pass Link behavior into my child component.
```

Example:

```tsx
<Link href="/tasks/new" asChild>
  <Pressable>
    <Text>New task</Text>
  </Pressable>
</Link>
```

The `Pressable` becomes the clickable navigation element.

Without `asChild`, you may get a default link wrapper.

With `asChild`, the navigation behavior is applied to your custom child.

#### Why use `Link` at all?

`Pressable` alone only responds to touch. It does not navigate.

This does nothing unless you add `onPress`:

```tsx
<Pressable>
  <Text>New task</Text>
</Pressable>
```

Option 1, declarative navigation:

```tsx
<Link href="/tasks/new" asChild>
  <Pressable>
    <Text>New task</Text>
  </Pressable>
</Link>
```

Option 2, imperative navigation:

```tsx
const router = useRouter();

<Pressable onPress={() => router.push('/tasks/new')}>
  <Text>New task</Text>
</Pressable>
```

Use `Link` when the button always navigates to a known route.

Use `router.push` when navigation depends on logic, validation, or async work.

#### Why does `href` sometimes use double braces?

Example:

```tsx
<Link
  href={{
    pathname: '/projects/[projectId]',
    params: { projectId: project.id },
  }}
/>
```

The outer braces are JSX syntax:

```tsx
href={...}
```

The inner braces are a JavaScript object:

```ts
{
  pathname: '/projects/[projectId]',
  params: { projectId: project.id }
}
```

So:

```tsx
href={{
  pathname: '/projects/[projectId]',
  params: { projectId: project.id },
}}
```

means:

```tsx
href={
  {
    pathname: '/projects/[projectId]',
    params: { projectId: project.id },
  }
}
```

For static routes, use a string:

```tsx
<Link href="/projects/new" />
```

For dynamic routes, object syntax is safer:

```tsx
<Link href={{ pathname: '/projects/[projectId]', params: { projectId } }} />
```

It lets typed routes check the route and param names.

#### Can `href` be a string for dynamic routes?

Yes.

Example:

```tsx
<Link href={`/projects/${project.id}`} />
```

If:

```ts
project.id = "project-mobile"
```

then the route becomes:

```text
/projects/project-mobile
```

But object syntax is clearer and safer with typed routes:

```tsx
<Link href={{ pathname: '/projects/[projectId]', params: { projectId: project.id } }} />
```

### Route params

#### What does this mean?

```ts
const { projectId } = useLocalSearchParams<{ projectId?: string }>();
```

It reads the dynamic route parameter from Expo Router.

For this file:

```text
src/app/(app)/projects/[projectId].tsx
```

Opening:

```text
/projects/project-mobile
```

gives:

```ts
projectId = "project-mobile"
```

The type:

```ts
{ projectId?: string }
```

means:

```text
projectId may exist, and if it exists, it should be a string
```

The `?` means optional.

We still check:

```ts
if (typeof projectId !== 'string') {
  return <MissingProject message="Project route is missing a valid project id." />;
}
```

because route params can be missing or malformed.

## TypeScript

This category covers prop typing, `typeof`, intersection types, and library-level type declarations.

### Core TypeScript Types

#### What is the difference between `unknown` and `any`?

`unknown` means a value can be anything, but TypeScript will not let you use it until you check what it is.

Example:

```ts
function handle(value: unknown) {
  value.toUpperCase(); // error
}
```

You must narrow it first:

```ts
function handle(value: unknown) {
  if (typeof value === 'string') {
    value.toUpperCase(); // ok
  }
}
```

`any` means TypeScript stops checking that value.

Example:

```ts
function handle(value: any) {
  value.toUpperCase(); // compiles, but may crash at runtime
}
```

Kotlin comparison:

```text
TypeScript unknown ~= Kotlin Any? as an input type, but stricter before use
TypeScript any     ~= turns off type checking for that value
Kotlin Any         ~= non-null top type
Kotlin Any?        ~= nullable top type
```

In this project:

```ts
type ApiRequestOptions = Omit<RequestInit, 'body'> & {
  body?: unknown;
};
```

This lets our API wrapper accept any app-level JSON payload:

```ts
apiRequest('/api/projects', {
  method: 'POST',
  body: {
    name: 'TaskTracker',
  },
});
```

Then the wrapper converts it before calling `fetch`:

```ts
body: options.body === undefined ? undefined : JSON.stringify(options.body)
```

Interview angle:

Say `unknown` is safer than `any` because it accepts flexible input while preserving type safety before use.

#### What does object destructuring with defaults and rest mean?

This line:

```ts
const {
  auth = false,
  body,
  errorCode = 'API_REQUEST_FAILED',
  fallbackErrorMessage,
  headers,
  ...requestInit
} = options;
```

pulls selected properties out of the `options` object.

It creates these variables:

```ts
auth
body
errorCode
fallbackErrorMessage
headers
requestInit
```

The `= false` and `= 'API_REQUEST_FAILED'` parts are defaults. They are used only when that property is `undefined`.

Example:

```ts
const options = {
  auth: true,
  body: { title: 'Task' },
  method: 'POST',
  signal: abortController.signal,
};
```

After destructuring:

```ts
auth; // true
body; // { title: 'Task' }
errorCode; // 'API_REQUEST_FAILED'
fallbackErrorMessage; // undefined
headers; // undefined

requestInit; // { method: 'POST', signal: abortController.signal }
```

The `...requestInit` part is the rest object. It collects every remaining property that was not already pulled out.

Why it is useful in `apiRequest`:

```ts
fetch(`${apiUrl}${path}`, {
  ...requestInit,
  body: body === undefined ? undefined : JSON.stringify(body),
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...headers,
  },
});
```

`auth`, `errorCode`, and `fallbackErrorMessage` are custom options for our API client. They are not native `fetch` options, so we remove them before calling `fetch`.

`method`, `signal`, `cache`, `credentials`, and similar native request options remain in `requestInit`, so they can be safely passed to `fetch`.

Interview angle:

Say destructuring extracts known fields from an object, defaults handle missing values, and rest properties collect everything left over. It is useful when wrapping APIs because custom wrapper options can be separated from the options that should be forwarded.

#### What does `exactOptionalPropertyTypes` mean?

This TypeScript setting changes what optional properties mean when writing object values.

Start with:

```ts
type Options = {
  method?: string;
};
```

The `?` means the property can be omitted:

```ts
const a: Options = {};
const b: Options = { method: 'POST' };
```

The confusing case:

```ts
const c: Options = { method: undefined };
```

With:

```json
{
  "exactOptionalPropertyTypes": false
}
```

TypeScript allows it.

With:

```json
{
  "exactOptionalPropertyTypes": true
}
```

TypeScript rejects it, because:

```ts
method?: string
```

means:

```text
method may be missing
but if method exists, it must be a string
```

If explicit `undefined` should be allowed, write:

```ts
type Options = {
  method?: string | undefined;
};
```

Then these are all valid:

```ts
const a: Options = {};
const b: Options = { method: 'POST' };
const c: Options = { method: undefined };
```

Key rule:

```text
? controls whether the property can be omitted.
| undefined controls whether the value can explicitly be undefined.
```

Interview angle:

Say optional property syntax is about property presence, while `undefined` is about the value. `exactOptionalPropertyTypes` makes TypeScript enforce that distinction more strictly.

#### Why can the backend treat an omitted request field as null, but the client still receives null from a response?

Request parsing and response parsing happen in different runtimes.

Client to server:

```json
{
  "projectId": "p1",
  "title": "Task"
}
```

This JSON omits `description`.

The backend deserializes the JSON into a Kotlin DTO:

```kotlin
data class CreateTaskRequest(
    val description: String?,
)
```

Because `description` is nullable, Jackson/Spring can construct the DTO with:

```kotlin
description = null
```

So on the server:

```text
missing JSON field -> nullable Kotlin property becomes null
```

This is why a TypeScript request type can allow:

```ts
description?: string | null;
```

It means the client may omit the field, send a string, or explicitly send `null`.

Server to client:

```json
{
  "description": null
}
```

After:

```ts
const body = await response.json();
```

JavaScript receives the actual JSON value:

```ts
body.description === null; // true
body.description === undefined; // false
```

TypeScript types do not transform runtime data. This type:

```ts
type ProjectResponse = {
  description?: string;
};
```

does not convert:

```json
{ "description": null }
```

into:

```ts
{ description: undefined }
```

If the server omits the field:

```json
{}
```

then JavaScript sees:

```ts
body.description === undefined;
```

If the server includes null:

```json
{ "description": null }
```

then JavaScript sees:

```ts
body.description === null;
```

Kotlin comparison:

```kotlin
val description: String?
```

maps best to:

```ts
description: string | null;
```

for a response field that the backend always returns.

Key rule:

```text
Request type describes what the client is allowed to send.
Response type mirrors what the backend actually sends.
```

Interview angle:

Say Jackson creates a Kotlin object and can fill omitted nullable fields with `null`. On the frontend, `response.json()` returns literal JavaScript values, and TypeScript does not exist at runtime to convert `null` into `undefined`.

#### Should TypeScript request/response types avoid optional fields and use `null` instead?

Not as a blanket rule.

Optional fields and nullable values mean different things:

```ts
description?: string | null;
```

means:

```text
field may be omitted
or field may exist with a string
or field may exist with null
```

But:

```ts
description: string | null;
```

means:

```text
field must exist
but its value may be string or null
```

For safety, required nullable fields are better when the contract expects a full shape.

Good examples:

```ts
type TaskResponse = {
  description: string | null;
  dueDate: string | null;
};
```

The backend returns those fields, so the frontend response type should say they exist.

For a full update request:

```ts
type UpdateTaskRequest = {
  projectId: string;
  title: string;
  description: string | null;
  status: TaskResponse['status'];
  priority: TaskResponse['priority'];
  dueDate: string | null;
  progress: number;
};
```

This is clearer than making `description` and `dueDate` optional, because the backend update endpoint behaves like a full replacement shape, not a partial PATCH.

For create requests, optional fields still make sense when the backend has defaults:

```ts
type CreateTaskRequest = {
  projectId: string;
  title: string;
  description?: string | null;
  status?: TaskResponse['status'];
  priority?: TaskResponse['priority'];
  dueDate?: string | null;
  progress?: number;
};
```

The backend can fill omitted fields:

```kotlin
val status = request.status ?: TODO_STATUS
val priority = request.priority ?: MEDIUM_PRIORITY
val progress = request.progress ?: 0
```

If the frontend made every create field required, it would have to send noisy values even when it wants the backend defaults.

Key rule:

```text
Use required nullable fields when the field is always part of the contract.
Use optional fields when the client is allowed to omit the field.
Use both only when the client may omit the field or explicitly send null.
```

Kotlin comparison:

```kotlin
val description: String?
```

means the Kotlin property exists and its value may be null. In TypeScript response/full-update models, that usually maps to:

```ts
description: string | null;
```

For create/partial request models, TypeScript can also express omission:

```ts
description?: string | null;
```

Interview angle:

Say optionality is about property presence, while `null` is about an explicit empty value. Response and PUT-style update types should usually be required nullable. Create or PATCH-style request types can use optional fields when omission is part of the API contract.

#### What does `declare var Error: ErrorConstructor` mean?

`Error` is a built-in JavaScript global runtime value.

JavaScript provides this at runtime:

```ts
const error = new Error('Failed');
```

TypeScript describes that runtime value with declaration types:

```ts
interface ErrorConstructor {
  new (message?: string): Error;
  (message?: string): Error;
  readonly prototype: Error;
}

declare var Error: ErrorConstructor;
```

This means:

```text
There is a global variable named Error.
It already exists at runtime.
Its type is ErrorConstructor.
```

`declare` does not create the value. It only tells TypeScript about a value that JavaScript or another runtime already provides.

For normal app types, do not use `declare var`.

Use:

```ts
type Project = {
  id: string;
  name: string;
};
```

or:

```ts
interface Project {
  id: string;
  name: string;
}
```

Use `declare` only when something exists externally at runtime, but TypeScript does not know its type.

Example:

```ts
declare var NativeBridge: {
  send(message: string): void;
};
```

This says:

```text
NativeBridge exists at runtime.
TypeScript should type it as an object with send(message: string).
```

If `NativeBridge` does not actually exist at runtime, the app can still crash.

#### What if TypeScript declares a runtime API incorrectly?

Then TypeScript is lying.

TypeScript types do not change JavaScript runtime behavior. They only describe what TypeScript believes is true.

Example:

```ts
interface ErrorConstructor {
  new (message?: string): Error;
}
```

If the real JavaScript runtime did not support:

```ts
new Error('Failed');
```

then TypeScript might compile the code, but the app could fail at runtime.

This is why declaration files must match the real JavaScript runtime.

Important rule:

```text
TypeScript types are compile-time descriptions, not runtime guarantees.
```

When writing `declare`, you are making a promise to TypeScript:

```text
This runtime thing exists, and its shape is exactly this.
```

If the promise is wrong, TypeScript cannot protect you.

Interview angle:

Say TypeScript is structurally describing JavaScript. Built-in declarations like `ErrorConstructor` describe real JavaScript globals. Custom `declare` statements should be used carefully because they bypass proof that the value actually exists at runtime.

#### What does `declare global`, `ProcessEnv`, and `export {}` mean in env typings?

Example:

```ts
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      EXPO_PUBLIC_API_URL?: string;
      EXPO_PUBLIC_FIREBASE_API_KEY?: string;
    }
  }
}

export {};
```

This file is TypeScript typing only. It does not load environment values.

The actual values come from `.env` / Expo:

```env
EXPO_PUBLIC_API_URL=http://localhost:3000
```

The declaration tells TypeScript:

```text
process.env.EXPO_PUBLIC_API_URL is a known key,
and its value is string | undefined.
```

Why `undefined`?

Because the variable may be missing from `.env`.

So TypeScript encourages checks like:

```ts
const apiUrl = process.env.EXPO_PUBLIC_API_URL;

if (!apiUrl) {
  throw new ApiError('EXPO_PUBLIC_API_URL is not configured.', 0, 'API_URL_MISSING');
}
```

`global` means available everywhere without importing.

Examples of global runtime values:

```ts
console.log('hi');
setTimeout(() => {}, 1000);
```

No import is needed for those.

TypeScript also has global types. `declare global` means:

```text
Add these declarations to the global TypeScript type scope.
```

`namespace NodeJS` is used because `process.env` is typed through Node's existing `NodeJS.ProcessEnv` type.

`ProcessEnv` cannot be renamed if the goal is to type `process.env`.

This works:

```ts
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      EXPO_PUBLIC_API_URL?: string;
    }
  }
}
```

because it merges with the existing `NodeJS.ProcessEnv` interface.

This does not type `process.env`:

```ts
declare global {
  namespace NodeJS {
    interface MyEnv {
      EXPO_PUBLIC_API_URL?: string;
    }
  }
}
```

because `process.env` is not typed as `NodeJS.MyEnv`.

`export {};` makes the file a module.

TypeScript files are either script files or module files. A file becomes a module when it has any `import` or `export`.

This declaration file has no real imports or exports, so we add:

```ts
export {};
```

That means:

```text
Treat this file as a module, even though it exports no runtime values.
```

This matters because `declare global` is intended to be used from inside a module. Without `export {};`, TypeScript may complain in some configurations:

```text
Augmentations for the global scope can only be directly nested in external modules
```

Key distinction:

```text
.env provides runtime/build-time values.
env.d.ts provides compile-time TypeScript types.
```

Interview angle:

Say env declaration files do not load configuration. They only augment TypeScript's global `process.env` type so custom env keys have autocomplete and safe `string | undefined` checking. `export {};` is a module marker that makes `declare global` valid.

### TypeScript vs Kotlin/KMP Architecture

#### How are TypeScript best practices different from Kotlin/KMP best practices?

Kotlin/KMP and TypeScript can follow the same architectural ideas, but the enforcement level is different.

Kotlin/KMP gives stronger compile-time boundaries:

- source sets: `commonMain`, `androidMain`, `iosMain`
- interfaces and concrete implementations
- sealed classes/interfaces
- `expect` / `actual`
- DI through Koin modules
- ViewModels exposing typed state flows

TypeScript gives useful types, but many boundaries are convention-based:

- folders and import rules define layers
- structural typing means objects are compatible by shape
- runtime data from APIs still needs validation or parsing
- React hooks and context are runtime patterns, not compiler-enforced architecture

KoreanDiary uses this KMP feature shape:

```text
feature/<name>/
  data/
  domain/
    model/
    repository/
    usecase/
  ui/
  route/
  destination/
  di/
```

TaskTracker should use a React Native equivalent:

```text
src/features/projects/
  api or data/
  model or types/
  queries/
  screens or components/

src/lib/api/
src/lib/query/
src/lib/storage/
```

The best-practice mapping:

```text
Kotlin repository interface
-> TypeScript API module or service interface

Kotlin use case
-> TypeScript hook, command function, or domain function

Kotlin ViewModel
-> React component + custom hook + React Query mutation/query

Kotlin StateFlow
-> React state, Context, or React Query cache

Kotlin sealed class UI state
-> TypeScript discriminated union

Kotlin expect/actual
-> platform files, Expo modules, or small adapter interfaces
```

Example TypeScript discriminated union:

```ts
type ProjectScreenState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'success'; projects: Project[] };
```

This is similar to Kotlin:

```kotlin
sealed interface ProjectScreenState {
    data object Loading : ProjectScreenState
    data class Error(val message: String) : ProjectScreenState
    data class Success(val projects: List<Project>) : ProjectScreenState
}
```

Loose coupling in TypeScript usually means:

- UI components do not call `fetch` directly
- API calls live in `src/lib/api` or feature API modules
- React Query hooks wrap server state
- components receive props instead of importing global data
- platform-specific behavior is behind a small adapter
- DTO types are separated from UI model types when the shapes differ

Common TypeScript mistake:

```tsx
function ProjectScreen() {
  useEffect(() => {
    fetch('/api/projects').then(...)
  }, []);
}
```

Better:

```ts
// lib/api/projects-api.ts
export function listProjects() {
  return apiRequest<ProjectResponse[]>('/api/projects');
}
```

```ts
// features/projects/project-queries.ts
export function useProjectsQuery() {
  return useQuery({
    queryKey: queryKeys.projects,
    queryFn: listProjects,
  });
}
```

```tsx
// screen
const projectsQuery = useProjectsQuery();
```

Interview angle:

Say that Kotlin/KMP gives stronger language and source-set enforcement, while TypeScript/React Native relies more on architectural discipline, folder boundaries, typed API adapters, custom hooks, and lint rules. The goal is the same: UI depends on stable abstractions, not on raw networking, storage, or platform details.

### Component prop types

#### Why does `ScreenProps` extend `ScrollViewProps`?

Code:

```ts
type ScreenProps = ScrollViewProps & {
  compact?: boolean;
};
```

`Screen` wraps a React Native `ScrollView`.

Inside `Screen`, we pass extra props to `ScrollView`:

```tsx
<ScrollView
  ...
  {...props}
>
```

So `Screen` should accept normal `ScrollView` props:

```tsx
<Screen keyboardShouldPersistTaps="handled" />
<Screen showsVerticalScrollIndicator={false} />
<Screen refreshControl={...} />
```

Because `Screen` forwards props to `ScrollView`, its props extend `ScrollViewProps`.

Pattern:

```ts
type AppButtonProps = PressableProps & {
  title: string;
};
```

because it wraps `Pressable`.

```ts
type AppTextProps = TextProps & {
  variant?: 'body' | 'title';
};
```

because it wraps `Text`.

```ts
type ScreenProps = ScrollViewProps & {
  compact?: boolean;
};
```

because it wraps `ScrollView`.

If you do not forward props, you do not need to extend the base props.

#### What is `PropsWithChildren`?

`PropsWithChildren` is a React TypeScript helper type for components that render nested content.

Example:

```tsx
import type { PropsWithChildren } from 'react';

export function AuthProvider({ children }: PropsWithChildren) {
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
```

This means:

```text
AuthProvider accepts a children prop.
```

Usage:

```tsx
<AuthProvider>
  <Stack />
</AuthProvider>
```

Here:

```tsx
<Stack />
```

is passed as `children`.

`PropsWithChildren` is roughly:

```ts
type PropsWithChildren<P = unknown> = P & {
  children?: React.ReactNode;
};
```

If there are no extra props:

```ts
PropsWithChildren
```

means:

```ts
{
  children?: React.ReactNode;
}
```

If there are extra props:

```tsx
type PanelProps = PropsWithChildren<{
  title: string;
}>;

export function Panel({ title, children }: PanelProps) {
  return (
    <View>
      <Text>{title}</Text>
      {children}
    </View>
  );
}
```

Usage:

```tsx
<Panel title="Projects">
  <ProjectList />
</Panel>
```

React passes:

```ts
{
  title: 'Projects',
  children: <ProjectList />
}
```

Kotlin comparison:

```kotlin
@Composable
fun AuthProvider(content: @Composable () -> Unit) {
    CompositionLocalProvider(...) {
        content()
    }
}
```

React's `children` is similar to Compose slot content.

Interview angle:

Say `PropsWithChildren` adds the standard React `children` prop to a component's props type. Use it for wrapper/provider/layout components that render nested JSX.

### `typeof`

#### Is `typeof` useful?

Yes.

At JavaScript runtime:

```ts
typeof "hello" // "string"
typeof 123 // "number"
```

In TypeScript type position:

```ts
typeof someValue
```

means:

```text
give me the type of this existing value
```

Example:

```ts
const config = {
  apiUrl: "https://api.example.com",
  retry: 3,
};

type Config = typeof config;
```

`Config` becomes:

```ts
{
  apiUrl: string;
  retry: number;
}
```

Useful because you avoid writing the same shape twice.

Common pattern:

```ts
const statuses = {
  todo: "To do",
  done: "Done",
};

type StatusKey = keyof typeof statuses;
```

`StatusKey` becomes:

```ts
"todo" | "done"
```

#### `typeof` with classes

Example:

```ts
class User {
  name = "";
}
```

`User` as a type means an instance:

```ts
const user: User = new User();
```

`typeof User` means the class constructor itself:

```ts
const UserClass: typeof User = User;
const user = new UserClass();
```

This matters in library typings like React Native.

### Intersection types

#### What does `A & B` mean?

`A & B` is an intersection type.

It means:

```text
the value must satisfy A and B
```

Example:

```ts
type HasName = {
  name: string;
};

type HasAge = {
  age: number;
};

type Person = HasName & HasAge;
```

Valid:

```ts
const person: Person = {
  name: "Jiaming",
  age: 30,
};
```

Invalid:

```ts
const person: Person = {
  name: "Jiaming",
};
```

because `age` is missing.

#### Why is `unknown & T` just `T`?

`unknown` is TypeScript's safe top type.

This:

```ts
unknown & { title: string }
```

means:

```text
a value that is unknown,
and also has title: string
```

But every value is assignable to `unknown`, so `unknown` adds no extra requirement.

So:

```ts
type A = unknown & { title: string };
```

behaves like:

```ts
type A = { title: string };
```

Identity rule:

```ts
unknown & T = T
```

This explains React's `PropsWithChildren` default:

```ts
type PropsWithChildren<P = unknown> = P & {
  children?: React.ReactNode;
};
```

If no generic type is passed:

```ts
PropsWithChildren
```

becomes:

```ts
unknown & {
  children?: React.ReactNode;
}
```

which simplifies to:

```ts
{
  children?: React.ReactNode;
}
```

If a prop type is passed:

```ts
PropsWithChildren<{
  title: string;
}>
```

becomes:

```ts
{
  title: string;
} & {
  children?: React.ReactNode;
}
```

which behaves like:

```ts
{
  title: string;
  children?: React.ReactNode;
}
```

Important contrast:

```ts
unknown | T = unknown
```

because a union means either side, and `unknown` already covers every possible value.

#### What about `any & T`?

`any & T` behaves like `any`.

Example:

```ts
type A = any & { title: string };
```

`A` behaves like:

```ts
any
```

So TypeScript stops protecting you:

```ts
const value: A = 123;

value.title.toUpperCase(); // compiles, may crash
value.notReal.deep.whatever(); // also compiles
```

`any` is not a normal safe top type. It means:

```text
turn off type checking here
```

So when `any` touches another type, it usually poisons the result:

```ts
any & T = any
any | T = any
```

Compare:

```ts
unknown & T = T
unknown | T = unknown
```

That is why `unknown` is safer than `any`.

`unknown` says:

```text
I do not know what this is, so prove it before using it.
```

`any` says:

```text
Do whatever; TypeScript will not check.
```

Interview angle:

Say `unknown` preserves type safety and combines predictably with intersections, while `any` disables checking and spreads unsafety through the type expression.

#### Why is it called intersection if it seems to merge properties?

Because TypeScript thinks in terms of sets of possible values, not sets of property names.

```ts
type HasName = { name: string };
```

means:

```text
all objects that have at least name: string
```

It does not mean:

```text
objects that only have name
```

This object is valid for `HasName`:

```ts
{ name: "Jiaming" }
```

This object is also valid for `HasName`:

```ts
{ name: "Jiaming", age: 30 }
```

because extra fields are allowed.

So:

```ts
type HasName = { name: string };
type HasAge = { age: number };
type Person = HasName & HasAge;
```

means:

```text
all objects that are valid for both HasName and HasAge
```

That requires:

```ts
{
  name: string;
  age: number;
}
```

#### Example with disjoint primitive unions

```ts
type A = 1 | 2;
type B = 3 | 4;
type C = A & B;
```

`C` becomes:

```ts
never
```

because no value is both `1 | 2` and `3 | 4`.

#### Example with object types

```ts
type HasName = { name: string; age: string };
type HasAge = { name1: string; age1: string };
type Combine = HasName & HasAge;
```

`Combine` requires all four fields:

```ts
const ok: Combine = {
  name: "a",
  age: "b",
  name1: "c",
  age1: "d",
};
```

This is invalid:

```ts
const bad: Combine = {
  name: "a",
  age1: "d",
};
```

because it is missing:

```text
age
name1
```

#### Why your circle intuition felt wrong

You imagined:

```text
Circle A has properties name + age
Circle B has properties name1 + age1
Intersection should not contain all of A and B
```

But TypeScript's circles are not circles of properties.

They are circles of valid values.

Circle A:

```text
all objects with at least name and age
```

Circle B:

```text
all objects with at least name1 and age1
```

Intersection:

```text
all objects with at least name, age, name1, and age1
```

So for object types, `&` often feels like merging required properties.

### React Native library type example

#### What does this mean?

```ts
declare class ScrollViewComponent extends React.Component<ScrollViewProps> {}

export declare const ScrollViewBase: Constructor<ScrollResponderMixin> &
  typeof ScrollViewComponent;

export class ScrollView extends ScrollViewBase {}
```

Breakdown:

```ts
declare class ScrollViewComponent extends React.Component<ScrollViewProps> {}
```

This says `ScrollViewComponent` is a React component class that accepts `ScrollViewProps`.

```ts
typeof ScrollViewComponent
```

means the type of the class constructor itself.

```ts
Constructor<ScrollResponderMixin>
```

means a constructor whose instances include `ScrollResponderMixin` behavior.

```ts
&
```

means both.

So:

```ts
Constructor<ScrollResponderMixin> & typeof ScrollViewComponent
```

means:

```text
ScrollViewBase is both a React component constructor and a constructor with scroll responder mixin behavior
```

This is library-level typing. In normal app code, you usually do not write types this complex.

## React State, Hooks, and App State

This category covers `useState`, React hooks, Context API, React Query, local UI state, server state, and why we are not adding Redux/Zustand yet.

### Local component state

Local component state is state that belongs to one screen or component and does not need to be shared globally.

In this project, examples include:

- text typed into create/edit forms
- selected status or priority in the task edit screen
- whether a draft preview is visible
- whether search matches are hidden or shown

Example:

```tsx
const [title, setTitle] = useState('');
const [draftSaved, setDraftSaved] = useState(false);
```

Use local state when:

- the state is temporary
- the state only matters to one screen/component
- the state does not need backend persistence yet

Do not put form fields into Context or React Query unless there is a real shared-state reason.

### Effect cleanup and async guards

#### Why use a `cancelled` flag inside `useEffect`?

Example:

```tsx
useEffect(() => {
  let cancelled = false;

  async function restoreSession() {
    const storedSession = await getStoredAuthSession();

    if (cancelled) {
      return;
    }

    setSession(storedSession);
    setStatus(storedSession ? 'authenticated' : 'unauthenticated');
  }

  restoreSession();

  return () => {
    cancelled = true;
  };
}, []);
```

The empty dependency array means:

```text
run this effect once after the component first renders
```

In `AuthProvider`, this restores a saved session from storage when the app starts.

The storage read is async:

```ts
const storedSession = await getStoredAuthSession();
```

After `await`, time has passed. The component may have unmounted.

The cleanup function:

```ts
return () => {
  cancelled = true;
};
```

runs when the component unmounts.

Then this guard:

```ts
if (cancelled) {
  return;
}
```

prevents old async work from updating state after the component lifecycle has ended.

Without the guard, this can happen:

```text
component mounts
async restore starts
component unmounts
async restore finishes
old async work calls setState
```

The user may not see the update because the component is gone, but the update is still stale work. It can also cause lifecycle warnings in some React versions and race bugs in more complex flows.

Example race:

```text
AuthProvider instance A mounts
A starts restoreSession
A unmounts
AuthProvider instance B mounts
B starts restoreSession
A finishes late
```

The `cancelled` flag means only the still-current mounted effect can apply its result.

Important:

```text
This does not cancel getStoredAuthSession itself.
It only ignores the result if the component has already unmounted.
```

For cancellable APIs like `fetch`, `AbortController` can actually cancel the request. For storage reads, a boolean guard is a simple lifecycle safety pattern.

Kotlin comparison:

```kotlin
val job = launch {
    val session = repository.getStoredSession()
    state.value = session
}

onCleared {
    job.cancel()
}
```

Even if the result would not be visible after the screen is gone, stale lifecycle work should not update old state.

Interview angle:

Say the cleanup guard prevents stale async results from applying after unmount. It is about lifecycle correctness and avoiding race bugs, not just visible UI output.

### Callback dependencies

#### Why does `useCallback` include a function like `signInWithSession` in the dependency array?

Example:

```tsx
const signInWithLocalPreview = useCallback(async () => {
  await signInWithSession({
    accessToken: 'local-preview-access-token',
    refreshToken: 'local-preview-refresh-token',
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(),
    user: {
      id: 'local-preview-user',
      email: 'jiaming@example.com',
      name: 'Jiaming',
    },
  });
}, [signInWithSession]);
```

The second argument:

```ts
[signInWithSession]
```

is not a key. It is the dependency array.

It means:

```text
Keep the same signInWithLocalPreview function between renders
unless signInWithSession changes.
```

`signInWithLocalPreview` uses `signInWithSession` from the outer scope:

```ts
await signInWithSession(...);
```

So React hook rules expect that value to be listed as a dependency.

In the current code, `signInWithSession` is also created with `useCallback`:

```ts
const signInWithSession = useCallback(async (nextSession: AuthSession) => {
  await setStoredAuthSession(nextSession);
  setSession(nextSession);
  setStatus('authenticated');
}, []);
```

Because its dependency array is empty:

```ts
[]
```

`signInWithSession` is stable for the lifetime of the mounted provider.

So practically:

```text
signInWithSession probably will not change during the same mount.
```

But it is still correct to include it as a dependency because the implementation may change later.

Example future change:

```ts
const signInWithSession = useCallback(async (nextSession: AuthSession) => {
  analytics.track('sign_in', { userId: nextSession.user.id });
  await setStoredAuthSession(nextSession);
  setSession(nextSession);
  setStatus('authenticated');
}, [analytics]);
```

Now `signInWithSession` changes if `analytics` changes. Because `signInWithLocalPreview` depends on it, `signInWithLocalPreview` should also be recreated.

If the dependency is omitted, ESLint's React hooks rule may warn:

```text
React Hook useCallback has a missing dependency: 'signInWithSession'
```

Kotlin comparison:

```kotlin
val signInWithLocalPreview = {
    signInWithSession(...)
}
```

The lambda captures `signInWithSession` from outside. If that outside value changes, the lambda should use the current value, not an old captured one.

Interview angle:

Say `useCallback` dependencies are the outside values captured by the callback. Even if a dependency is currently stable, listing it keeps the callback correct if the implementation changes and satisfies React hook lint rules.

### Memoized context values

#### Why use `useMemo` for a React Context value?

Example:

```tsx
const value = useMemo(
  () => ({
    session,
    signInWithLocalPreview,
    signInWithSession,
    signOut,
    status,
  }),
  [session, signInWithLocalPreview, signInWithSession, signOut, status]
);

return <AuthContext value={value}>{children}</AuthContext>;
```

`useMemo` keeps the same object reference between renders unless one of the dependencies changes.

Without `useMemo`, this creates a new object on every render:

```tsx
const value = {
  session,
  signInWithLocalPreview,
  signInWithSession,
  signOut,
  status,
};
```

Even if every field has the same value, the object itself is new:

```ts
{} === {}; // false
```

React Context compares the provider `value` by reference. If the provider receives a new object every render, context consumers may re-render even when auth state did not meaningfully change.

`useMemo` means:

```text
Reuse the same context value object
unless session, callbacks, or status changes.
```

Why all dependencies are listed:

```ts
[session, signInWithLocalPreview, signInWithSession, signOut, status]
```

Because the memoized object uses all of those values. If any one changes, the context value should be rebuilt so consumers receive the latest value.

Kotlin comparison:

Think of exposing a stable immutable UI state object:

```kotlin
data class AuthState(
    val session: AuthSession?,
    val status: AuthStatus
)
```

You only want to emit a new state object when one of its fields actually changes.

Interview angle:

Say `useMemo` prevents recreating the context value object on every render, which helps avoid unnecessary context consumer re-renders. The dependency array lists the fields that should cause a new context value.

#### Why not use `useMemo` for every derived value?

Example:

```ts
const projects = projectsQuery.data ?? [];
const tasks = tasksQuery.data ?? [];
const completedTasks = tasks.filter((task) => task.status === 'done').length;
const activeTasks = tasks.filter((task) => task.status === 'in_progress').length;
const blockedTasks = tasks.filter((task) => task.status === 'blocked').length;
const highlightedTasks = tasks.slice(0, 3);
const isRefreshing = projectsQuery.isRefetching || tasksQuery.isRefetching;
```

These values do not need `useMemo` because:

- the arrays are small right now
- `filter` and `slice` are simple calculations
- the values are only used inside the current render
- memoization has its own overhead
- adding `useMemo` everywhere makes the code noisier

Plain render-time derived values are normal React style.

`useMemo` is useful when:

```text
the calculation is expensive,
or the result reference must stay stable for child memoization/context,
or a dependency-created object/array would cause unnecessary effects or renders.
```

The auth context value is different:

```tsx
const value = useMemo(() => ({ session, status, signOut }), [session, status, signOut]);

return <AuthContext value={value}>{children}</AuthContext>;
```

There, `useMemo` matters because the object is passed into Context. Context consumers may re-render when the value reference changes.

For local derived values:

```ts
const completedTasks = tasks.filter((task) => task.status === 'done').length;
```

this is clearer than:

```ts
const completedTasks = useMemo(
  () => tasks.filter((task) => task.status === 'done').length,
  [tasks]
);
```

Kotlin comparison:

```kotlin
val completedTasks = tasks.count { it.status == DONE }
```

You normally compute this directly unless the list is large or the calculation is expensive.

Key rule:

```text
Do not use useMemo by default.
Use it when there is a measured or obvious reason.
```

Interview angle:

Say `useMemo` is a performance/reference-stability tool, not a default wrapper for every calculation. Cheap local derived values should stay simple.

### State management and data fetching

#### Which state management and network query tool will we use?

For this project:

```text
React Query / TanStack Query
```

for server state.

```text
Context API
```

for app-level client state.

```text
useState
```

for local screen/component state.

```text
expo-secure-store
```

for sensitive token persistence.

#### What is React Query?

React Query, now TanStack Query, manages server state.

Server state means data that lives outside the app:

```http
GET /projects
GET /tasks
POST /tasks
PATCH /tasks/{id}
DELETE /tasks/{id}
```

Without React Query, you often write:

```tsx
const [tasks, setTasks] = useState([]);
const [isLoading, setIsLoading] = useState(false);
const [error, setError] = useState(null);

useEffect(() => {
  setIsLoading(true);

  fetch('/tasks')
    .then((res) => res.json())
    .then(setTasks)
    .catch(setError)
    .finally(() => setIsLoading(false));
}, []);
```

With React Query:

```tsx
const tasksQuery = useQuery({
  queryKey: ['tasks'],
  queryFn: fetchTasks,
});
```

It gives:

```ts
tasksQuery.data
tasksQuery.isLoading
tasksQuery.error
tasksQuery.refetch
```

It handles:

- loading state
- error state
- caching
- retries
- refetching
- deduplication
- mutation lifecycle
- invalidating stale data
- optimistic updates

Create task example:

```tsx
const createTaskMutation = useMutation({
  mutationFn: createTask,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['tasks'] });
  },
});
```

Meaning:

```text
after creating a task, mark the task list stale and refetch it
```

#### What is `queryKeys` in React Query?

This object is a central list of React Query cache keys:

```ts
export const queryKeys = {
  projects: ['projects'] as const,
  project: (projectId: string) => ['projects', projectId] as const,
  tasksRoot: ['tasks'] as const,
  tasks: (filters?: Record<string, string | undefined>) => ['tasks', filters ?? 'all'] as const,
  task: (taskId: string) => ['tasks', 'detail', taskId] as const,
};
```

React Query identifies cached data by `queryKey`.

Examples:

```ts
queryKeys.projects;
// ['projects']

queryKeys.project('project-1');
// ['projects', 'project-1']

queryKeys.tasks();
// ['tasks', 'all']

queryKeys.tasks({ status: 'done' });
// ['tasks', { status: 'done' }]

queryKeys.task('task-1');
// ['tasks', 'detail', 'task-1']
```

Using helper functions avoids typo bugs and keeps caching/invalidation consistent:

```ts
useQuery({
  queryKey: queryKeys.project(projectId),
  queryFn: () => getProject(projectId),
});

queryClient.invalidateQueries({
  queryKey: queryKeys.projects,
});
```

This is safer than manually repeating arrays everywhere:

```ts
['project']; // wrong
['projects']; // correct
```

#### Why can `queryKeys` use `const`?

This line:

```ts
export const queryKeys = { ... };
```

means the `queryKeys` variable cannot be reassigned:

```ts
queryKeys = {}; // error
```

That is useful because `queryKeys` is a fixed helper object.

Important distinction:

```ts
const user = { name: 'A' };
user.name = 'B'; // allowed

user = { name: 'C' }; // error
```

`const` protects the variable binding. It does not automatically make the whole object deeply immutable.

The arrays use a different TypeScript feature:

```ts
projects: ['projects'] as const
```

Without `as const`, TypeScript may infer:

```ts
string[]
```

With `as const`, TypeScript infers an exact readonly tuple:

```ts
readonly ['projects']
```

For a dynamic key:

```ts
project: (projectId: string) => ['projects', projectId] as const
```

TypeScript understands the result as:

```ts
readonly ['projects', string]
```

Functions can be stored inside a `const` object because functions are JavaScript values:

```ts
const tools = {
  sayHi: () => 'hi',
};
```

Interview angle:

Say `queryKeys` is a typed cache-key factory. `const` prevents replacing the helper object, while `as const` gives React Query precise readonly tuple keys for better type safety and consistent cache invalidation.

#### How is `queryKey` useful in TanStack Query?

`queryKey` gives every server-data request a stable identity.

React Query uses it to answer:

```text
What data is this?
Should cached data be reused?
Should this request be refetched?
Which cached data should be invalidated after a mutation?
```

Example:

```ts
useQuery({
  queryKey: ['projects'],
  queryFn: listProjects,
});
```

This means:

```text
Cache the result of listProjects under ['projects'].
```

If another screen uses the same key:

```ts
useQuery({
  queryKey: ['projects'],
  queryFn: listProjects,
});
```

React Query knows this is the same data and can reuse the cached result instead of fetching blindly again.

For detail data:

```ts
useQuery({
  queryKey: ['projects', projectId],
  queryFn: () => getProject(projectId),
});
```

These are separate cache entries:

```ts
['projects', 'project-1']
['projects', 'project-2']
```

For filtered data:

```ts
useQuery({
  queryKey: ['tasks', { status: 'done' }],
  queryFn: () => listTasks({ status: 'done' }),
});
```

This is different from:

```ts
['tasks', { status: 'todo' }]
```

So each filter result can be cached separately.

`queryKey` is also used for invalidation. After creating a project:

```ts
queryClient.invalidateQueries({
  queryKey: ['projects'],
});
```

This tells React Query:

```text
The projects list may be stale. Refetch it.
```

In this project, keys are centralized:

```ts
export const queryKeys = {
  projects: ['projects'] as const,
  project: (projectId: string) => ['projects', projectId] as const,
};
```

Then code uses:

```ts
queryKey: queryKeys.projects
```

and:

```ts
queryClient.invalidateQueries({
  queryKey: queryKeys.projects,
});
```

That avoids typo bugs.

Interview angle:

Say `queryKey` is the cache identity and `queryFn` is how to fetch the data. `invalidateQueries(queryKey)` marks matching cached data as stale so React Query knows what to refetch after a mutation.

#### Are we using Redux or Zustand?

Not now.

The JD mentions:

```text
State management libraries such as Redux, MobX, or similar
```

But the actual technology stack says:

```text
React Query, Context API
```

So this project uses:

```text
React Query = backend/server state
Context API = auth/theme/app-wide client state
useState = local UI/form state
SecureStore = persisted sensitive tokens
```

Redux/Zustand/MobX would be useful for complex client-only state, such as:

- offline action queue
- undo/redo history
- complex drag/drop board state
- collaborative editing state
- large client workflow builder

Adding Redux/Zustand now would add architecture weight without solving a real problem.

Better interview explanation:

```text
This app separates server state from client state. API-owned data is managed by React Query. Auth/theme are managed by Context API. If client-only workflow state becomes complex, Redux/Zustand would be considered.
```

## Authentication and Security

This category covers Phase 2 auth, SecureStore, fail-closed behavior, local preview auth, and public environment variables.

### What is Phase 2 auth doing?

Phase 2 adds:

- auth types
- auth context
- secure session storage
- route protection
- sign-in route
- Google OAuth shell
- sign-out

### Why use SecureStore?

Auth tokens are sensitive.

Do not store tokens in AsyncStorage.

Use:

```ts
expo-secure-store
```

In this project:

```ts
setStoredAuthSession(session)
getStoredAuthSession()
clearStoredAuthSession()
```

wrap SecureStore.

### Why fail closed?

For auth, we should not guess.

If required fields are missing:

```ts
accessToken
refreshToken
expiresAt
user.id
user.email
user.name
```

we reject the session instead of pretending the user is logged in.

This avoids corrupted auth state.

### Why local preview sign-in?

Real Firebase Google login needs:

```bash
EXPO_PUBLIC_API_URL
EXPO_PUBLIC_FIREBASE_API_KEY
EXPO_PUBLIC_FIREBASE_APP_ID
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
EXPO_PUBLIC_FIREBASE_PROJECT_ID
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET
EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID
```

and a real Spring Boot Firebase verification setup.

Until those exist, local preview sign-in lets us keep developing protected app screens while clearly marking that it is not real auth.

### Environment variables

#### What env vars are needed for Firebase Google login?

`.env.example` contains:

```bash
EXPO_PUBLIC_API_URL=https://api.example.com
EXPO_PUBLIC_FIREBASE_API_KEY=your-firebase-api-key
EXPO_PUBLIC_FIREBASE_APP_ID=your-firebase-app-id
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your-firebase-project-id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID=your-web-client-id.apps.googleusercontent.com
EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID=your-ios-client-id.apps.googleusercontent.com
EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID=your-android-client-id.apps.googleusercontent.com
```

Only variables prefixed with:

```text
EXPO_PUBLIC_
```

are available in the client app.

Never put secrets in `EXPO_PUBLIC_` variables.

Firebase web/mobile client IDs and public Firebase config can be in the app.

Firebase service account JSON must not be embedded in the app.

Spring Boot should read the service account from:

```bash
FIREBASE_SERVICE_ACCOUNT_PATH
```

or:

```bash
FIREBASE_SERVICE_ACCOUNT_JSON
```

#### Should Google OAuth start directly in the client, like Firebase?

Yes, the login UI starts on the client.

In a React Native app, the user taps:

```tsx
<ActionButton label="Continue with Google" onPress={handleGoogleSignIn} />
```

Then the app opens the Google login screen:

```ts
const result = await promptAsync();
```

That part is client-side because the user must interact with Google on their own device.

The key question is what the app does after Google returns a successful result.

There are two common architectures.

Option 1: App uses Google OAuth directly, backend owns app session.

Flow:

```text
React Native app
-> opens Google login
-> receives authorization code
-> sends code to Spring Boot
-> Spring Boot verifies/exchanges with Google
-> Spring Boot creates/fetches user
-> Spring Boot returns TaskTracker access token/session
```

Earlier, our code was shaped for this direct Google-code exchange:

```ts
const session = await exchangeGoogleCodeForSession({
  code,
  codeVerifier: request.codeVerifier,
  redirectUri,
});
```

Why backend still matters:

- the backend owns TaskTracker users
- the backend owns projects/tasks data
- the backend decides whether this Google account maps to an app user
- the backend returns the app's own auth session
- client secrets must not be embedded in the mobile app

Option 2: App uses Firebase Auth, backend verifies Firebase token.

Flow:

```text
React Native app
-> Firebase Google sign-in
-> Firebase returns Firebase ID token
-> app sends Firebase ID token to Spring Boot
-> Spring Boot verifies token with Firebase Admin SDK
-> Spring Boot creates/fetches user
-> Spring Boot returns app session or accepts Firebase identity directly
```

This is also valid, especially if the product already uses Firebase Auth.

The difference:

```text
Google OAuth direct:
backend verifies Google identity / exchanges code

Firebase Auth:
Firebase handles provider login, backend verifies Firebase ID token
```

For this project, since the backend is Spring Boot and stores the app data, the client should start the login, but the backend should still verify identity and issue/accept the app session.

Current TaskTracker decision:

```text
Use Firebase Auth for login.
Use Spring Boot Firebase Admin to verify Firebase ID tokens.
Use the verified Firebase uid as the backend owner/user id.
```

Current client flow:

```text
Expo app
-> Google login through Firebase Auth
-> Firebase returns Firebase ID token
-> app stores a session in SecureStore
-> React Query sends Authorization: Bearer <Firebase ID token>
-> Spring Boot verifies token before project/task CRUD
```

Current backend contract:

```http
POST /auth/firebase
Authorization: Bearer <Firebase ID token> for /api/**
```

Interview angle:

Say that Firebase handles identity-provider login, but the backend still verifies the Firebase ID token because all project/task data is server-owned. The mobile app should never be trusted just because it says a user is logged in.

#### Is Firebase login in the server still needed?

Yes, if the mobile app uses Firebase Auth and the Spring Boot backend owns project/task data.

The server does not need to show a Google login screen. Login starts in the Expo app. But the server still needs Firebase Admin verification so it can prove that an incoming request belongs to a real Firebase user.

Current flow:

```text
Expo app signs in with Firebase
-> app receives Firebase ID token
-> app sends token to Spring Boot
-> Spring Boot verifies token with Firebase Admin
-> backend uses verified uid as the owner id for projects/tasks
```

Why this matters:

- the client is not trusted just because it says a user is logged in
- protected endpoints need a server-verified user id
- project/task rows must be scoped to that verified user id
- Firebase service account credentials stay on the server, never in the app

The server-side Firebase code would only become unnecessary if the backend stopped owning protected data, or if the app switched to a different backend auth model such as backend-issued JWTs after a direct Google OAuth code exchange.

#### Is `AuthController` needed, and what is the auth flow?

In the current code, yes, `AuthController` is needed because the sign-in screen calls:

```ts
exchangeFirebaseTokenForSession({ idToken: firebaseIdToken })
```

which sends:

```http
POST /auth/firebase
```

Current flow:

```text
1. User taps Continue with Google in the Expo app.
2. Expo AuthSession gets a Google ID token.
3. Firebase signs in with that Google credential.
4. Firebase returns a Firebase ID token.
5. The app sends the Firebase ID token to Spring Boot at POST /auth/firebase.
6. AuthController verifies the token with FirebaseTokenVerifier.
7. AuthController returns an AuthSessionResponse for local app session storage.
8. Later project/task API calls send Authorization: Bearer <Firebase ID token>.
9. FirebaseAuthFilter verifies the bearer token on /api/** routes.
10. Controllers read the verified user with request.authenticatedUser().
```

Important distinction:

```text
AuthController = sign-in/bootstrap endpoint
FirebaseAuthFilter = protects project/task API calls
```

`AuthController` is thin right now because it returns the same Firebase ID token as `accessToken` and empty `refreshToken` / `expiresAt`. That is acceptable for a learning slice, but in a production backend there are two cleaner options:

- keep `/auth/firebase`, but make it issue a real backend session/JWT
- remove `/auth/firebase` and let the client use Firebase ID tokens directly for API calls, with `FirebaseAuthFilter` doing all server verification

For this project's current code, removing `AuthController` would break real sign-in unless the client sign-in flow is changed at the same time.

#### Why does the server call `upsertUser` before CRUD operations?

The backend uses the verified Firebase uid as the local owner id.

The database has this relationship:

```text
tasktracker_users.id
-> projects.owner_id
-> tasks.owner_id
```

So before the backend creates or reads owner-scoped project/task data, it makes sure the verified user exists in `tasktracker_users`.

Current code:

```kotlin
userRepository.upsertUser(user)
```

means:

```text
insert the user if this is their first request
otherwise update email/displayName/avatarUrl from the latest Firebase token
```

Why it is useful:

- first API request can create the local user row automatically
- project/task foreign keys have a valid parent user
- profile fields stay reasonably fresh
- services can scope all data by `user.remoteUserId`

Why it happens on reads too:

The user might sign in and immediately call `GET /api/projects` before creating anything. Calling `upsertUser` there creates the local user profile even if they have no projects yet.

Tradeoff:

Calling it in every service method is simple and reliable, but repetitive. Later, a cleaner design could move this to one composition point after token verification, such as an auth/session service or request filter that ensures the local user row once per request.

Interview angle:

Say this is a pragmatic "just-in-time user provisioning" pattern. Firebase owns identity, but the app database still needs a local user row for ownership, foreign keys, and user-scoped queries.

#### Why use `Boolean(...)` instead of relying on truthy values?

Short answer:

Python and JavaScript/TypeScript both allow truthy and falsy values in `if` statements, but JavaScript's `&&` operator returns the actual evaluated value, not always a boolean. `Boolean(...)` converts the result into an explicit `true` or `false`.

Detailed explanation:

In Python, this works:

```python
if api_url and google_web_client_id:
    print("configured")
```

JavaScript/TypeScript can also do truthy checks:

```ts
if (apiUrl && googleWebClientId) {
  console.log('configured');
}
```

But this expression:

```ts
const isGoogleConfigured = apiUrl && googleWebClientId && isFirebaseConfigured();
```

does not necessarily produce a boolean. It can return:

- `undefined` if `apiUrl` is missing
- an empty string if one value is an empty string
- the `googleWebClientId` string in some shorter expressions
- the final boolean from `isFirebaseConfigured()` when earlier values are truthy

So in React or TypeScript code, this is cleaner:

```ts
const isGoogleConfigured = Boolean(apiUrl && googleWebClientId && isFirebaseConfigured());
```

Now `isGoogleConfigured` is always exactly `true` or `false`.

Equivalent style:

```ts
const isGoogleConfigured = !!apiUrl && !!googleWebClientId && isFirebaseConfigured();
```

Common mistake to avoid:

Do not assume `&&` always returns a boolean in JavaScript. It returns the first falsy value or the last truthy value.

Interview angle:

Say that truthy checks are useful, but when a value is used as a named boolean state or passed into UI logic, converting it to a real boolean improves readability and type safety.

#### What does `<Redirect href="/" />` mean in Expo Router?

Short answer:

`<Redirect href="/" />` sends the user to the root route. In the sign-in screen, it prevents an already authenticated user from seeing the login page again.

Detailed explanation:

Example from the sign-in screen:

```tsx
if (status === 'authenticated') {
  return <Redirect href="/" />;
}
```

This means:

```text
If the user is already signed in, do not render the sign-in UI.
Redirect them to the main app route instead.
```

In Expo Router, `/` means the app's root route. The exact screen the user sees depends on the route layout. In this project, `/` resolves into the authenticated app area when the auth state is valid.

Why use `Redirect`:

This is a render-time route guard. The screen itself declares that authenticated users do not belong on the sign-in page.

It avoids rendering the wrong UI briefly and avoids writing an effect like this for a simple guard:

```tsx
useEffect(() => {
  if (status === 'authenticated') {
    router.replace('/');
  }
}, [status]);
```

The matching protected-route pattern is:

```tsx
if (status === 'unauthenticated') {
  return <Redirect href="/sign-in" />;
}
```

Common mistake to avoid:

Do not let authenticated users stay on the login screen after session restore. It creates confusing navigation and can make users think they are signed out.

Interview angle:

Say that Expo Router route protection can be expressed declaratively. Auth-only screens redirect signed-in users away, and app-only screens redirect signed-out users to login.

#### Why does the SSH client keep the private key?

Short answer:

In SSH key login, the private key is the client's proof of identity. The server only needs the matching public key to verify that proof.

Detailed explanation:

The normal SSH key model is:

```text
Client device:
  private key stays secret on the client
  public key can be shared

Server:
  stores allowed public keys in ~/.ssh/authorized_keys
```

During login:

```text
1. Client asks to log in as a server user.
2. Server checks that user's ~/.ssh/authorized_keys.
3. Server sends a challenge.
4. Client signs the challenge with its private key.
5. Server verifies the signature with the public key.
6. If the signature is valid, login succeeds.
```

The private key does not need to leave the client. The server can verify ownership of the private key using only the public key.

Why not store the private key on the server:

If the server stored every client's private key, a server compromise would leak all client identities. Attackers could impersonate those clients elsewhere. Keeping private keys on clients limits the blast radius.

This is similar to digital signing:

```text
Signer has private key.
Verifier has public key.
Signer signs a message.
Verifier checks the signature.
```

SSH authentication is also a signing challenge:

```text
Client signs a login challenge.
Server verifies the signature.
```

Common mistake to avoid:

Do not copy one private key everywhere by default. Prefer one key per device or environment, such as laptop, phone, and GitHub Actions. Add each public key to the server's `authorized_keys`. That makes it easier to revoke one device without replacing every key.

Interview angle:

Say that SSH key authentication uses asymmetric cryptography. The private key stays with the actor proving identity, while the server stores public keys as an allowlist.

#### Why can the root stack use `(app)` but needs `(auth)/sign-in`?

Short answer:

`(app)` has its own `_layout.tsx`, so it is a nested navigator route. `(auth)` does not have `_layout.tsx`, so it is only a grouping folder and the actual screen is `(auth)/sign-in`.

Detailed explanation:

Current route files:

```text
src/app/(app)/_layout.tsx
src/app/(app)/index.tsx
src/app/(auth)/sign-in.tsx
```

Expo Router sees:

```text
(app)              -> route group with its own layout/navigator
(auth)/sign-in    -> screen inside the auth group
```

This works:

```tsx
<Stack.Screen name="(app)" />
```

because this file exists:

```text
src/app/(app)/_layout.tsx
```

That layout makes `(app)` a nested route entry.

This does not work:

```tsx
<Stack.Screen name="(auth)" />
```

because this file does not exist:

```text
src/app/(auth)/_layout.tsx
```

Without an auth layout, `(auth)` is only a route group folder. The real route is:

```tsx
<Stack.Screen name="(auth)/sign-in" />
```

If we want `(auth)` to behave like `(app)`, add:

```text
src/app/(auth)/_layout.tsx
```

Example:

```tsx
import { Stack } from 'expo-router/stack';

export default function AuthLayout() {
  return <Stack screenOptions={{ headerShown: false }} />;
}
```

Then the root stack can reference:

```tsx
<Stack.Screen name="(auth)" />
```

Common mistake to avoid:

Do not assume a route group folder is a route by itself. It becomes a route entry only when it has a layout or an actual screen path referenced by the stack.

Interview angle:

Say that Expo Router route groups organize routes without adding URL segments. A group with `_layout.tsx` acts as a nested navigator; a group without `_layout.tsx` only contains screens.

#### Why use `useRef` instead of `useState` to remember a handled OAuth response?

Short answer:

`useRef` stores a mutable value across renders without causing another render. It is useful for internal bookkeeping that should not affect the UI.

Detailed explanation:

In the Google sign-in flow, the auth response can remain available while the component re-renders. Without a guard, the effect could handle the same OAuth response more than once:

```text
OAuth response arrives
-> effect runs
-> Firebase sign-in starts
-> component re-renders
-> same response is still present
-> effect could run again
```

So the code remembers the response that has already been handled:

```tsx
const handledResponseUrlRef = useRef<string | null>(null);
```

Then the effect checks it:

```tsx
if (handledResponseUrlRef.current === responseUrl) {
  return;
}

handledResponseUrlRef.current = responseUrl;
void completeGoogleSignIn(response.params.id_token);
```

Why not `useState`:

```tsx
setHandledResponseUrl(responseUrl);
```

State is for values that affect rendering. Updating state triggers another render. In this case, the value is only an internal "already handled" marker, so re-rendering is unnecessary and can create more effect churn.

Key difference:

```text
useState:
  persists across renders
  updates trigger re-render
  use for UI state

useRef:
  persists across renders
  updates do not trigger re-render
  use for mutable instance values, timers, DOM/native refs, and effect guards
```

Common mistake to avoid:

Do not use `useRef` for values that the UI should react to. If changing a value should change what the user sees, use `useState`.

Interview angle:

Say that `useRef` is useful for storing mutable, non-visual state. In this auth flow, it prevents duplicate side effects without causing an extra render.

## Future Questions Template

Use this template when adding a new question later.

````md
#### Question title?

Short answer first.

Detailed explanation:

- What the concept means.
- Why it matters in React Native or TypeScript.
- When to use it.
- Common mistake to avoid.

Example:

```tsx
// Add a small example when the explanation is abstract.
```

Interview angle:

Explain how you used or would use this concept in TaskTracker.
````

Suggested categories for future questions:

- React Native and JSX
- Expo Router and Navigation
- React State, Hooks, and App State
- TypeScript
- State Management and Data Fetching
- Authentication and Security
- Tooling and Environment
