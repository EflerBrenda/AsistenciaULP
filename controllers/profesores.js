const usuarios = require('../models').usuarios;
const materias = require('../models').materias;
const dictadoMateria = require('../models').dictadoMateria;
const cursadoMateria = require('../models').cursadoMateria;
const validation = require("../utils/validationMethods");
const { sequelize, Sequelize } = require('../models');


exports.validarAlumnosVista = async function (req, res) {
    let idMateria = req.params.id;
    let materiaAlumnoRegistroData = await cursadoMateria.findAll({
        where: { id_materia: idMateria, ver_cursadoMateria: 1, habilitar_cursada: 0, inhabilitar_cursada: 0 },
        include: { model: usuarios }
    });
    let materiaAlumnoRegistradosData = await cursadoMateria.findAll({
        where: { id_materia: idMateria, ver_cursadoMateria: 1, habilitar_cursada: 1 },
        include: { model: usuarios }
    });
    res.render('Materias/verRegistroAlumnos', { alumnosARegistrar: materiaAlumnoRegistroData, alumnosRegistrados: materiaAlumnoRegistradosData });
}
exports.validaAlumnoMateria = async function (req, res) {
    let idCursado = req.params.id;

    if (validation.isNumber(idCursado)) {
        let MateriaAlumnoData = await cursadoMateria.findAll({
            where: { id_cursadomateria: idCursado, ver_cursadoMateria: 1, habilitar_cursada: 1, inhabilitar_cursada: 0 },
        });
        if (MateriaAlumnoData.length === 0) {
            await sequelize.query('CALL EDITARCURSADOMATERIA(:IDCURSADO)',
                {
                    replacements: {
                        IDCURSADO: idCursado,
                    }
                });
            let materia = await cursadoMateria.findOne({
                where: { id_cursadomateria: idCursado, ver_cursadoMateria: 1 },
            });
        }
        res.redirect("/home/validarAlumnos/" + idCursado);// el problema es que no puedo redireccionar porque necesito idmateria
    }
    else {
        res.redirect("/home/verMateriasAsignadas");
    }

}
exports.rechazoAlumnoMateria = async function (req, res) {

}

exports.gestionHorarioVista = async function (req, res) { }

exports.consultarAsistenciaVista = async function (req, res) { }
exports.exportarAsistenciaVista = async function (req, res) { }

exports.agregarHorarioVista = async function (req, res) { }
exports.agregarHorario = async function (req, res) { }
exports.borrarHorario = async function (req, res) { }
exports.modificarHorarioVista = async function (req, res) { }
exports.modificarHorario = async function (req, res) { }

exports.exportarAsistencia = async function (req, res) { }

exports.verMateriasAsignadas = async function (req, res) {
    let idUsuario = req.session.id_usuario;
    let materiaProfesorData = await dictadoMateria.findAll({
        where: { id_usuario: idUsuario, ver_dictadomateria: 1 },
        include: { model: materias }
    });
    res.render('Materias/verMateriasAsignadas', { materias: materiaProfesorData });
}