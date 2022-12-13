const { sequelize, Sequelize } = require('../models');
const cursadoMateria = require('../models').cursadoMateria;
const dictadoMateria = require('../models').dictadoMateria;
const horarios = require('../models').horario;
const materias = require('../models').materias;
const usuarios = require('../models').usuarios;
const validation = require("../utils/validationMethods");
const moment = require("moment");

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
            where: { id_materia: idMateria, clase_activa: 1, ver_horario: 1 }
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
        let diaActual = moment().isoWeekday();
        let h = new Date();
        let horaActual = moment(h.toLocaleTimeString(), "h:mm");
        res.render('Asistencia/verMateria', { horarios: horariosData, materia: materiaData, dias: dias, activo: activo, profesores: profesores, diaActual: diaActual, horaActual: horaActual });
    }
    else {
        res.redirect("/home/verMateriasRegistradas");
    };

}
exports.nuevaAsistencia = async function (req, res) {
    let idMateria = req.params.idMateria;
    let idHorario = req.params.idHorario;
    let idUsuario = req.session.id_usuario;

    if (validation.isNumber(idMateria)) {
        let materiasCursandoData = await cursadoMateria.findOne({
            where: { id_usuario: idUsuario, id_materia: idMateria, habilitar_cursada: 1 },
            include: { model: materias, where: { id_materia: idMateria, ver_materia: 1 }, include: { model: horarios, where: { id_horario: idHorario, id_materia: idMateria, clase_activa: 1, ver_horario: 1 } } },
        });
        if (materiasCursandoData != "") {
            let h = new Date();
            let horaActual = moment(h.toLocaleTimeString(), "h:mm");
            let horaCursado = moment(materiasCursandoData.materia.horarios[0].hora_desde, "h:mm");
            let duration = moment.duration(horaActual.diff(horaCursado));
            let minutosPasados = duration.asMinutes();
            if (minutosPasados <= 30 && minutosPasados >= 0) {
                let hora = horaActual.hour() + ':' + horaActual.minutes();
                try {
                    await sequelize.query('CALL CREARASISTENCIA(:IDUSUARIO,:IDMATERIA,:HORAASISTENCIA)',
                        {
                            replacements: {
                                IDUSUARIO: idUsuario,
                                IDMATERIA: idMateria,
                                HORAASISTENCIA: hora,
                            }
                        });
                    res.redirect('/home/verMateria/' + idMateria);
                }
                catch (error) {
                    res.status(400).send(error.message);
                }
            }
            else {
                res.redirect('/home/verMateria/' + idMateria);
            }
        }
        else {
            res.redirect('/home/verMateria/' + idMateria);
        }
    }
    else {
        res.redirect('/home/verMateriasRegistradas');
    }
}