'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class asistencia extends Model {

    static associate(models) {
      asistencia.hasMany(models.materias, { foreignKey: "id_materia" });
      asistencia.hasMany(models.usuarios, { foreignKey: "id_usuario" });
    }
  }
  asistencia.init({
    id_asistencia: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    id_usuario: DataTypes.INTEGER,
    id_materia: DataTypes.INTEGER,
    fecha_asistencia: DataTypes.STRING,
    hora_asistencia: DataTypes.DATE,
  }, {
    sequelize,
    modelName: 'asistencia',
    timestamps: false
  });
  return asistencia;
};