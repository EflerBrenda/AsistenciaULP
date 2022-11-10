'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class usuarios extends Model {
    static associate(models) {
      usuarios.belongsTo(models.roles, { foreignKey: "id_rol" });
      usuarios.belongsToMany(models.materias, { through: "dictadomateria" });
      usuarios.belongsToMany(models.materias, { through: "cursadomateria" });
    }
  }
  usuarios.init({
    id_usuario: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nombre_usuario: DataTypes.STRING,
    apellido_usuario: DataTypes.STRING,
    email_usuario: DataTypes.STRING,
    password_usuario: DataTypes.STRING,
    id_rol: DataTypes.STRING,
    ver_usuario: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'usuarios',
    timestamps: false,
  });
  return usuarios;
};