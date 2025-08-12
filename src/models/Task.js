const { DataTypes } = require('sequelize');
const { sequelize } = require('./sequelize');
const Story = require('./Story');
const User = require('./User');

const Task = sequelize.define('Task', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  title: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT },
  estimationHours: { type: DataTypes.FLOAT, allowNull: true },
  workingHours: { type: DataTypes.FLOAT, allowNull: true },
  status: {
    type: DataTypes.ENUM('New', 'inProgress', 'Cancelled', 'Closed'),
    allowNull: false,
    defaultValue: 'New'
  },
  storyId: { type: DataTypes.INTEGER, references: { model: Story, key: 'id' } },
  assignedTo: { type: DataTypes.INTEGER, references: { model: User, key: 'id' } }
});

module.exports = Task;
