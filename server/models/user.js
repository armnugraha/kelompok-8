'use strict'
module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('users', {
        name: DataTypes.STRING,
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                // isEmail:true
            },
            unique: {
                args: true,
                msg: 'Username sudah digunakan!'
            }
        },
        email:  {
            type: DataTypes.STRING,
            allowNull: true,
            validate: {
                isEmail:true
            },
            unique: {
                args: true,
                msg: 'Email sudah digunakan!'
            }
        },
        password: DataTypes.STRING,
        phone: DataTypes.INTEGER,
        gender: DataTypes.INTEGER,
        birth: DataTypes.DATEONLY,
        // height: DataTypes.INTEGER,
        // weight: DataTypes.INTEGER,
        role_id: DataTypes.INTEGER,
    }, {})
    User.associate = function (models) {
        User.belongsTo(models.roles, {
            foreignKey: 'role_id'
        })
    }
    return User
}
