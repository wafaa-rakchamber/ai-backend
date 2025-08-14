# 🚀 Complete Guide: Creating and Configuring MCP Servers

## Table of Contents
1. [What is MCP?](#what-is-mcp)
2. [Prerequisites](#prerequisites)
3. [Step-by-Step MCP Server Creation](#step-by-step-mcp-server-creation)
4. [Configuration](#configuration)
5. [Testing](#testing)
6. [Deployment](#deployment)
7. [Troubleshooting](#troubleshooting)
8. [Advanced Features](#advanced-features)

---

## What is MCP?

**Model Context Protocol (MCP)** is a standard that allows AI assistants to securely connect to external data sources and tools. It enables AI models to:

- 🔗 Connect to databases, APIs, and services
- 🛠️ Execute functions and operations
- 📊 Access real-time data
- 🔒 Maintain security and authentication

---

## Prerequisites

### Required Software
- **Node.js** (v18 or higher)
- **npm** or **yarn**
- A database (PostgreSQL, MySQL, etc.) - optional but recommended
- Code editor (VS Code recommended)

### Required Knowledge
- Basic JavaScript/Node.js
- Understanding of APIs and databases
- Basic command line usage

---

## Step-by-Step MCP Server Creation

### Step 1: Project Setup

```bash
# Create new project directory
mkdir my-mcp-server
cd my-mcp-server

# Initialize npm project
npm init -y

# Install MCP SDK
npm install @modelcontextprotocol/sdk
```

### Step 2: Basic MCP Server Structure

Create `mcp-server.js`:

```javascript
#!/usr/bin/env node

const { Server } = require('@modelcontextprotocol/sdk/server/index.js');
const { StdioServerTransport } = require('@modelcontextprotocol/sdk/server/stdio.js');
const { CallToolRequestSchema, ListToolsRequestSchema } = require('@modelcontextprotocol/sdk/types.js');

class MyMCPServer {
  constructor() {
    this.server = new Server(
      {
        name: 'my-mcp-server',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupToolHandlers();
  }

  setupToolHandlers() {
    // Define available tools
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          {
            name: 'hello_world',
            description: 'Says hello to the world',
            inputSchema: {
              type: 'object',
              properties: {
                name: {
                  type: 'string',
                  description: 'Name to greet',
                },
              },
              required: ['name'],
            },
          },
          // Add more tools here
        ],
      };
    });

    // Handle tool calls
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case 'hello_world':
            return await this.sayHello(args.name);
          
          default:
            throw new Error(`Unknown tool: ${name}`);
        }
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Error: ${error.message}`,
            },
          ],
          isError: true,
        };
      }
    });
  }

  // Tool implementation
  async sayHello(name) {
    return {
      content: [
        {
          type: 'text',
          text: `Hello, ${name}! Welcome to MCP Server!`,
        },
      ],
    };
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('MCP Server started successfully');
  }
}

// Start the server
if (require.main === module) {
  const server = new MyMCPServer();
  server.run().catch(console.error);
}

module.exports = MyMCPServer;
```

### Step 3: Add Authentication (Optional)

For servers that need authentication, add JWT or API key validation:

```javascript
// Add to your server class
validateAuth(token) {
  if (!token) {
    throw new Error('Authentication token required');
  }
  
  try {
    // Validate your token here
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded;
  } catch (error) {
    throw new Error('Invalid authentication token');
  }
}

// Use in tool handlers
async protectedTool(args) {
  this.validateAuth(args.token);
  // Your protected logic here
}
```

### Step 4: Add Database Integration

```javascript
// Add database connection
const { Sequelize } = require('sequelize');

class MyMCPServer {
  constructor() {
    // Initialize database
    this.sequelize = new Sequelize(process.env.DATABASE_URL);
    
    // Rest of constructor...
  }

  async connectDatabase() {
    try {
      await this.sequelize.authenticate();
      console.error('Database connected successfully');
    } catch (error) {
      console.error('Database connection failed:', error);
    }
  }

  async run() {
    await this.connectDatabase();
    
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('MCP Server started successfully');
  }
}
```

### Step 5: Add More Complex Tools

```javascript
// Example: File operations tool
{
  name: 'read_file',
  description: 'Read contents of a file',
  inputSchema: {
    type: 'object',
    properties: {
      filePath: {
        type: 'string',
        description: 'Path to the file to read',
      },
    },
    required: ['filePath'],
  },
}

// Implementation
async readFile(filePath) {
  const fs = require('fs').promises;
  
  try {
    const content = await fs.readFile(filePath, 'utf8');
    return {
      content: [
        {
          type: 'text',
          text: content,
        },
      ],
    };
  } catch (error) {
    throw new Error(`Failed to read file: ${error.message}`);
  }
}
```

---

## Configuration

### Step 1: Update package.json

```json
{
  "name": "my-mcp-server",
  "version": "1.0.0",
  "main": "mcp-server.js",
  "bin": {
    "my-mcp-server": "./mcp-server.js"
  },
  "scripts": {
    "start": "node mcp-server.js",
    "dev": "nodemon mcp-server.js",
    "test": "node test-mcp.js"
  },
  "dependencies": {
    "@modelcontextprotocol/sdk": "^1.0.0"
  }
}
```

### Step 2: Environment Variables

Create `.env` file:

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/mydb

# Authentication
JWT_SECRET=your-super-secret-key

# Server settings
NODE_ENV=development
PORT=3000
```

### Step 3: MCP Client Configuration

For **Claude Desktop**, add to config file:

**Windows:** `%APPDATA%\Claude\claude_desktop_config.json`
**macOS:** `~/Library/Application Support/Claude/claude_desktop_config.json`

