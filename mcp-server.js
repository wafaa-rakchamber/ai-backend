#!/usr/bin/env node

const { Server } = require('@modelcontextprotocol/sdk/server/index.js');
const { StdioServerTransport } = require('@modelcontextprotocol/sdk/server/stdio.js');
const { CallToolRequestSchema, ListToolsRequestSchema } = require('@modelcontextprotocol/sdk/types.js');
const { sequelize, User, Project, Story, Task, LoggingHour } = require('./src/models');
const AuthService = require('./src/services/authService');

class ProjectMCPServer {
  constructor() {
    this.server = new Server(
      {
        name: 'project-management-server',
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
    // List available tools
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          {
            name: 'authenticate',
            description: 'Authenticate user with email and password to get JWT token',
            inputSchema: {
              type: 'object',
              properties: {
                email: {
                  type: 'string',
                  description: 'User email address',
                },
                password: {
                  type: 'string',
                  description: 'User password',
                },
              },
              required: ['email', 'password'],
            },
          },
          {
            name: 'get_all_projects',
            description: 'Get all projects with their stories (requires JWT token)',
            inputSchema: {
              type: 'object',
              properties: {
                token: {
                  type: 'string',
                  description: 'JWT authentication token (Bearer token)',
                },
              },
              required: ['token'],
            },
          },
          {
            name: 'get_project_by_id',
            description: 'Get a specific project by ID with its stories (requires JWT token)',
            inputSchema: {
              type: 'object',
              properties: {
                token: {
                  type: 'string',
                  description: 'JWT authentication token (Bearer token)',
                },
                projectId: {
                  type: 'string',
                  description: 'Project ID to retrieve',
                },
              },
              required: ['token', 'projectId'],
            },
          },
          {
            name: 'get_user_profile',
            description: 'Get authenticated user profile information (requires JWT token)',
            inputSchema: {
              type: 'object',
              properties: {
                token: {
                  type: 'string',
                  description: 'JWT authentication token (Bearer token)',
                },
              },
              required: ['token'],
            },
          },
          {
            name: 'get_all_stories',
            description: 'Get all stories with their projects and tasks (requires JWT token)',
            inputSchema: {
              type: 'object',
              properties: {
                token: {
                  type: 'string',
                  description: 'JWT authentication token (Bearer token)',
                },
              },
              required: ['token'],
            },
          },
          {
            name: 'get_all_tasks',
            description: 'Get all tasks with their stories, users, and logging hours (requires JWT token)',
            inputSchema: {
              type: 'object',
              properties: {
                token: {
                  type: 'string',
                  description: 'JWT authentication token (Bearer token)',
                },
              },
              required: ['token'],
            },
          },
          {
            name: 'get_user_logging_hours',
            description: 'Get logging hours for authenticated user (requires JWT token)',
            inputSchema: {
              type: 'object',
              properties: {
                token: {
                  type: 'string',
                  description: 'JWT authentication token (Bearer token)',
                },
              },
              required: ['token'],
            },
          },
        ],
      };
    });

    // Handle tool calls
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case 'authenticate':
            return await this.authenticate(args.email, args.password);

          case 'get_all_projects':
            return await this.getAllProjects(args.token);

          case 'get_project_by_id':
            return await this.getProjectById(args.token, args.projectId);

          case 'get_user_profile':
            return await this.getUserProfile(args.token);

          case 'get_all_stories':
            return await this.getAllStories(args.token);

          case 'get_all_tasks':
            return await this.getAllTasks(args.token);

          case 'get_user_logging_hours':
            return await this.getUserLoggingHours(args.token);

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

  // Validate JWT token and extract user info
  validateToken(token) {
    try {
      return AuthService.verifyToken(token);
    } catch (error) {
      throw new Error('Invalid or expired JWT token');
    }
  }

  // Authenticate user
  async authenticate(email, password) {
    try {
      const result = await AuthService.login(email, password);
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              success: true,
              message: 'Authentication successful',
              user: result.user,
              token: result.token,
              tokenInfo: 'Use this token in the "token" parameter for other tools'
            }, null, 2),
          },
        ],
      };
    } catch (error) {
      throw new Error(`Authentication failed: ${error.message}`);
    }
  }

  // Get all projects
  async getAllProjects(token) {
    this.validateToken(token);

    const projects = await Project.findAll({
      include: [
        {
          model: Story,
          include: [
            {
              model: Task,
              include: [User, LoggingHour]
            }
          ]
        }
      ],
      order: [
        ['createdAt', 'DESC'],
        [Story, 'createdAt', 'DESC'],
        [Story, Task, 'createdAt', 'DESC']
      ]
    });

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            success: true,
            count: projects.length,
            projects: projects
          }, null, 2),
        },
      ],
    };
  }

  // Get project by ID
  async getProjectById(token, projectId) {
    this.validateToken(token);

    const project = await Project.findByPk(projectId, {
      include: [
        {
          model: Story,
          include: [
            {
              model: Task,
              include: [User, LoggingHour]
            }
          ]
        }
      ]
    });

    if (!project) {
      throw new Error('Project not found');
    }

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            success: true,
            project: project
          }, null, 2),
        },
      ],
    };
  }

  // Get user profile
  async getUserProfile(token) {
    const decoded = this.validateToken(token);
    
    const user = await AuthService.getProfile(decoded.id);

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            success: true,
            user: user
          }, null, 2),
        },
      ],
    };
  }

  // Get all stories
  async getAllStories(token) {
    this.validateToken(token);

    const stories = await Story.findAll({
      include: [
        Project,
        {
          model: Task,
          include: [User, LoggingHour]
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            success: true,
            count: stories.length,
            stories: stories
          }, null, 2),
        },
      ],
    };
  }

  // Get all tasks
  async getAllTasks(token) {
    this.validateToken(token);

    const tasks = await Task.findAll({
      include: [Story, User, LoggingHour],
      order: [['createdAt', 'DESC']]
    });

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            success: true,
            count: tasks.length,
            tasks: tasks
          }, null, 2),
        },
      ],
    };
  }

  // Get user's logging hours
  async getUserLoggingHours(token) {
    const decoded = this.validateToken(token);

    const loggingHours = await LoggingHour.findAll({
      where: { userId: decoded.id },
      include: [Task, User],
      order: [['createdAt', 'DESC']]
    });

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            success: true,
            count: loggingHours.length,
            loggingHours: loggingHours
          }, null, 2),
        },
      ],
    };
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    
    // Ensure database connection
    await sequelize.authenticate();
    console.error('MCP Server started and database connected');
  }
}

// Start the server
if (require.main === module) {
  const server = new ProjectMCPServer();
  server.run().catch(console.error);
}

module.exports = ProjectMCPServer;
