'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Province extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Province.hasMany(models.City, { foreignKey: 'province_id', onDelete: 'cascade' })
    }
  }
  Province.init(
    {
      province_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false
      }
    },
    {
      sequelize,
      modelName: 'Province'
    }
  )
  return Province
}
