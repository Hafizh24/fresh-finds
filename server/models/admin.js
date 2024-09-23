'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Admin extends Model {
    static associate(models) {
      Admin.hasMany(models.Branch, { onDelete: 'cascade' })
    }
  }
  Admin.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: 'username'
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: 'email'
      },
      password: {
        type: DataTypes.STRING,
        allowNull: true
      },
      verification_code: {
        type: DataTypes.STRING,
        allowNull: false
      },
      profile_picture: {
        type: DataTypes.STRING
      },
      isVerified: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      isSuperAdmin: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
      }
    },
    {
      sequelize,
      modelName: 'Admin'
    }
  )
  return Admin
}
