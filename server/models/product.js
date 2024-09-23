'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    static associate(models) {
      Product.hasMany(models.ProductImage, { onDelete: 'cascade' })
      Product.hasMany(models.ProductBranch, { onDelete: 'cascade' })
      Product.hasMany(models.OrderDetail, { onDelete: 'cascade' })
      Product.belongsTo(models.Category, { onDelete: 'cascade' })
      Product.belongsTo(models.SubCategory, { onDelete: 'cascade' })
    }
  }
  Product.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      price: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      weight: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      isDisabled: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      isDeleted: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
      }
    },
    {
      sequelize,
      modelName: 'Product'
    }
  )
  return Product
}
