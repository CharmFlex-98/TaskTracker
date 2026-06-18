# TaskTracker Server

Spring Boot backend for the TaskTracker mobile app.

This backend follows the setup style from `~/IDEAProject/flexiexpensesmanager`:

- Kotlin
- Gradle Kotlin DSL
- Spring Boot
- Java 17 toolchain
- package-by-feature source layout
- `application.properties` with optional `.env.properties`
- custom exception base and global exception handler

## Stack

- Kotlin 1.9.25
- Spring Boot 3.5.6
- Java 17
- Spring Web
- Spring Validation
- Spring JDBC
- Flyway
- PostgreSQL runtime driver
- Firebase Admin SDK

## Run

With Docker Compose:

```bash
cd server
docker compose up -d
```

The Compose setup starts PostgreSQL and the published Spring Boot server image. Flyway runs the migrations when the server starts.

Without Docker:

```bash
cd server
./gradlew bootRun
```

For PostgreSQL, set:

```bash
export TASKTRACKER_DB_URL=jdbc:postgresql://localhost:5432/tasktracker
export TASKTRACKER_DB_USERNAME=tasktracker
export TASKTRACKER_DB_PASSWORD=tasktracker
```

For Firebase verification, set one of these:

```bash
export FIREBASE_SERVICE_ACCOUNT_PATH=/absolute/path/to/firebase-service-account.json
```

or:

```bash
export FIREBASE_SERVICE_ACCOUNT_JSON='{"type":"service_account",...}'
```

## Verify

```bash
curl http://localhost:3000/api/health
```

## Current API Entry Points

- `GET /api/health`
- `POST /auth/firebase`
- `GET /api/projects`
- `GET /api/projects/{projectId}`
- `POST /api/projects`
- `PUT /api/projects/{projectId}`
- `DELETE /api/projects/{projectId}`
- `GET /api/tasks`
- `GET /api/tasks/{taskId}`
- `POST /api/tasks`
- `PUT /api/tasks/{taskId}`
- `DELETE /api/tasks/{taskId}`

All `/api/**` routes except `/api/health` require:

```http
Authorization: Bearer <Firebase ID token>
```
