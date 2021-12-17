'use strict';
module.exports = (sequelize, DataTypes) => {
  const outdoor_gears = sequelize.define('outdoor_gears', {
    mount_id: DataTypes.INTEGER,
    // name: DataTypes.STRING,
    gear_id: DataTypes.INTEGER
  }, {});
  outdoor_gears.associate = function(models) {
    // associations can be defined here
    outdoor_gears.belongsTo(models.gears, {
        foreignKey: 'gear_id'
    })
  };
  return outdoor_gears;
};