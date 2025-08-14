# MCP Server Configuration Examples

## Claude Desktop Configuration

To use this MCP server with Claude Desktop, add this configuration to your Claude Desktop config file:

### Windows Config Location
`%APPDATA%\Claude\claude_desktop_config.json`

### macOS Config Location  
`~/Library/Application Support/Claude/claude_desktop_config.json`

### Configuration Example
```json
{
  "mcpServers": {
    "project-management": {
      "command": "node",
      "args": ["c:\\Users\\aalshehhi\\OneDrive - RAK Chamber of Commerce and Industry\\Desktop\\AI course\\ai-backend\\mcp-server.js"],
      "env": {
        "NODE_ENV": "development"
      }
    }
  }
}
```

## Alternative Configuration (using npm script)
```json
{
  "mcpServers": {
    "project-management": {
      "command": "npm",
      "args": ["run", "mcp"],
      "cwd": "c:\\Users\\aalshehhi\\OneDrive - RAK Chamber of Commerce and Industry\\Desktop\\AI course\\ai-backend",
      "env": {
        "NODE_ENV": "development"
      }
    }
  }
}
```

## Generic MCP Client Configuration
For other MCP clients, use these parameters:
- **Command**: `node`
- **Args**: `["path/to/your/ai-backend/mcp-server.js"]`
- **Working Directory**: Path to your ai-backend folder
- **Environment**: Set any necessary environment variables

## Testing the Configuration

1. Make sure your PostgreSQL database is running
2. Make sure you have users and projects in your database (run `npm run seed` if needed)
3. Start your main API server: `npm start`
4. Test the MCP server: `npm run test-mcp`
5. If everything works, restart Claude Desktop to load the new MCP server

## Usage in Claude Desktop

Once configured, you'll be able to use these tools in Claude Desktop:

1. **authenticate** - Get JWT token with email/password
2. **get_all_projects** - Retrieve all projects with stories and tasks
3. **get_project_by_id** - Get specific project details
4. **get_user_profile** - Get user information
5. **get_all_stories** - Get all stories
6. **get_all_tasks** - Get all tasks
7. **get_user_logging_hours** - Get time tracking data

## Example Conversation Flow

1. "Please authenticate me with email: user@example.com and password: mypassword"
2. "Now get all my projects"
3. "Show me details for project ID 1"
4. "Get my logging hours"

The MCP server will handle JWT authentication automatically and return structured data from your project management system.
