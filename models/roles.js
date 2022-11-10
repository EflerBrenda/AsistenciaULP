'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class roles extends Model {
    static associate(models) {

      roles.hasMany(models.usuarios, { foreignKey: "id_rol" });
    }
  }
  roles.init({
    id_rol: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    descripcion_rol: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'roles',
    timestamps: false,
  });
  return roles;
};