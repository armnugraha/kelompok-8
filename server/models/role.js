module.exports = (sequelize, DataTypes) => {
  const Role = sequelize.define('roles', {
    name: DataTypes.STRING
  });

  Role.associate = (models) => {
    // Todo.hasMany(models.TodoItem, {
    //   foreignKey: 'todoId',
    //   as: 'todoItems',
    // });
  };

  return Role;
};