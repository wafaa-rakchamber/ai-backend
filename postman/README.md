# Postman Collection for Project Management API

This directory contains Postman collection and environment files for testing the Project Management API.

## Files

- `Project-Management-API.postman_collection.json` - Complete API collection with all CRUD operations
- `Development.postman_environment.json` - Environment variables for local development

## How to Import

### Option 1: Import Files
1. Open Postman
2. Click "Import" button
3. Select both JSON files from this directory
4. Set "Development" as your active environment

### Option 2: Import via URL (if hosted)
1. Copy the raw URL of the collection file
2. In Postman, click "Import" → "Link" → paste URL

## Environment Variables

- `baseUrl`: http://localhost:3000 (for local Docker setup)
- `apiVersion`: v1 (for future API versioning)

## Collection Structure

### Health Check
- **GET** `/` - API health check

### Users CRUD
- **GET** `/api/users` - Get all users
- **GET** `/api/users/:id` - Get user by ID
- **POST** `/api/users` - Create new user
- **PUT** `/api/users/:id` - Update user
- **DELETE** `/api/users/:id` - Delete user

### Projects CRUD
- **GET** `/api/projects` - Get all projects (includes stories)
- **GET** `/api/projects/:id` - Get project by ID
- **POST** `/api/projects` - Create new project
- **PUT** `/api/projects/:id` - Update project
- **DELETE** `/api/projects/:id` - Delete project

### Stories CRUD
- **GET** `/api/stories` - Get all stories (includes project and tasks)
- **GET** `/api/stories/:id` - Get story by ID
- **POST** `/api/stories` - Create new story
- **PUT** `/api/stories/:id` - Update story
- **DELETE** `/api/stories/:id` - Delete story

### Tasks CRUD
- **GET** `/api/tasks` - Get all tasks (includes story, user, logging hours)
- **GET** `/api/tasks/:id` - Get task by ID
- **POST** `/api/tasks` - Create new task
- **PUT** `/api/tasks/:id` - Update task
- **DELETE** `/api/tasks/:id` - Delete task

### Logging Hours CRUD
- **GET** `/api/logginghours` - Get all logging hours (includes task and user)
- **GET** `/api/logginghours/:id` - Get logging hour by ID
- **POST** `/api/logginghours` - Create new logging hour entry
- **PUT** `/api/logginghours/:id` - Update logging hour
- **DELETE** `/api/logginghours/:id` - Delete logging hour

## Sample Data

Each POST request includes realistic sample data that matches the mock data structure:

### Project Status Options
- New (default)
- inProgress
- Closed
- Done
- postpone

### Story Status Options
- New (default)
- inProgress
- Cancelled
- Closed

### Task Status Options
- New (default)
- inProgress
- Cancelled
- Closed

## Testing Workflow

1. Start your Docker containers: `docker compose up -d`
2. Run the seed script: `docker compose exec api npm run seed`
3. Import the Postman collection and environment
4. Test the API endpoints:
   - Start with Health Check
   - Get all resources to see seeded data
   - Try creating new resources
   - Test updates and deletions

## Notes

- All requests use JSON format
- Foreign key relationships are enforced (e.g., story must have valid projectId)
- GET requests for individual resources include related data
- Update requests are partial (only send fields you want to change)
- Delete operations cascade where appropriate
