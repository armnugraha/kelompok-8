'use strict';
module.exports = (sequelize, DataTypes) => {
  const MountFile = sequelize.define('mount_files', {
    mount_id: DataTypes.INTEGER,
    file: DataTypes.TEXT
  }, {});
  MountFile.associate = function(models) {
    // associations can be defined here
  };
  return MountFile;
};