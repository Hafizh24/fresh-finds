'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Discount extends Model {
    static associate(models) {
      Discount.belongsTo(models.ProductBranch, { onDelete: 'cascade' })
    }
  }
  Discount.init(
    {
      value: {
        type: DataTypes.ENUM,
        values: ['percentage', 'nominal'],
        allowNull: false
      },
      type: {
        type: DataTypes.ENUM,
        values: ['regular', 'buy1get1', 'minimum_purchase'],
        allowNull: false
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
      },
      difference: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      start_date: {
        type: DataTypes.DATE,
        allowNull: true
      },
      end_date: {
        type: DataTypes.DATE,
        allowNull: true
      }
    },
    {
      sequelize,
      modelName: 'Discount'
    }
  )
  return Discount
}
