'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class ProductBranch extends Model {
    static associate(models) {
      ProductBranch.belongsTo(models.Product, { onDelete: 'cascade' })
      ProductBranch.belongsTo(models.Branch, { onDelete: 'cascade' })
      ProductBranch.hasMany(models.Discount, { onDelete: 'cascade' })
      ProductBranch.hasMany(models.StockHistory, { onDelete: 'cascade' })
    }
  }
  ProductBranch.init(
    {
      stock: {
        type: DataTypes.INTEGER,
        allowNull: false
      }
    },
    {
      sequelize,
      modelName: 'ProductBranch'
    }
  )
  return ProductBranch
}
