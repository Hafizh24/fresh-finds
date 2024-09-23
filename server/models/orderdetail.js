'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class OrderDetail extends Model {
    static associate(models) {
      OrderDetail.belongsTo(models.Order, { onDelete: 'cascade' })
      OrderDetail.belongsTo(models.Product, { onDelete: 'cascade' })
    }
  }
  OrderDetail.init(
    {
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      total: {
        type: DataTypes.INTEGER,
        allowNull: false
      }
    },
    {
      sequelize,
      modelName: 'OrderDetail'
    }
  )
  return OrderDetail
}
