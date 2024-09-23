'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Branch extends Model {
    static associate(models) {
      Branch.belongsTo(models.Admin, { onDelete: 'cascade' })
      Branch.belongsTo(models.City, { foreignKey: 'city_id', onDelete: 'cascade' })
      Branch.hasMany(models.ProductBranch, { onDelete: 'cascade' })
    }
  }
  Branch.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      address: {
        type: DataTypes.STRING,
        allowNull: false
      },
      latitude: {
        type: DataTypes.DECIMAL,
        allowNull: false
      },
      latitude: {
        type: DataTypes.DOUBLE,
        allowNull: false
      },
      contactNumber: {
        type: DataTypes.DECIMAL,
        allowNull: false
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
      },
      isSuperStore: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
      },
      fullAddress: {
        type: DataTypes.STRING,
        allowNull: false
      },
      maxDeliveryDistance: {
        type: DataTypes.STRING,
        allowNull: false
      },
      province_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      city_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      isDeleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      }
    },
    {
      sequelize,
      modelName: 'Branch'
    }
  )
  return Branch
}