```json
{
  "mcpServers": {
    "my-server": {
      "command": "node",
      "args": ["path/to/your/mcp-server.js"],
      "cwd": "path/to/your/project",
      "env": {
        "NODE_ENV": "development"
      }
    }
  }
}
```

For **VS Code MCP Extension**, add to VS Code settings:

```json
{
  "servers": {
    "my-server": {
      "command": "node",
      "args": ["mcp-server.js"],
      "cwd": "path/to/your/project",
      "type": "stdio"
    }
  }
}
```

---

## Testing

### Step 1: Create Test Script

Create `test-mcp.js`:

```javascript
const MyMCPServer = require('./mcp-server');

async function testServer() {
  console.log('🧪 Testing MCP Server...');
  
  try {
    const server = new MyMCPServer();
    
    // Test tool availability
    console.log('✅ Server created successfully');
    
    // Test specific functionality
    const result = await server.sayHello('World');
    console.log('✅ Hello World test:', result);
    
    console.log('🎉 All tests passed!');
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testServer();
```

### Step 2: Run Tests

```bash
# Test the server
npm test

# Or run directly
node test-mcp.js
```

---

## Deployment

### Option 1: Local Development

```bash
# Start the server
npm start

# Or with auto-restart
npm run dev
```

### Option 2: Docker Deployment

Create `Dockerfile`:

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
```

Create `docker-compose.yml`:

```yaml
version: '3.8'

services:
  mcp-server:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://postgres:password@db:5432/mcpdb
    depends_on:
      - db
  
  db:
    image: postgres:15
    environment:
      - POSTGRES_DB=mcpdb
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

### Option 3: Cloud Deployment

Deploy to platforms like:
- **Heroku**
- **Vercel**
- **Railway**
- **AWS Lambda**

---

## Troubleshooting

### Common Issues

#### 1. **"Module not found" errors**
```bash
# Solution: Install missing dependencies
npm install @modelcontextprotocol/sdk
```

#### 2. **"Permission denied" errors**
```bash
# Solution: Make script executable (Linux/macOS)
chmod +x mcp-server.js
```

#### 3. **Database connection fails**
- Check database is running
- Verify connection string
- Check firewall settings

#### 4. **Authentication errors**
- Verify JWT secret is set
- Check token expiration
- Validate user permissions

### Debug Mode

Add debug logging:

```javascript
// Add to your server
console.error('Debug: Tool called with args:', args);
```

Enable verbose logging:
```bash
NODE_ENV=development npm start
```

---

## Advanced Features

### 1. **Resource Management**

```javascript
// Add resource handlers for files, databases, etc.
this.server.setRequestHandler(ListResourcesRequestSchema, async () => {
  return {
    resources: [
      {
        uri: 'file:///path/to/file',
        name: 'Configuration File',
        description: 'Server configuration',
        mimeType: 'application/json',
      },
    ],
  };
});
```

### 2. **Streaming Responses**

```javascript
// For large data responses
async streamLargeData(args) {
  const stream = new ReadableStream({
    start(controller) {
      // Stream data chunks
      controller.enqueue('chunk 1\n');
      controller.enqueue('chunk 2\n');
      controller.close();
    }
  });
  
  return { content: [{ type: 'text', text: await streamToString(stream) }] };
}
```

### 3. **WebSocket Support**

```javascript
// For real-time updates
const WebSocket = require('ws');

class RealtimeMCPServer extends MyMCPServer {
  constructor() {
    super();
    this.wss = new WebSocket.Server({ port: 8080 });
    this.setupWebSocket();
  }
  
  setupWebSocket() {
    this.wss.on('connection', (ws) => {
      ws.on('message', (message) => {
        // Handle real-time messages
      });
    });
  }
}
```

### 4. **Caching**

```javascript
// Add caching for better performance
const NodeCache = require('node-cache');

class CachedMCPServer extends MyMCPServer {
  constructor() {
    super();
    this.cache = new NodeCache({ stdTTL: 600 }); // 10 minutes
  }
  
  async getCachedData(key, fetchFunction) {
    let data = this.cache.get(key);
    if (!data) {
      data = await fetchFunction();
      this.cache.set(key, data);
    }
    return data;
  }
}
```

---

## Example: Complete Project Management MCP Server

Here's a real-world example based on our project management system:

### Features Implemented:
- ✅ JWT Authentication
- ✅ Database Integration (PostgreSQL)
- ✅ Multiple Tools (7 different operations)
- ✅ Error Handling
- ✅ User Authorization
- ✅ Comprehensive Testing

### Tools Available:
1. **authenticate** - User login with JWT
2. **get_all_projects** - Retrieve projects with stories/tasks
3. **get_project_by_id** - Get specific project details
4. **get_user_profile** - User information
5. **get_all_stories** - All stories with relationships
6. **get_all_tasks** - All tasks with details
7. **get_user_logging_hours** - Time tracking data

### Security Features:
- JWT token validation
- User-specific data filtering
- Error sanitization
- Input validation

---

## 🎯 Next Steps

1. **Start Simple** - Begin with a basic "Hello World" MCP server
2. **Add Gradually** - Implement one tool at a time
3. **Test Thoroughly** - Write tests for each tool
4. **Secure Properly** - Add authentication and validation
5. **Document Well** - Create clear documentation for users
6. **Deploy Safely** - Use environment variables and proper error handling

## 📚 Additional Resources

- [MCP SDK Documentation](https://github.com/modelcontextprotocol/sdk)
- [Claude Desktop MCP Guide](https://docs.anthropic.com/claude/docs/mcp)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)
- [JWT Authentication Guide](https://jwt.io/introduction)

---

## 🤝 Contributing

Feel free to:
- Report issues
- Suggest improvements  
- Submit pull requests
- Share your MCP server examples

**Happy MCP Server Building! 🚀**
