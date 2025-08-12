const { sequelize, User, Project, Story, Task, LoggingHour } = require('./src/models');
const AuthService = require('./src/services/authService');

async function seedDatabase() {
  try {
    console.log('🚀 Starting database seeding...');
    
    // Sync database
    await sequelize.sync({ alter: true });
    console.log('✅ Database synced');

    // Clear existing data
    await LoggingHour.destroy({ where: {} });
    await Task.destroy({ where: {} });
    await Story.destroy({ where: {} });
    await Project.destroy({ where: {} });
    await User.destroy({ where: {} });
    console.log('🧹 Cleared existing data');

    // Create 5 users with hashed passwords
    const userData = [
      { name: 'Wafaa Farajallah', email: 'wafaa@rakchamber.ae', password: 'password123' },
      { name: 'Mohammed Morhaf', email: 'm.murhaf@rakchamber.ae', password: 'password123' },
      { name: 'Saad AlAfandi', email: 'saad.cs7@gmail.com', password: 'password123' },
      { name: 'Aamnah alshehhi ', email: 'aalshehhi@rakchamber.ae', password: 'password123' },
      { name: 'Admin', email: 'admin@company.com', password: 'password123' }
    ];

    const users = [];
    for (const user of userData) {
      const hashedPassword = await AuthService.hashPassword(user.password);
      const createdUser = await User.create({
        ...user,
        password: hashedPassword
      });
      users.push(createdUser);
    }
    console.log('👥 Created 5 users with hashed passwords');

    // Create 5 projects
    const projects = await Project.bulkCreate([
      {
        name: 'E-commerce Platform',
        description: 'Online shopping platform with payment integration',
        startDate: '2025-01-15',
        deadLine: '2025-06-30',
        status: 'inProgress'
      },
      {
        name: 'Mobile Banking App',
        description: 'Secure mobile banking application',
        startDate: '2025-02-01',
        deadLine: '2025-08-15',
        status: 'New'
      },
      {
        name: 'CRM System',
        description: 'Customer relationship management system',
        startDate: '2025-01-01',
        deadLine: '2025-05-31',
        status: 'inProgress'
      },
      {
        name: 'Analytics Dashboard',
        description: 'Real-time business analytics dashboard',
        startDate: '2024-12-01',
        deadLine: '2025-03-31',
        status: 'Done'
      },
      {
        name: 'Learning Management System',
        description: 'Online learning platform for education',
        startDate: '2025-03-01',
        deadLine: '2025-09-30',
        status: 'postpone'
      }
    ]);
    console.log('📁 Created 5 projects');

    // Create 10 stories
    const stories = await Story.bulkCreate([
      { title: 'User Registration', description: 'Users can create accounts', iteration: 'Sprint 1', status: 'Closed', StoryPoint: 5, projectId: projects[0].id },
      { title: 'Product Catalog', description: 'Display products with search', iteration: 'Sprint 2', status: 'inProgress', StoryPoint: 8, projectId: projects[0].id },
      { title: 'Payment Gateway', description: 'Integrate payment processing', iteration: 'Sprint 3', status: 'New', StoryPoint: 13, projectId: projects[0].id },
      { title: 'Account Login', description: 'Secure user authentication', iteration: 'Sprint 1', status: 'Closed', StoryPoint: 3, projectId: projects[1].id },
      { title: 'Balance Inquiry', description: 'Check account balance', iteration: 'Sprint 2', status: 'inProgress', StoryPoint: 5, projectId: projects[1].id },
      { title: 'Contact Management', description: 'Manage customer contacts', iteration: 'Sprint 1', status: 'Closed', StoryPoint: 8, projectId: projects[2].id },
      { title: 'Sales Pipeline', description: 'Track sales opportunities', iteration: 'Sprint 2', status: 'inProgress', StoryPoint: 13, projectId: projects[2].id },
      { title: 'Revenue Reports', description: 'Generate revenue analytics', iteration: 'Sprint 1', status: 'Closed', StoryPoint: 8, projectId: projects[3].id },
      { title: 'User Metrics', description: 'Track user behavior', iteration: 'Sprint 2', status: 'Closed', StoryPoint: 5, projectId: projects[3].id },
      { title: 'Course Creation', description: 'Create and manage courses', iteration: 'Sprint 1', status: 'New', StoryPoint: 21, projectId: projects[4].id }
    ]);
    console.log('📝 Created 10 stories');

    // Create 20 tasks
    const tasks = await Task.bulkCreate([
      { title: 'Design registration form', description: 'Create UI mockups for registration', estimationHours: 8, workingHours: 6, status: 'Closed', storyId: stories[0].id, assignedTo: users[0].id },
      { title: 'Implement registration API', description: 'Backend API for user registration', estimationHours: 12, workingHours: 10, status: 'Closed', storyId: stories[0].id, assignedTo: users[1].id },
      { title: 'Database design for products', description: 'Design product catalog schema', estimationHours: 6, workingHours: 4, status: 'Closed', storyId: stories[1].id, assignedTo: users[2].id },
      { title: 'Product listing UI', description: 'Frontend for product display', estimationHours: 16, workingHours: 12, status: 'inProgress', storyId: stories[1].id, assignedTo: users[0].id },
      { title: 'Search functionality', description: 'Implement product search', estimationHours: 10, workingHours: 2, status: 'New', storyId: stories[1].id, assignedTo: users[3].id },
      { title: 'Payment provider research', description: 'Research payment gateway options', estimationHours: 4, workingHours: 0, status: 'New', storyId: stories[2].id, assignedTo: users[4].id },
      { title: 'Payment integration', description: 'Integrate chosen payment provider', estimationHours: 20, workingHours: 0, status: 'New', storyId: stories[2].id, assignedTo: users[1].id },
      { title: 'Login form design', description: 'Design secure login interface', estimationHours: 6, workingHours: 6, status: 'Closed', storyId: stories[3].id, assignedTo: users[0].id },
      { title: 'Authentication service', description: 'Implement JWT authentication', estimationHours: 10, workingHours: 8, status: 'Closed', storyId: stories[3].id, assignedTo: users[1].id },
      { title: 'Balance API endpoint', description: 'Create balance inquiry endpoint', estimationHours: 8, workingHours: 6, status: 'inProgress', storyId: stories[4].id, assignedTo: users[2].id },
      { title: 'Balance display UI', description: 'Frontend for balance display', estimationHours: 6, workingHours: 2, status: 'New', storyId: stories[4].id, assignedTo: users[3].id },
      { title: 'Contact form', description: 'Create contact management form', estimationHours: 12, workingHours: 10, status: 'Closed', storyId: stories[5].id, assignedTo: users[0].id },
      { title: 'Contact database', description: 'Design contact storage schema', estimationHours: 8, workingHours: 6, status: 'Closed', storyId: stories[5].id, assignedTo: users[4].id },
      { title: 'Pipeline visualization', description: 'Create sales pipeline view', estimationHours: 16, workingHours: 8, status: 'inProgress', storyId: stories[6].id, assignedTo: users[1].id },
      { title: 'Opportunity tracking', description: 'Track sales opportunities', estimationHours: 14, workingHours: 4, status: 'New', storyId: stories[6].id, assignedTo: users[2].id },
      { title: 'Revenue chart component', description: 'Create chart for revenue display', estimationHours: 10, workingHours: 10, status: 'Closed', storyId: stories[7].id, assignedTo: users[3].id },
      { title: 'Revenue calculation logic', description: 'Implement revenue calculations', estimationHours: 12, workingHours: 9, status: 'Closed', storyId: stories[7].id, assignedTo: users[4].id },
      { title: 'User analytics tracking', description: 'Implement user behavior tracking', estimationHours: 8, workingHours: 8, status: 'Closed', storyId: stories[8].id, assignedTo: users[0].id },
      { title: 'Metrics dashboard', description: 'Create metrics visualization', estimationHours: 14, workingHours: 12, status: 'Closed', storyId: stories[8].id, assignedTo: users[1].id },
      { title: 'Course creation form', description: 'Design course creation interface', estimationHours: 20, workingHours: 0, status: 'New', storyId: stories[9].id, assignedTo: users[2].id }
    ]);
    console.log('✅ Created 20 tasks');

    // Create 20 logging hours
    const loggingHours = [];
    const startDate = new Date('2025-01-01');
    
    for (let i = 0; i < 20; i++) {
      const randomTask = tasks[Math.floor(Math.random() * tasks.length)];
      const randomUser = users[Math.floor(Math.random() * users.length)];
      const workDate = new Date(startDate);
      workDate.setDate(startDate.getDate() + Math.floor(Math.random() * 60)); // Random date within 60 days
      
      loggingHours.push({
        hours: Math.round((Math.random() * 8 + 0.5) * 2) / 2, // Random hours between 0.5 and 8.5, rounded to nearest 0.5
        date: workDate.toISOString().split('T')[0],
        taskId: randomTask.id,
        userId: randomUser.id
      });
    }

    await LoggingHour.bulkCreate(loggingHours);
    console.log('⏰ Created 20 logging hour entries');

    console.log('\n🎉 Database seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`   👥 Users: ${users.length}`);
    console.log(`   📁 Projects: ${projects.length}`);
    console.log(`   📝 Stories: ${stories.length}`);
    console.log(`   ✅ Tasks: ${tasks.length}`);
    console.log(`   ⏰ Logging Hours: ${loggingHours.length}`);

  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    await sequelize.close();
    console.log('🔐 Database connection closed');
  }
}

// Run the seeder
if (require.main === module) {
  seedDatabase();
}

module.exports = seedDatabase;
