'use strict';
module.exports = (sequelize, DataTypes) => {
  const schedules = sequelize.define('schedules', {
    id_mapel: DataTypes.INTEGER,
    day: DataTypes.INTEGER,
    start_time: DataTypes.TIME,
    end_time: DataTypes.TIME
  }, {});
  schedules.associate = function(models) {
    // associations can be defined here
  };
  return schedules;
};