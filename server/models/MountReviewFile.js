'use strict';
module.exports = (sequelize, DataTypes) => {
  const MountReviewFile = sequelize.define('mount_review_files', {
    mount_id: DataTypes.INTEGER,
    file: DataTypes.TEXT
  }, {});
  MountReviewFile.associate = function(models) {
    // associations can be defined here
  };
  return MountReviewFile;
};