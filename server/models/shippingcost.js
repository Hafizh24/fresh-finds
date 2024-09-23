'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class ShippingCost extends Model {
    static associate(models) {
      ShippingCost.belongsTo(models.Customer, { onDelete: 'cascade' })
    }
  }
  ShippingCost.init(
    {
      originCityId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      destinationCityId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      weight: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      courier: {
        type: DataTypes.STRING,
        allowNull: false
      },
      service: {
        type: DataTypes.STRING,
        allowNull: false
      },
      cost: {
        type: DataTypes.INTEGER,
        allowNull: false
      }
    },
    {
      sequelize,
      modelName: 'ShippingCost'
    }
  )
  return ShippingCost
}
