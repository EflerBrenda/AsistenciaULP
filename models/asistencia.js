'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class asistencia extends Model {

    static associate(models) {
      /*asistencia.hasMany(models.materias, { foreignKey: "id_materia" });
      asistencia.hasMany(models.usuarios, { foreignKey: "id_usuario" });*/
      asistencia.belongsTo(models.materias, { foreignKey: "id_materia" });
      asistencia.belongsTo(models.usuarios, { foreignKey: "id_usuario" });
    }
  }
  asistencia.init({
    id_asistencia: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    id_materia: {
      type: DataTypes.INTEGER,
      references: {
        model: "materias",
        key: "id_materia",
      }
    },
    id_usuario: {
      type: DataTypes.INTEGER,
      references: {
        model: "usuarios",
        key: "id_usuario",
      }
    },
    fecha_asistencia: DataTypes.DATEONLY,
    hora_asistencia: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'asistencia',
    timestamps: false
  });
  return asistencia;
};