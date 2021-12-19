'use strict';
module.exports = (sequelize, DataTypes) => {
  const trainings = sequelize.define('trainings', {
    uuid: DataTypes.INTEGER,
    id_level: DataTypes.INTEGER,
    file: DataTypes.STRING,
    path: DataTypes.STRING
  }, {});
  trainings.associate = function(models) {
    // associations can be defined here
  };
  return trainings;
};