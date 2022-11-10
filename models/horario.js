'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class horario extends Model {

    static associate(models) {
      horario.hasMany(models.materias, { foreignKey: "id_materia" });
    }
  }
  horario.init({
    id_horario: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    dia_cursado: DataTypes.DATE,
    hora_desde: DataTypes.DATE,
    hora_hasta: DataTypes.DATE,
    clase_activa: DataTypes.BOOLEAN,
    id_materia: DataTypes.INTEGER,
    ver_horario: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'horario',
    timestamps: false
  });
  return horario;
};