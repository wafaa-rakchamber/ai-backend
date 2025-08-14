# Project Management MCP Server

This is a Model Context Protocol (MCP) server for the Project Management API with JWT authentication. It provides tools to retrieve projects, stories, tasks, and user data while respecting the existing authentication system.

## Features

- 🔐 **JWT Authentication**: Uses the same authentication system as your main API
- 📊 **Project Management**: Access to projects, stories, tasks, and logging hours
- 🛡️ **Secure**: All operations require valid JWT tokens
- 📈 **Complete Data**: Includes related data (stories within projects, tasks within stories, etc.)

## Available Tools

### 1. `authenticate`
Authenticate user with email and password to get a JWT token.
- **Input**: `email`, `password`
- **Output**: JWT token and user information

### 2. `get_all_projects`
Get all projects with their related stories and tasks.
- **Input**: `token` (JWT)
- **Output**: Array of projects with nested stories and tasks

### 3. `get_project_by_id`
Get a specific project by ID with all related data.
- **Input**: `token` (JWT), `projectId`
- **Output**: Project details with stories and tasks

### 4. `get_user_profile`
Get authenticated user's profile information.
- **Input**: `token` (JWT)
- **Output**: User profile data

### 5. `get_all_stories`
Get all stories with their projects and tasks.
- **Input**: `token` (JWT)
- **Output**: Array of stories with related data

### 6. `get_all_tasks`
Get all tasks with their stories, users, and logging hours.
- **Input**: `token` (JWT)
- **Output**: Array of tasks with complete details

### 7. `get_user_logging_hours`
Get logging hours for the authenticated user.
- **Input**: `token` (JWT)
- **Output**: User's logging hours with task details

## Setup Instructions

### 1. Install MCP SDK Dependencies

```powershell
npm install @modelcontextprotocol/sdk
```

Or if you want to install all dependencies fresh:
```powershell
npm install
npm install @modelcontextprotocol/sdk
```

### 2. Make the MCP Server Executable

The server is ready to run with:
```powershell
node mcp-server.js
```

### 3. Environment Setup

Make sure your database is running and the environment variables are set (same as your main API):
- Database connection settings
- JWT_SECRET
- JWT_EXPIRES_IN (optional)

### 4. Test the Server

You can test the server using the MCP protocol. First, make sure your main API server is running and has some data.

## Usage Examples

### Authentication Flow
1. First, use the `authenticate` tool with your user credentials
2. Save the returned JWT token
3. Use the token for all subsequent API calls

### Getting All Projects
After authentication, use the `get_all_projects` tool with your JWT token to retrieve all projects with their complete hierarchy:
- Projects → Stories → Tasks → Logging Hours

### Getting Specific Data
- Use `get_project_by_id` for specific project details
- Use `get_user_profile` to get current user information
- Use `get_user_logging_hours` to get time tracking data

## Security Notes

- All tools except `authenticate` require a valid JWT token
- The server uses the same authentication logic as your main API
- User data is filtered based on authentication (e.g., logging hours are user-specific)
- Tokens expire based on your JWT_EXPIRES_IN setting (default: 24 hours)

## Integration with AI Tools

This MCP server can be integrated with AI tools that support the Model Context Protocol, allowing them to:
- Access your project management data
- Understand project structures and relationships
- Analyze project progress and time tracking
- Provide insights based on your actual project data

## Troubleshooting

### Database Connection Issues
- Ensure your PostgreSQL database is running
- Check your database connection settings in the models
- Verify the database has been migrated and seeded with data

### Authentication Issues
- Verify JWT_SECRET is set correctly
- Check that user accounts exist in the database
- Ensure tokens haven't expired

### Tool Not Found Errors
- Make sure you're using the exact tool names as listed above
- Check that all required parameters are provided
- Verify the MCP server is running properly

## Development

To run in development mode with auto-restart:
```powershell
npx nodemon mcp-server.js
```

To add new tools, modify the `setupToolHandlers()` method in `mcp-server.js` and add corresponding handler methods.
