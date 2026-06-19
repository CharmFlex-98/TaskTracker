# Expo HAS CHANGED

Read the exact versioned docs at https://docs.expo.dev/versions/v56.0.0/ before writing any code.

# Learning Notes

Only append question-and-answer notes to `revision.md` when the user explicitly asks to save or append the note.

When project implementation progress changes, update `progress.md`.

Keep `revision.md` interview-focused, and include examples when they make the explanation clearer.

# React Native Architecture

Use pragmatic loose coupling for feature work:

- Screens should not call vendor SDKs, `fetch`, SecureStore, or platform APIs directly.
- Screens should call feature hooks or small action handlers.
- Hooks may coordinate React state, navigation, Context, React Query, and service calls.
- Service/API modules contain vendor or transport details such as Firebase, REST, SecureStore, or platform adapters.
- If a vendor may realistically change, expose a small service/repository contract and select the implementation from one composition point.
- Do not copy Kotlin/KMP layering mechanically; add interfaces only when they reduce real coupling or improve testability.
- Keep dependency direction one way: screen -> hook/query -> service/API -> vendor/platform.
