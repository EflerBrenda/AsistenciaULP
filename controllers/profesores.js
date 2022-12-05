const usuarios = require('../models').usuarios;
const materias = require('../models').materias;
const dictadoMateria = require('../models').dictadoMateria;
const cursadoMateria = require('../models').cursadoMateria;
const horarios = require('../models').horario;
const validation = require("../utils/validationMethods");
const { sequelize, Sequelize } = require('../models');

exports.verMateriasAsignadas = async function (req, res) {

    let idUsuario = req.session.id_usuario;
    let materiaProfesorData = await dictadoMateria.findAll({
        where: { id_usuario: idUsuario, ver_dictadomateria: 1 },
        include: { model: materias }
    });
    res.render('Materias/verMateriasAsignadas', { materias: materiaProfesorData });
}
exports.validarAlumnosVista = async function (req, res) {
    let idMateria = req.params.idMateria;
    let materiaAlumnoRegistroData = await cursadoMateria.findAll({
        where: { id_materia: idMateria, habilitar_cursada: 0 },
        include: { model: usuarios }
    });
    let materiaAlumnoRegistradosData = await cursadoMateria.findAll({
        where: { id_materia: idMateria, habilitar_cursada: 1 },
        include: { model: usuarios }
    });
    res.render('Materias/verRegistroAlumnos', { alumnosARegistrar: materiaAlumnoRegistroData, alumnosRegistrados: materiaAlumnoRegistradosData });
}
exports.validaAlumnoMateria = async function (req, res) {

    let idCursado = req.params.idCursado;

    if (validation.isNumber(idCursado)) {
        let MateriaAlumnoData = await cursadoMateria.findAll({
            where: { id_cursadoMateria: idCursado, habilitar_cursada: 1 },
        });
        if (MateriaAlumnoData.length === 0) {
            await sequelize.query('CALL ACEPTARCURSADOMATERIA(:IDCURSADO)',
                {
                    replacements: {
                        IDCURSADO: idCursado,
                    }
                });

        }
        let materia = await cursadoMateria.findOne({ where: { id_cursadoMateria: idCursado } });

        res.redirect("/home/validarAlumnos/" + materia.id_materia);
    }
    else {
        res.redirect("/home/verMateriasAsignadas");
    }

}
exports.rechazoAlumnoMateria = async function (req, res) {
    let idCursado = req.params.idCursado;
    if (validation.isNumber(idCursado)) {
        let MateriaCursadoData = await cursadoMateria.findOne({
            where: { id_cursadoMateria: idCursado },
        });
        if (MateriaCursadoData != "") {
            try {
                await sequelize.query('CALL RECHAZARCURSADOMATERIA(:IDCURSADO)',
                    {
                        replacements: {
                            IDCURSADO: idCursado,
                        }
                    });
                res.redirect("/home/validarAlumnos/" + MateriaCursadoData.id_materia);
            }
            catch (error) {
                res.status(400).send(error.message);
            }
        }
        else { res.redirect("/home/verMateriasAsignadas"); }
    }
    else {
        res.redirect("/home/verMateriasAsignadas");
    }

}
exports.gestionHorarioVista = async function (req, res) {
    let idMateria = req.params.idMateria;
    let idUsuario = req.session.id_usuario;
    let materiasData = await dictadoMateria.findAll({ where: { id_usuario: idUsuario, id_materia: idMateria, ver_dictadomateria: 1 } });
    if (materiasData != "") {
        let horariosData = await horarios.findAll({
            where: { id_materia: idMateria, ver_horario: 1 }
        });
        let materia = await materias.findOne({
            where: { id_materia: idMateria }
        });
        let dias = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"];
        let activo = ["Sí", "No"];
        res.render('Horarios/gestionHorarios', { horarios: horariosData, materia: materia, dias: dias, activo: activo });
    }
    else {
        res.redirect("/home/verMateriasAsignadas");
    };
}
exports.agregarHorarioVista = async function (req, res) {
    let msj = req.flash("mensaje");
    let idMateria = req.params.idMateria;
    let idUsuario = req.session.id_usuario;
    let materiasData = await dictadoMateria.findAll({ where: { id_usuario: idUsuario, id_materia: idMateria, ver_dictadomateria: 1 } });
    if (materiasData != "") {
        res.render('Horarios/agregarHorario', { mensaje: msj, idMateria: idMateria });
    }
    else {
        res.redirect("/home/verMateriasAsignadas");
    };

}
exports.agregarHorario = async function (req, res) {

    let body = req.body;
    let idMateria = req.params.idMateria;
    let idUsuario = req.session.id_usuario;
    let materiasData = await dictadoMateria.findAll({ where: { id_usuario: idUsuario, id_materia: idMateria, ver_dictadomateria: 1 } });
    if (materiasData != "") {
        if (!body.dia_cursado || !validation.isNumber(body.dia_cursado)) {
            return mensajeAgregarHorario(req, res, { mensaje: "El valor día de la semana no puede ser vacio", esError: true }, idMateria);
        }
        if (!body.hora_desde || !validation.isHour(body.hora_desde)) {
            return mensajeAgregarHorario(req, res, { mensaje: "El campo hora comienzo de clase no puede ser vacio.", esError: true }, idMateria);
        }
        if (!body.hora_hasta || !validation.isHour(body.hora_hasta)) {
            return mensajeAgregarHorario(req, res, { mensaje: "El campo hora finalización de clase no puede ser vacio.", esError: true }, idMateria);
        }
        if (!validation.isValidHour(body.hora_desde, body.hora_hasta)) {
            return mensajeAgregarHorario(req, res, { mensaje: "El horario valido es de 9am a 22pm.", esError: true }, idMateria);
        }
        if (!body.clase_activa || !validation.isNumber(body.clase_activa)) {
            return mensajeAgregarHorario(req, res, { mensaje: "Ingrese valor valido para dictado de clase.", esError: true }, idMateria);
        }
        let horarioExistente = await horarios.findAll({ where: { id_materia: idMateria, dia_cursado: body.dia_cursado, hora_desde: body.hora_desde, hora_hasta: body.hora_hasta, ver_horario: 1 } });
        if (horarioExistente == "") {

            try {

                await sequelize.query('CALL CREARHORARIO(:DIA,:HORADESDE,:HORAHASTA,:ACTIVO,:IDMATERIA)',
                    {
                        replacements: {
                            DIA: body.dia_cursado,
                            HORADESDE: body.hora_desde,
                            HORAHASTA: body.hora_hasta,
                            ACTIVO: body.clase_activa,
                            IDMATERIA: idMateria,
                        }
                    });
                mensajeAgregarHorario(req, res, { mensaje: "Horario creada exitosamente.", esError: false }, idMateria);
            }
            catch (error) {
                res.status(400).send(error.message);
            }
        }
        else {
            return mensajeAgregarHorario(req, res, { mensaje: "Ya existe horario valido para este día.", esError: true }, idMateria);
        }

    }
    else {
        res.redirect("/home/verMateriasAsignadas");
    };
}
exports.modificarHorarioVista = async function (req, res) {
    let idMateria = req.params.idMateria;
    let idHorario = req.params.idHorario;
    let idUsuario = req.session.id_usuario;
    let materiasData = await dictadoMateria.findAll({ where: { id_usuario: idUsuario, id_materia: idMateria, ver_dictadomateria: 1 } });
    if (materiasData != "") {
        let horarioExiste = await horarios.findOne({ where: { id_horario: idHorario, ver_horario: 1 } });
        if (horarioExiste != null) {
            let dias = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"];
            let activo = ["Sí", "No"];
            let msj = req.flash("mensaje");
            if (validation.isNumber(idMateria) && validation.isNumber(idHorario)) {
                let horarioData = await horarios.findOne({ where: { ver_horario: 1, id_horario: idHorario } });
                if (horarioData != null) {
                    res.render('Horarios/modificarHorario', { mensaje: msj, horario: horarioData, idMateria: idMateria, dias: dias, activo: activo });
                }
                else {
                    res.redirect("/home/gestionHorario/" + idMateria);
                }
            }
            else {
                res.redirect("/home/gestionHorario/" + idMateria);
            }
        }
        else {
            res.redirect("/home/gestionHorario/" + idMateria);
        }
    }
    else {
        res.redirect("/home/verMateriasAsignadas");
    }
}
exports.modificarHorario = async function (req, res) {
    let body = req.body;
    let idMateria = req.params.idMateria;
    let idHorario = req.params.idHorario;
    let idUsuario = req.session.id_usuario;
    let materiasData = await dictadoMateria.findAll({ where: { id_usuario: idUsuario, id_materia: idMateria, ver_dictadomateria: 1 } });
    if (materiasData != "") {
        let horarioExiste = await horarios.findOne({ where: { id_horario: idHorario, ver_horario: 1 } });
        if (horarioExiste != null) {
            if (validation.isNumber(idMateria) && validation.isNumber(idHorario)) {
                if (!body.dia_cursado || !validation.isNumber(body.dia_cursado)) {
                    return mensajeModificarHorario(req, res, { mensaje: "El valor día de la semana no puede ser vacio", esError: true }, idMateria, idHorario);
                }

                if (!body.hora_desde || !validation.isHour(body.hora_desde)) {
                    return mensajeModificarHorario(req, res, { mensaje: "El campo hora comienzo de clase no puede ser vacio.", esError: true }, idMateria, idHorario);
                }
                if (!body.hora_hasta || !validation.isHour(body.hora_hasta)) {
                    return mensajeModificarHorario(req, res, { mensaje: "El campo hora finalización de clase no puede ser vacio.", esError: true }, idMateria, idHorario);
                }
                if (!validation.isValidHour(body.hora_desde, body.hora_hasta)) {
                    return mensajeModificarHorario(req, res, { mensaje: "El horario valido es de 9am a 22pm.", esError: true }, idMateria, idHorario);
                }
                if (!body.clase_activa || !validation.isNumber(body.clase_activa)) {
                    return mensajeModificarHorario(req, res, { mensaje: "Ingrese valor valido para dictado de clase.", esError: true }, idMateria, idHorario);
                }
                let horarioExistente = await horarios.findAll({ where: { id_materia: idMateria, dia_cursado: body.dia_cursado, hora_desde: body.hora_desde, hora_hasta: body.hora_hasta, ver_horario: 1 } });
                if (horarioExistente == "") {
                    try {

                        await sequelize.query('CALL EDITARHORARIO(:IDHORARIO,:DIA,:HORADESDE,:HORAHASTA,:ACTIVO)',
                            {
                                replacements: {
                                    DIA: body.dia_cursado,
                                    HORADESDE: body.hora_desde,
                                    HORAHASTA: body.hora_hasta,
                                    ACTIVO: body.clase_activa,
                                    IDHORARIO: idHorario,
                                }
                            });
                        mensajeModificarHorario(req, res, { mensaje: "Horario editado exitosamente.", esError: false }, idMateria, idHorario);
                    }
                    catch (error) {
                        res.status(400).send(error.message);
                    }
                }
                else {
                    return mensajeModificarHorario(req, res, { mensaje: "Ya existe horario valido para este día.", esError: true }, idMateria, idHorario);
                }
            }
            else {
                res.redirect("/home/verMateriasAsignadas");
            }
        }
        else {
            res.redirect("/home/verMateriasAsignadas");
        }

    }
    else {
        res.redirect("/home/verMateriasAsignadas");
    }
}
exports.borrarHorario = async function (req, res) {
    let idHorario = req.params.idHorario;
    let idMateria = req.params.idMateria;
    let idUsuario = req.session.id_usuario;

    if (validation.isNumber(idMateria)) {
        if (validation.isNumber(idHorario)) {
            let materiasData = await dictadoMateria.findAll({ where: { id_usuario: idUsuario, id_materia: idMateria, ver_dictadomateria: 1 } });
            if (materiasData != "") {
                let horarioExiste = await horarios.findOne({ where: { id_horario: idHorario, ver_horario: 1 } });
                if (horarioExiste != "") {
                    try {

                        await sequelize.query('CALL BORRARHORARIO(:IDHORARIO)',
                            {
                                replacements: {
                                    IDHORARIO: idHorario,
                                }
                            });

                    }
                    catch (error) {
                        res.status(400).send(error.message);
                    }
                    res.redirect("/home/gestionHorario/" + idMateria);
                }
                else {
                    res.redirect("/home/gestionHorario/" + idMateria);
                }
            }
            else {
                res.redirect("/home/gestionHorario/" + idMateria);
            }
        }
        else {
            res.redirect("/home/verMateriasAsignadas");
        }
    }
    else {
        res.redirect("/home/verMateriasAsignadas");
    }
}

exports.consultarAsistenciaVista = async function (req, res) { }
exports.exportarAsistenciaVista = async function (req, res) { }
exports.exportarAsistencia = async function (req, res) { }

function mensajeAgregarHorario(req, res, mensaje, materia) {
    req.flash('mensaje', mensaje);
    res.redirect('/home/agregarHorario/' + materia);
}
function mensajeModificarHorario(req, res, mensaje, materia, horario) {
    req.flash('mensaje', mensaje);
    res.redirect('/home/modificarHorario/' + materia + "/" + horario);
}