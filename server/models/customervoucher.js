'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class CustomerVoucher extends Model {
    static associate(models) {
      CustomerVoucher.belongsTo(models.Customer, { onDelete: 'cascade' })
      CustomerVoucher.belongsTo(models.Voucher, { onDelete: 'cascade' })
    }
  }
  CustomerVoucher.init(
    {
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false
      }
    },
    {
      sequelize,
      modelName: 'CustomerVoucher'
    }
  )
  return CustomerVoucher
}
