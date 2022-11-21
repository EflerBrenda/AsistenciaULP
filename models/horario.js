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
    dia_cursado: DataTypes.INTEGER,
    hora_desde: DataTypes.STRING,
    hora_hasta: DataTypes.STRING,
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