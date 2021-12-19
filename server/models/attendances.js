'use strict';
module.exports = (sequelize, DataTypes) => {
  const attendances = sequelize.define('attendances', {
    id_siswa: DataTypes.INTEGER,
    created_at: DataTypes.DATE
  }, {});
  attendances.associate = function(models) {
    // associations can be defined here
  };
  return attendances;
};