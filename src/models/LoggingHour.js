const { DataTypes } = require('sequelize');
const { sequelize } = require('./sequelize');
const Task = require('./Task');
const User = require('./User');

const LoggingHour = sequelize.define('LoggingHour', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  hours: { type: DataTypes.FLOAT, allowNull: false },
  date: { type: DataTypes.DATEONLY, allowNull: false },
  taskId: { type: DataTypes.INTEGER, references: { model: Task, key: 'id' } },
  userId: { type: DataTypes.INTEGER, references: { model: User, key: 'id' } }
});

module.exports = LoggingHour;
