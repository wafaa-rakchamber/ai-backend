# 🚀 MCP Server Setup & Usage Guide

## Quick Start Guide for Project Management MCP Server

This guide explains how to set up, configure, and use the MCP server for project management system integration.

---

## 📋 What You Get

An MCP server that provides AI assistants access to your project management data through secure JWT authentication:

- 🔐 **User Authentication** - Login with email/password
- 📊 **Project Data** - Get all projects with stories and tasks
- 👤 **User Profiles** - Access user information
- ⏰ **Time Tracking** - View logging hours and task progress
- 🛡️ **Security** - JWT token-based authentication

---

## ⚡ Quick Setup (5 minutes)

### 1. Install Dependencies
```bash
npm install @modelcontextprotocol/sdk
```

### 2. Start Your Database
```bash
# Make sure PostgreSQL is running
# Run your main API server
npm start
```

### 3. Test the MCP Server
```bash
# Test the server works
npm run test-mcp

# Start the MCP server
npm run mcp
```

### 4. Configure AI Client

**For Claude Desktop:**
1. Open: `%APPDATA%\Claude\claude_desktop_config.json` (Windows)
2. Add this configuration:

```json
{
  "mcpServers": {
    "project-management": {
      "command": "node",
      "args": ["mcp-server.js"],
      "cwd": "C:\\path\\to\\your\\ai-backend",
      "type": "stdio"
    }
  }
}
```

**For VS Code MCP:**
1. Add to your VS Code MCP settings:

```json
{
  "servers": {
    "project-management": {
      "command": "node", 
      "args": ["mcp-server.js"],
      "cwd": "path/to/ai-backend",
      "type": "stdio"
    }
  }
}
```

---

## 🎯 How to Use

### Step 1: Authenticate
```
"Please authenticate me with email: your-email@example.com and password: yourpassword"
```

### Step 2: Get Your Data
```
"Show me all my projects"
"Get details for project ID 1" 
"What are my recent logging hours?"
"Show me my user profile"
```

### Available Commands:
- `authenticate` - Login and get JWT token
- `get_all_projects` - Retrieve all projects with stories/tasks
- `get_project_by_id` - Get specific project details  
- `get_user_profile` - Get your user information
- `get_all_stories` - Get all stories
- `get_all_tasks` - Get all tasks
- `get_user_logging_hours` - Get your time tracking data

---

## 🛠️ Troubleshooting

### Server Won't Start
```bash
# Check dependencies
npm install

# Check database connection
npm start

# Test MCP server specifically  
node mcp-server.js
```

### Authentication Fails
- Verify your email/password are correct
- Check database has user data: `npm run seed`
- Ensure main API server is running

### No Data Returned
- Run database seeder: `npm run seed`
- Check database connection in main API
- Verify JWT token is valid

### AI Client Can't Connect
- Check file paths in configuration are absolute
- Restart AI client after configuration changes
- Verify MCP server starts without errors

---

## 📁 Project Structure

```
ai-backend/
├── mcp-server.js              # Main MCP server
├── test-mcp.js                # Test script
├── MCP-README.md              # Detailed documentation
├── MCP-CONFIGURATION.md       # Configuration examples
├── README-MCP-GUIDE.md        # This guide
└── src/                       # Your existing API code
```

---

## 🔧 Development

### Run in Development Mode
```bash
# Auto-restart on changes
npm run mcp-dev
```

### Add New Tools
Edit `mcp-server.js` and add to `setupToolHandlers()`:

```javascript
// Add to tools array
{
  name: 'my_new_tool',
  description: 'Description of what it does',
  inputSchema: {
    type: 'object',
    properties: {
      param: { type: 'string', description: 'Parameter description' }
    },
    required: ['param']
  }
}

// Add handler in switch statement
case 'my_new_tool':
  return await this.myNewTool(args.param);
```

### Environment Variables
Create `.env` file:
```env
JWT_SECRET=your-secret-key
DATABASE_URL=postgresql://user:pass@localhost:5432/dbname
NODE_ENV=development
```

---

## 🚀 Real-World Example

### Sample Conversation with AI:

**You:** "Authenticate me with aalshehhi@rakchamber.ae and password123"

**AI:** "✅ Authentication successful! Welcome, Aamnah alshehhi. I've received your JWT token."

**You:** "Show me all my projects"

**AI:** "📊 You have 3 projects:
1. **Mobile Banking App** - Deadline today! You have a task: 'Balance display UI'
2. **Learning Management System** - Status: Postponed  
3. **testingAreabyAamna** - Your testing project"

**You:** "What tasks are assigned to me?"

**AI:** "🎯 You have 1 active task:
- **Balance display UI** in Mobile Banking App
- Status: New, 4 hours remaining"

---

## 📞 Support

### Need Help?
1. Check the detailed documentation: `MCP-README.md`
2. Run the test script: `npm run test-mcp`  
3. Check server logs for error messages
4. Verify database connection and API server status

### Common Issues:
- **"Module not found"** → Run `npm install`
- **"Database connection failed"** → Check PostgreSQL is running
- **"Invalid token"** → Re-authenticate with correct credentials
- **"No projects found"** → Run `npm run seed` to add sample data

---

**🎉 You're Ready to Go!**

Your MCP server is now configured and ready to provide AI assistants with secure access to your project management data. Enjoy seamless integration between your project data and AI assistance!

For advanced features and detailed documentation, see `MCP-README.md`.
