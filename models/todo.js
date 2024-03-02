'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Todo extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.Todo.belongsTo(models.User, {
        foreignKey: {
          allowNull: false,
          name: 'UserId',
          key: 'id'
        }
      }) // Une liste ne peut appartenir qu'à un seule utilisateur
    }
  }

  Todo.init({
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.INTEGER,
      autoIncrement: true,
    },
    UserId: {
      allowNull: false,
      foreignKey: true,
      type: DataTypes.INTEGER,
    },
    todoName: {
      allowNull: false,
      type: DataTypes.STRING,
    }
  }, {
    sequelize,
    modelName: 'Todo',
  });
  return Todo;
};