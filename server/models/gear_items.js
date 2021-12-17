'use strict';
module.exports = (sequelize, DataTypes) => {
  const gear_items = sequelize.define('gear_items', {
    gear_id: DataTypes.INTEGER,
    name: DataTypes.STRING,
    weight: DataTypes.INTEGER,
    condition: DataTypes.INTEGER,
    type: DataTypes.INTEGER,
    capacity: DataTypes.STRING
  }, {});
  gear_items.associate = function(models) {
    // associations can be defined here
  };
  return gear_items;
};