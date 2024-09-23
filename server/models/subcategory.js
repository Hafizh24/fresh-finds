'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class SubCategory extends Model {
    static associate(models) {
      SubCategory.belongsTo(models.Category, { onDelete: 'cascade' })
      SubCategory.hasMany(models.Product, { onDelete: 'cascade' })
    }
  }
  SubCategory.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false
        // validate: {
        //   notNull: {
        //     msg: 'Name is required'
        //   },
        //   notEmpty: {
        //     msg: 'Name is required'
        //   }
        // }
      }
    },
    {
      sequelize,
      modelName: 'SubCategory'
    }
  )
  return SubCategory
}
