const { DataTypes } = require('sequelize');
const { sequelize } = require('./sequelize');
const Project = require('./Project');

const Story = sequelize.define('Story', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  title: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT },
  iteration: { type: DataTypes.STRING, allowNull: true },
  status: {
    type: DataTypes.ENUM('New', 'inProgress', 'Cancelled', 'Closed'),
    allowNull: false,
    defaultValue: 'New'
  },
  StoryPoint: { type: DataTypes.INTEGER, allowNull: true },
  projectId: { type: DataTypes.INTEGER, references: { model: Project, key: 'id' } }
});

module.exports = Story;
