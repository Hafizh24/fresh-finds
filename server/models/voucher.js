'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Voucher extends Model {
    static associate(models) {
      Voucher.hasMany(models.CustomerVoucher, { onDelete: 'cascade' })
    }
  }
  Voucher.init(
    {
      code: {
        type: DataTypes.STRING,
        allowNull: false
      },
      start_date: {
        type: DataTypes.DATE,
        allowNull: true
      },
      end_date: {
        type: DataTypes.DATE,
        allowNull: true
      },
      type: {
        type: DataTypes.ENUM,
        allowNull: false,
        values: ['product', 'shipping_cost', 'referral_code']
      },
      value: {
        type: DataTypes.ENUM,
        allowNull: false,
        values: ['percentage', 'nominal']
      },
      amount: {
        type: DataTypes.FLOAT,
        allowNull: false
      },
      min_purchase_amount: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      max_discount: {
        type: DataTypes.INTEGER,
        allowNull: true
      }
    },
    {
      sequelize,
      modelName: 'Voucher'
    }
  )
  return Voucher
}
