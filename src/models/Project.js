const { DataTypes } = require('sequelize');
const { sequelize } = require('./sequelize');

const Project = sequelize.define('Project', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT },
  startDate: { type: DataTypes.DATEONLY, allowNull: true },
  deadLine: { type: DataTypes.DATEONLY, allowNull: true },
  status: {
    type: DataTypes.ENUM('New', 'inProgress', 'Closed', 'Done', 'postpone'),
    allowNull: false,
    defaultValue: 'New'
  }
});

module.exports = Project;
