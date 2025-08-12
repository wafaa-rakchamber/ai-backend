# Project Management API (Node.js + Sequelize + Postgres + JWT Auth)

Backend API for managing Projects, Stories, Tasks, Logging Hours, and Users with JWT authentication.

## Tech Stack
- Node.js (Express)
- Sequelize ORM
- PostgreSQL
- Docker / Docker Compose
- JWT Authentication
- bcryptjs Password Hashing

## 🚀 Quick Start

```powershell
# Clone and navigate to project
cd c:\wamp64\www\aitraining2025\d1\ai-backend

# Start with Docker Desktop
docker compose up --build -d

# Seed database with sample data
docker compose exec api npm run seed

# API available at: http://localhost:3000
```

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication. All CRUD operations require a valid token.

### Auth Endpoints
- **POST** `/api/auth/register` - Register new user
- **POST** `/api/auth/login` - Login user  
- **GET** `/api/auth/profile` - Get current user profile
- **POST** `/api/auth/refresh` - Refresh JWT token
- **POST** `/api/auth/logout` - Logout instruction

### Sample Login
```json
POST /api/auth/login
{
  "email": "alice@company.com",
  "password": "password123"
}
```

### Using the Token
```
Authorization: Bearer YOUR_JWT_TOKEN_HERE
```

## 📋 API Endpoints (Protected)

Base path: `/api` (all require authentication)

### Projects
- **GET** `/api/projects` - Get all projects
- **POST** `/api/projects` - Create project
- **GET** `/api/projects/:id` - Get project by ID
- **PUT** `/api/projects/:id` - Update project
- **DELETE** `/api/projects/:id` - Delete project

### Stories  
- **GET** `/api/stories` - Get all stories
- **POST** `/api/stories` - Create story
- **GET** `/api/stories/:id` - Get story by ID
- **PUT** `/api/stories/:id` - Update story
- **DELETE** `/api/stories/:id` - Delete story

### Tasks
- **GET** `/api/tasks` - Get all tasks
- **POST** `/api/tasks` - Create task
- **GET** `/api/tasks/:id` - Get task by ID
- **PUT** `/api/tasks/:id` - Update task
- **DELETE** `/api/tasks/:id` - Delete task

### Logging Hours (User-Scoped)
- **GET** `/api/logginghours` - Get your logged hours
- **POST** `/api/logginghours` - Log hours
- **GET** `/api/logginghours/:id` - Get your log entry
- **PUT** `/api/logginghours/:id` - Update your log
- **DELETE** `/api/logginghours/:id` - Delete your log

### Users (Restricted)
- **GET** `/api/users` - Get all users (limited info)
- **GET** `/api/users/:id` - Get user profile
- **PUT** `/api/users/:id` - Update your own profile
- **DELETE** `/api/users/:id` - Delete your own account

## 📊 Data Models

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
- projectId (FK → Project)

### Task
- title (string, required)
- description (text)
- estimationHours (float)
- workingHours (float)
- status (enum: New, inProgress, Cancelled, Closed; default New)
- storyId (FK → Story)
- assignedTo (FK → User)

### LoggingHour
- hours (float, required)
- date (date, required)
- taskId (FK → Task)
- userId (FK → User, auto-set to current user)

### User
- name (string, required)
- email (unique, required)
- password (hashed with bcrypt)

## 🛡️ Security Features

- **JWT Authentication**: 24-hour token expiry
- **Password Hashing**: bcrypt with 12 salt rounds
- **Rate Limiting**: 5 auth attempts per 15 minutes
- **User Scoping**: Users only see their own logging hours
- **Resource Protection**: Users can only modify their own profiles

## 🧪 Testing

### Sample Test Users (from seed data)
- alice@company.com / password123
- bob@company.com / password123
- carol@company.com / password123
- david@company.com / password123
- emma@company.com / password123

### With Postman
1. Import collection: `postman/Project-Management-API-with-Auth.postman_collection.json`
2. Import environment: `postman/Development.postman_environment.json`
3. Login with sample user - token saves automatically
4. Test protected endpoints

## 🐳 Docker Commands

```powershell
# Start services
docker compose up -d

# View logs
docker compose logs api
docker compose logs db

# Seed database
docker compose exec api npm run seed

# Stop services
docker compose down

# Rebuild
docker compose up --build -d
```

## 🔧 Environment Variables

Create `.env` file (see `.env.example`):

```env
JWT_SECRET=your-super-secret-key-at-least-32-characters
JWT_EXPIRES_IN=24h
DB_HOST=localhost
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=projectdb
NODE_ENV=development
```

## 🚧 Development Notes

- Schema auto-alters in development (`sync({ alter: true })`)
- For production, switch to proper migrations
- Passwords in seed data are hashed during creation
- JWT secret should be changed in production
- Rate limiting protects auth endpoints

## 📁 Project Structure

```
├── src/
│   ├── models/           # Sequelize models
│   ├── routes/           # API routes  
│   ├── services/         # Business logic
│   ├── middleware/       # Auth middleware
│   └── index.js          # Express app
├── postman/              # API collection
├── docker-compose.yml    # Docker setup
├── seed-data.js          # Database seeder
└── README.md
```
