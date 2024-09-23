'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    static associate(models) {
      Order.belongsTo(models.Customer, { onDelete: 'cascade' })
      Order.hasMany(models.OrderDetail, { onDelete: 'cascade' })
    }
  }
  Order.init(
    {
      status: {
        type: DataTypes.ENUM,
        allowNull: false,
        values: ['waiting_for_payment', 'waiting_for_payment_confirmation', 'in_process', 'on_delivery', 'completed', 'canceled']
      },
      payment_method: {
        type: DataTypes.ENUM,
        allowNull: true,
        values: ['manual', 'automatic']
      },
      payment_proof: {
        type: DataTypes.STRING,
        allowNull: true
      },
      isPaid: {
        type: DataTypes.BOOLEAN,
        allowNull: false
      },
      redeem_voucher: {
        type: DataTypes.STRING,
        allowNull: true
      }
    },
    {
      sequelize,
      modelName: 'Order'
    }
  )
  return Order
}
