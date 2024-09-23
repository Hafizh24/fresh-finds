'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Customer extends Model {
    static associate(models) {
      Customer.hasMany(models.CustomerAddress, { onDelete: 'cascade' })
      Customer.hasMany(models.CustomerVoucher, { onDelete: 'cascade' })
      Customer.hasMany(models.Order, { onDelete: 'cascade' })
      Customer.hasMany(models.ShippingCost, { onDelete: 'cascade' })
    }
  }
  Customer.init(
    {
      firstname: {
        type: DataTypes.STRING,
        allowNull: false
      },
      lastname: {
        type: DataTypes.STRING,
        allowNull: true
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
      lastPasswordReset: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: null
      },
      profile_picture: {
        type: DataTypes.STRING,
        allowNull: true
      },
      phoneNumber: {
        type: DataTypes.STRING,
        allowNull: true
      },
      gender: {
        type: DataTypes.STRING,
        allowNull: true
      },
      referral_code: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: 'referral_code'
      },
      isVerified: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      verificationSentAt: {
        type: DataTypes.DATE,
        defaultValue: null
      },
      isDeleted: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      socialRegister: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      firebaseUID: {
        type: DataTypes.STRING,
        allowNull: true
      }
    },
    {
      sequelize,
      modelName: 'Customer'
    }
  )
  return Customer
}
