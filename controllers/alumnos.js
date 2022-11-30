const { sequelize, Sequelize } = require('../models');
const cursadoMateria = require('../models').cursadoMateria;
const dictadoMateria = require('../models').dictadoMateria;
const horarios = require('../models').horario;
const materias = require('../models').materias;
const usuarios = require('../models').usuarios;
const validation = require("../utils/validationMethods");

exports.verMateriasDisponibles = async function (req, res) {
    let idUsuario = req.session.id_usuario;
    let materiasData = await cursadoMateria.findAll({
        include: { model: materias, right: true, required: false },
        where: { id_cursadomateria: null, '$materia.ver_materia$': true },
    });
    let materiasCursandoData = await cursadoMateria.findAll({
        where: { id_usuario: idUsuario, habilitar_cursada: 1 },
        include: { model: materias, where: { ver_materia: 1 } },
    });
    let materiasRevisionData = await cursadoMateria.findAll({
        where: { id_usuario: idUsuario, habilitar_cursada: 0 },
        include: { model: materias, where: { ver_materia: 1 } },
    });

    res.render("Asistencia/verMateriasDisponibles", { materias: materiasData, cursando: materiasCursandoData, revision: materiasRevisionData });
}
exports.nuevoRegistroMateria = async function (req, res) {
    let idMateria = req.params.idMateria;
    let idUsuario = req.session.id_usuario;
    if (validation.isNumber(idMateria)) {
        let materiaData = await materias.findOne({
            where: { id_materia: idMateria, ver_materia: 1 }
        });
        if (materiaData != []) {
            let materiasRevisionData = await cursadoMateria.findAll({
                where: { id_usuario: idUsuario, id_materia: idMateria, habilitar_cursada: 0 },
                include: { model: materias, where: { ver_materia: 1 } },
            });
            if (materiasRevisionData == "") {
                try {
                    await sequelize.query('CALL CREARCURSADOMATERIA(:IDUSUARIO,:IDMATERIA)',
                        {
                            replacements: {
                                IDMATERIA: idMateria,
                                IDUSUARIO: idUsuario,
                            }
                        });
                }
                catch (error) {
                    res.status(400).send(error.message);
                }
            }
        }
    }
    res.redirect("/home/verMateriasDisponibles");
}

exports.verMateriasRegistradas = async function (req, res) {
    let idUsuario = req.session.id_usuario;
    let materiaAlumnoData = await cursadoMateria.findAll({
        where: { id_usuario: idUsuario, habilitar_cursada: 1 },
        include: { model: materias },
    });
    res.render('Asistencia/verMateriasRegistradas', { materias: materiaAlumnoData });

}
exports.verMateriaVista = async function (req, res) {
    let idMateria = req.params.idMateria;
    let idUsuario = req.session.id_usuario;
    let materiasData = await cursadoMateria.findAll({ where: { id_usuario: idUsuario, id_materia: idMateria, habilitar_cursada: 1 } });
    if (materiasData != "") {
        let horariosData = await horarios.findAll({
            where: { id_materia: idMateria, ver_horario: 1 }
        });
        let materiaData = await materias.findOne({
            where: { id_materia: idMateria, ver_materia: 1 }
        });
        let profesoresData = await dictadoMateria.findAll({
            where: { id_materia: idMateria, ver_dictadoMateria: 1 },
            include: { model: usuarios, where: { id_rol: 2, ver_usuario: 1 } }
        });
        let profesores = "";
        if (profesoresData.length >= 1) {
            profesores = profesoresData.map(profesor => profesor.usuario.nombre_usuario + " " + profesor.usuario.apellido_usuario).toString() + ".";
        }
        else {
            profesores = "Sin asignar.";
        }
        let dias = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"];
        let activo = ["Sí", "No"];
        res.render('Asistencia/verMateria', { horarios: horariosData, materia: materiaData, dias: dias, activo: activo, profesores: profesores });
    }
    else {
        res.redirect("/home/verMateriasRegistradas");
    };

}

exports.nuevaAsistenciaVista = async function (req, res) {

}
exports.nuevaAsistencia = async function (req, res) {

}