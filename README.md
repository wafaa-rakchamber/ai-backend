# Project Management API (Node.js + Sequelize + Postgres)

Backend API for managing Projects, Stories, Tasks, Logging Hours, and Users.

## Tech Stack
- Node.js (Express)
- Sequelize ORM
- PostgreSQL
- Docker / Docker Compose

## Run with Docker Desktop

```powershell
# From repo root
cd c:\wamp64\www\aitraining2025\d1\ai-backend
docker compose up --build
```

API: http://localhost:3000

Health: GET `/` -> "Project Management API"

Base path for resources: `/api`

## Endpoints (CRUD)
- Users: `/api/users`
- Projects: `/api/projects`
- Stories: `/api/stories`
- Tasks: `/api/tasks`
- Logging Hours: `/api/logginghours`

## Models

### Project
- name (string, required)
- description (text)
- startDate (date)
- deadLine (date)
- status (enum: New, inProgress, Closed, Done, postpone; default New)

### Story
- title (string, required)
- description (text)
- iteration (string)
- status (enum: New, inProgress, Cancelled, Closed; default New)
- StoryPoint (integer)
- projectId (FK -> Project)

### Task
- title (string, required)
- description (text)
- estimationHours (float)
- workingHours (float)
- status (enum: New, inProgress, Cancelled, Closed; default New)
- storyId (FK -> Story)
- assignedTo (FK -> User)

### LoggingHour
- hours (float, required)
- date (date, required)
- taskId (FK -> Task)
- userId (FK -> User)

### User
- name (string, required)
- email (unique, required)
- password (string, required)

## Notes
- In dev, the app runs `sequelize.sync({ alter: true })` to evolve schema. For existing Postgres enums, manual migration may be needed if enum values change.
- For production, switch to migrations.
