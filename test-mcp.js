#!/usr/bin/env node

/**
 * Simple test script for the MCP Server
 * This script demonstrates how to interact with the MCP server tools
 */

const ProjectMCPServer = require('./mcp-server');

async function testMCPServer() {
  console.log('🧪 Testing MCP Server Tools...\n');

  // Create server instance (but don't start it fully)
  const server = new ProjectMCPServer();
  
  // Test authentication (you'll need to replace with actual user credentials)
  const testEmail = 'test@example.com'; // Replace with a real user email from your DB
  const testPassword = 'password'; // Replace with the actual password

  console.log('📋 Available Tools:');
  console.log('1. authenticate - Get JWT token');
  console.log('2. get_all_projects - Retrieve all projects');
  console.log('3. get_project_by_id - Get specific project');
  console.log('4. get_user_profile - Get user profile');
  console.log('5. get_all_stories - Get all stories');
  console.log('6. get_all_tasks - Get all tasks');
  console.log('7. get_user_logging_hours - Get user time logs');
  
  console.log('\n🔐 Authentication Flow:');
  console.log('1. First authenticate with credentials to get JWT token');
  console.log('2. Use the JWT token for all subsequent API calls');
  
  console.log('\n💡 Example Usage:');
  console.log('Authentication:');
  console.log(`  Tool: authenticate`);
  console.log(`  Parameters: { "email": "${testEmail}", "password": "your_password" }`);
  
  console.log('\nGet All Projects:');
  console.log(`  Tool: get_all_projects`);
  console.log(`  Parameters: { "token": "your_jwt_token_here" }`);
  
  console.log('\n🚀 To run the MCP server:');
  console.log('  node mcp-server.js');
  
  console.log('\n✅ MCP Server is ready to use!');
  console.log('\n📖 See MCP-README.md for detailed documentation');
}

if (require.main === module) {
  testMCPServer().catch(console.error);
}

module.exports = { testMCPServer };
