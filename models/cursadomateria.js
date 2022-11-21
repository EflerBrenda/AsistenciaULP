'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class cursadoMateria extends Model {

    static associate(models) {
      cursadoMateria.belongsTo(models.materias, { foreignKey: "id_materia" });
      cursadoMateria.belongsTo(models.usuarios, { foreignKey: "id_usuario" });
    }
  }
  cursadoMateria.init({
    id_cursadomateria: {
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
    condicion_alumno: DataTypes.INTEGER,
    habilitar_cursada: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'cursadoMateria',
    timestamps: false
  });
  return cursadoMateria;
};