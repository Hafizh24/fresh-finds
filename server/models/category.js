'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Category extends Model {
    static associate(models) {
      Category.hasMany(models.SubCategory, { onDelete: 'cascade' })
      Category.hasMany(models.Product, { onDelete: 'cascade' })
    }
  }
  Category.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false
      }
    },
    {
      sequelize,
      modelName: 'Category'
    }
  )
  return Category
}
