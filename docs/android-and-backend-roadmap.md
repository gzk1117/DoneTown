# DoneTown Android and Backend Roadmap

## Phase 1: Android installable shell

The current React/Vite app is wrapped with Capacitor so the same UI can run as a native Android app.

Useful commands:

```bash
npm run build
npm run android:sync
npm run android:open
```

`android:sync` rebuilds the web app and copies the latest assets into the native Android project.
`android:open` opens the generated Android project in Android Studio.

Local machine requirements for APK/AAB builds:

- Android Studio
- JDK
- Android SDK with a configured emulator or connected Android device

## Phase 2: Backend service

Recommended stack for the first real backend:

- Node.js + Express or Fastify
- PostgreSQL for production data
- Prisma for schema and migrations
- JWT or session cookies for authentication
- REST endpoints first, realtime sync later if needed

Core entities:

- User
- Task
- SubTask
- EchoRecord
- ResourceWallet
- PetProgress
- HomeProgress

Initial API surface:

```text
POST /auth/register
POST /auth/login
GET /me
GET /tasks
POST /tasks
PATCH /tasks/:id
POST /tasks/:id/complete
POST /tasks/:id/abandon
GET /records
POST /records
DELETE /records/:id
GET /profile/progress
PATCH /profile/progress
```

## Phase 3: Data migration strategy

The app should keep local-first behavior:

1. Continue reading and writing local state immediately for a smooth mobile feel.
2. Add a sync layer that sends local mutations to the backend after login.
3. Store `updatedAt` on every synced entity.
4. Resolve conflicts by comparing timestamps for simple fields.
5. Keep records append-only except explicit deletes.

## Phase 4: Native mobile polish

- App icon and splash screen
- Haptic feedback for completing tasks and subtasks
- Local notifications for reminders
- Android back button handling
- Offline sync queue
- Release signing for APK/AAB
