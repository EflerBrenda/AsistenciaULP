'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class dictadoMateria extends Model {

    static associate(models) {
      dictadoMateria.belongsTo(models.materias, { foreignKey: "id_materia" });
      dictadoMateria.belongsTo(models.usuarios, { foreignKey: "id_usuario" });
    }
  }
  dictadoMateria.init({
    id_dictadoMateria: {
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

  }, {
    sequelize,
    modelName: 'dictadoMateria',
    timestamps: false,
  });
  return dictadoMateria;
};