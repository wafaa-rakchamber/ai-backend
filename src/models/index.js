
const { sequelize } = require('./sequelize');

const User = require('./User');
const Project = require('./Project');
const Story = require('./Story');
const Task = require('./Task');
const LoggingHour = require('./LoggingHour');

// Associations
Project.hasMany(Story, { foreignKey: 'projectId' });
Story.belongsTo(Project, { foreignKey: 'projectId' });

Story.hasMany(Task, { foreignKey: 'storyId' });
Task.belongsTo(Story, { foreignKey: 'storyId' });

User.hasMany(Task, { foreignKey: 'assignedTo' });
Task.belongsTo(User, { foreignKey: 'assignedTo' });

Task.hasMany(LoggingHour, { foreignKey: 'taskId' });
LoggingHour.belongsTo(Task, { foreignKey: 'taskId' });

User.hasMany(LoggingHour, { foreignKey: 'userId' });
LoggingHour.belongsTo(User, { foreignKey: 'userId' });

module.exports = {
  sequelize,
  User,
  Project,
  Story,
  Task,
  LoggingHour
};
