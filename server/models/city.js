'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class City extends Model {
    static associate(models) {
      City.belongsTo(models.Province, { foreignKey: 'province_id', onDelete: 'cascade' })
      City.hasMany(models.Branch, { foreignKey: 'city_id', onDelete: 'cascade' })
      City.hasMany(models.CustomerAddress, { foreignKey: 'city_id', onDelete: 'cascade' })
    }
  }
  City.init(
    {
      city_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      province_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      type: {
        type: DataTypes.STRING
      },
      postal_code: {
        type: DataTypes.STRING,
        allowNull: false
      }
    },
    {
      sequelize,
      modelName: 'City'
    }
  )
  return City
}
