'use strict';
const {
  Model,
  Todo
} = require('sequelize');
// const Todo = require('./todo');
module.exports = (sequelize, DataTypes) => {
  class Task extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.Task.belongsTo(models.Todo, { // Une tâche ne peut appartenir qu'à une seule liste
        foreignKey: {
          allowNull: false,
          name: 'TodoId',
          key: 'id'
        }
      }) 
    }
  }
  Task.init({
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
    },
    TodoId: {
      allowNull: false,
      foreignKey: true,
      type: DataTypes.INTEGER,
    },
    taskName: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Task',
  });
  return Task;
};