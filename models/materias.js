'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class materias extends Model {
    static associate(models) {
      materias.belongsToMany(models.usuarios, { through: "dictadomateria" });
      materias.belongsToMany(models.usuarios, { through: "cursadomateria" });
      materias.belongsToMany(models.usuarios, { through: "asistencia" });
      materias.hasMany(models.horario, { foreignKey: "id_materia" });
    }
  }
  materias.init({
    id_materia: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nombre_materia: DataTypes.STRING,
    fecha_inicio_cursada: DataTypes.DATE,
    fecha_fin_cursada: DataTypes.DATE,
    ver_materia: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'materias',
    timestamps: false,
  });
  return materias;
};