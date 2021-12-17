'use strict';
module.exports = (sequelize, DataTypes) => {
  const gears = sequelize.define('gears', {
    name: DataTypes.STRING
  }, {});
  gears.associate = function(models) {
    // associations can be defined here
    gears.hasMany(models.gear_items, {
        foreignKey: 'gear_id'
    })
  };
  return gears;
};