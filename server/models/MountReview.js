'use strict';
module.exports = (sequelize, DataTypes) => {
  const MountReview = sequelize.define('mount_reviews', {
    mount_id: DataTypes.INTEGER,
    user_id: DataTypes.INTEGER,
    rate: DataTypes.INTEGER,
    desc: DataTypes.STRING
  }, {});
  MountReview.associate = function(models) {
    // associations can be defined here
      MountReview.belongsTo(models.users, {
          foreignKey: 'user_id'
      })
  };
  return MountReview;
};