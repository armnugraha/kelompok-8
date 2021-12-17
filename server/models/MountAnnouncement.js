'use strict';
module.exports = (sequelize, DataTypes) => {
  const MountAnnouncement = sequelize.define('mount_announcements', {
    mount_id: DataTypes.INTEGER,
    title: DataTypes.STRING,
    note: DataTypes.STRING,
    start_date: DataTypes.DATEONLY,
    end_date: DataTypes.DATEONLY,
    // file: DataTypes.TEXT
  }, {});
  MountAnnouncement.associate = function(models) {
    // associations can be defined here
    MountAnnouncement.belongsTo(models.mounts, {
        foreignKey: 'mount_id'
    })
  };
  return MountAnnouncement;
};