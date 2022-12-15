const usuarios = require('../models').usuarios;
const materias = require('../models').materias;
const dictadoMateria = require('../models').dictadoMateria;
const cursadoMateria = require('../models').cursadoMateria;
const asistencia = require('../models').asistencia;
const horarios = require('../models').horario;
const validation = require("../utils/validationMethods");
const moment = require("moment");
const { sequelize, Sequelize } = require('../models');
const { QueryTypes } = require('sequelize');

exports.verMateriasAsignadas = async function (req, res) {

    let idUsuario = req.session.id_usuario;
    let materiaProfesorData = await dictadoMateria.findAll({
        where: { id_usuario: idUsuario },
        include: { model: materias }
    });
    res.render('Materias/verMateriasAsignadas', { materias: materiaProfesorData });
}
exports.validarAlumnosVista = async function (req, res) {
    let idMateria = req.params.idMateria;
    let materiaAlumnoRegistroData = await cursadoMateria.findAll({
        where: { id_materia: idMateria, habilitar_cursada: 0 },
        include: { model: usuarios, where: { ver_usuario: 1 } }
    });
    let materiaAlumnoRegistradosData = await cursadoMateria.findAll({
        where: { id_materia: idMateria, habilitar_cursada: 1 },
        include: { model: usuarios, where: { ver_usuario: 1 } }
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
    let materiasData = await dictadoMateria.findAll({ where: { id_usuario: idUsuario, id_materia: idMateria } });
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
    let bodyData = req.flash("body");
    let idMateria = req.params.idMateria;
    let idUsuario = req.session.id_usuario;
    let materiasData = await dictadoMateria.findAll({ where: { id_usuario: idUsuario, id_materia: idMateria } });
    if (materiasData != "") {
        let dias = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"];
        let activo = ["Sí", "No"];
        res.render('Horarios/agregarHorario', { mensaje: msj, dias, activo, idMateria: idMateria, body: bodyData[0] });
    }
    else {
        res.redirect("/home/verMateriasAsignadas");
    };

}
exports.agregarHorario = async function (req, res) {

    let body = req.body;
    let idMateria = req.params.idMateria;
    let idUsuario = req.session.id_usuario;
    let materiasData = await dictadoMateria.findAll({ where: { id_usuario: idUsuario, id_materia: idMateria } });
    if (materiasData != "") {
        if (!body.dia_cursado || !validation.isNumber(body.dia_cursado)) {
            return mensajeAgregarHorario(req, res, { mensaje: "El valor día de la semana no puede ser vacio", esError: true }, idMateria, body);
        }
        if (!body.hora_desde || !validation.isHour(body.hora_desde)) {
            return mensajeAgregarHorario(req, res, { mensaje: "El campo hora comienzo de clase no puede ser vacio.", esError: true }, idMateria, body);
        }
        if (!body.hora_hasta || !validation.isHour(body.hora_hasta)) {
            return mensajeAgregarHorario(req, res, { mensaje: "El campo hora finalización de clase no puede ser vacio.", esError: true }, idMateria, body);
        }
        if (!validation.isValidHour(body.hora_desde, body.hora_hasta)) {
            return mensajeAgregarHorario(req, res, { mensaje: "El horario valido es de 9am a 22pm.", esError: true }, idMateria, body);
        }
        if (!body.clase_activa || !validation.isNumber(body.clase_activa)) {
            return mensajeAgregarHorario(req, res, { mensaje: "Ingrese valor valido para dictado de clase.", esError: true }, idMateria, body);
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
                mensajeAgregarHorario(req, res, { mensaje: "Horario creada exitosamente.", esError: false }, idMateria, null);
            }
            catch (error) {
                res.status(400).send(error.message);
            }
        }
        else {
            return mensajeAgregarHorario(req, res, { mensaje: "Ya existe horario valido para este día.", esError: true }, idMateria, body);
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
    let materiasData = await dictadoMateria.findAll({ where: { id_usuario: idUsuario, id_materia: idMateria } });
    if (materiasData.length > 0) {
        let horarioExiste = await horarios.findOne({ where: { id_horario: idHorario, ver_horario: 1 } });
        if (horarioExiste != null) {
            let dias = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"];
            let activo = ["Sí", "No"];
            let msj = req.flash("mensaje");
            let bodyData = req.flash("body");
            if (validation.isNumber(idMateria) && validation.isNumber(idHorario)) {
                res.render('Horarios/modificarHorario', { mensaje: msj, horario: horarioExiste, idMateria: idMateria, dias: dias, activo: activo, body: bodyData[0] });
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
    let materiasData = await dictadoMateria.findAll({ where: { id_usuario: idUsuario, id_materia: idMateria } });
    if (materiasData.length > 0) {
        let horarioExiste = await horarios.findOne({ where: { id_horario: idHorario, ver_horario: 1 } });
        if (horarioExiste != null) {
            if (validation.isNumber(idMateria) && validation.isNumber(idHorario)) {
                if (!body.dia_cursado || !validation.isNumber(body.dia_cursado)) {
                    return mensajeModificarHorario(req, res, { mensaje: "El valor día de la semana no puede ser vacio", esError: true }, idMateria, idHorario, body);
                }

                if (!body.hora_desde || !validation.isHour(body.hora_desde)) {
                    return mensajeModificarHorario(req, res, { mensaje: "El campo hora comienzo de clase no puede ser vacio.", esError: true }, idMateria, idHorario, body);
                }
                if (!body.hora_hasta || !validation.isHour(body.hora_hasta)) {
                    return mensajeModificarHorario(req, res, { mensaje: "El campo hora finalización de clase no puede ser vacio.", esError: true }, idMateria, idHorario, body);
                }
                if (!validation.isValidHour(body.hora_desde, body.hora_hasta)) {
                    return mensajeModificarHorario(req, res, { mensaje: "El horario valido es de 9am a 22pm.", esError: true }, idMateria, idHorario, body);
                }
                if (!body.clase_activa || !validation.isNumber(body.clase_activa)) {
                    return mensajeModificarHorario(req, res, { mensaje: "Ingrese valor valido para dictado de clase.", esError: true }, idMateria, idHorario, body);
                }

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
                    mensajeModificarHorario(req, res, { mensaje: "Horario editado exitosamente.", esError: false }, idMateria, idHorario, null);
                }
                catch (error) {
                    res.status(400).send(error.message);
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
            let materiasData = await dictadoMateria.findAll({ where: { id_usuario: idUsuario, id_materia: idMateria } });
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
exports.consultarAsistenciaVista = async function (req, res) {
    let idMateria = req.params.idMateria;

    let asistenciaData = await asistencia.findAll({
        where: { id_materia: idMateria },
        include: { model: usuarios, where: { ver_usuario: 1 }, attributes: ['nombre_usuario', 'apellido_usuario', 'email_usuario'] },
        attributes: ['id_asistencia', 'id_materia', 'id_usuario', 'fecha_asistencia', 'hora_asistencia',],
        order: ['fecha_asistencia'],
    });

    let alumnosCursandoData = await cursadoMateria.findAll({
        where: { id_materia: idMateria, habilitar_cursada: 1 },
        include: { model: usuarios, where: { ver_usuario: 1 } },
    });

    let materiaData = await materias.findOne({ where: { id_materia: idMateria, ver_materia: 1 } });
    let horariosData = await horarios.findAll({ where: { id_materia: idMateria, ver_horario: 1, clase_activa: 1 } });
    let fechaInicio = moment(materiaData.fecha_inicio_cursada);
    let fechaFinCursada = moment(materiaData.fecha_fin_cursada);
    let fechaActual = moment();

    let fechasCursada = [];

    if (fechaActual.isBefore(fechaFinCursada, 'day')) {
        fechaFinCursada = fechaActual;
    }

    let diferencia = fechaFinCursada.diff(fechaInicio, 'days');


    for (let i = 0; i <= diferencia; i++) {
        for (let h = 0; h < horariosData.length; h++) {
            if (horariosData[h].dia_cursado == fechaInicio.isoWeekday()) {
                fechasCursada.push(fechaInicio.format('DD-MM-YY'));
                break;
            }
        }
        fechaInicio = fechaInicio.add(1, 'day');
    }

    let objetoAsistencia = [];

    for (let i = 0; i < alumnosCursandoData.length; i++) {
        let objeto = { nombre: alumnosCursandoData[i].usuario.nombre_usuario + ' ' + alumnosCursandoData[i].usuario.apellido_usuario, asistencia: [] };
        let asistencias = asistenciaData.filter(a => a.id_usuario == alumnosCursandoData[i].usuario.id_usuario);
        for (let e = 0; e < fechasCursada.length; e++) {
            let encontrado = false;
            for (let a = 0; a < asistencias.length; a++) {
                if (moment(asistencias[a].fecha_asistencia).format('DD-MM-YY') === fechasCursada[e]) {
                    encontrado = true;
                    break;
                }
            }
            objeto.asistencia.push(encontrado);

        }
        objetoAsistencia.push(objeto);
    }

    res.render('Asistencia/consultarAsistencia', { asistencias: objetoAsistencia, materia: materiaData, alumnosCursando: alumnosCursandoData, fechasCursadas: fechasCursada });

}
exports.verConflictosVista = async function (req, res) {
    let idUsuario = req.session.id_usuario;
    /*let horariosData = await horarios.findAll({
        include: { model: materias, where: { ver_materia: 1 } },
        where: { ver_horario: 1, clase_activa: 1 }
    });*/
    let horariosData = await sequelize.query(`SELECT * 
    FROM horarios h 
    JOIN materias m ON(h.id_materia=m.id_materia)
    JOIN dictadomateria dm ON(m.id_materia=dm.id_materia)
    WHERE ver_horario=1 AND clase_activa=1 AND ver_materia=1 AND id_usuario= ?`, { replacements: [idUsuario], type: QueryTypes.SELECT });

    let horariosGeneralData = await sequelize.query(`SELECT * 
     FROM horarios h 
     JOIN materias m ON(h.id_materia=m.id_materia)
     JOIN dictadomateria dm ON(m.id_materia=dm.id_materia)
     WHERE ver_horario=1 AND clase_activa=1 AND ver_materia=1 `, { type: QueryTypes.SELECT });

    let cursadoMateriaData = await cursadoMateria.findAll({
        include: { model: usuarios, where: { ver_usuario: 1 } },
        where: { habilitar_cursada: 1 }
    });
    let objetoHorarios = [];
    let objeto = { id_materia: '', nombre_materia: '', horario: '', dia: '', id_conflicto: '', nombre_conflicto: '', horario_conflicto: '' }
    for (let i = 0; i < horariosData.length; i++) {
        for (let e = 0; e < horariosGeneralData.length; e++) {
            if (horariosData[i].id_horario != horariosGeneralData[e].id_horario) {
                if (horariosData[i].dia_cursado == horariosGeneralData[e].dia_cursado) {

                    let horaDesdeI = moment(horariosData[i].hora_desde, 'h:mm');
                    let horaHastaI = moment(horariosData[i].hora_hasta, 'h:mm');
                    let horaDesdeE = moment(horariosGeneralData[e].hora_desde, 'h:mm');
                    let horaHastaE = moment(horariosGeneralData[e].hora_hasta, 'h:mm');

                    if (horaDesdeI.isBetween(horaDesdeE, horaHastaE, undefined, "[]") || horaHastaI.isBetween(horaDesdeE, horaHastaE, undefined, "[]") || horaHastaE.isBetween(horaDesdeI, horaHastaI, undefined, "[]") || horaDesdeE.isBetween(horaDesdeI, horaHastaI, undefined, "[]")) {

                        objeto = { id_materia: horariosData[i].id_materia, nombre_materia: horariosData[i].nombre_materia, horario: horariosData[i].hora_desde + '-' + horariosData[i].hora_hasta, dia: horariosData[i].dia_cursado, id_conflicto: horariosGeneralData[e].id_materia, nombre_conflicto: horariosGeneralData[e].nombre_materia, horario_conflicto: horariosGeneralData[e].hora_desde + '-' + horariosGeneralData[e].hora_hasta };


                        objetoHorarios.push(objeto);
                    }
                }
            }
        }
    }

    let usuarioConflicto = [];
    let objetoConflicto = { nombre_alumno: '', id_materia: '', nombre_materia: '', horario: '', nombre_conflicto: '', horario_conflicto: '', dia: '' }
    for (let i = 0; i < cursadoMateriaData.length; i++) {
        for (let x = 0; x < objetoHorarios.length; x++) {
            if (cursadoMateriaData[i].id_materia == objetoHorarios[x].id_materia) {
                objetoConflicto = { nombre_alumno: cursadoMateriaData[i].usuario.nombre_usuario + ' ' + cursadoMateriaData[i].usuario.apellido_usuario, id_materia: objetoHorarios[x].id_materia, nombre_materia: objetoHorarios[x].nombre_materia, horario: objetoHorarios[x].horario, nombre_conflicto: objetoHorarios[x].nombre_conflicto, horario_conflicto: objetoHorarios[x].horario_conflicto, dia: objetoHorarios[x].dia };
                usuarioConflicto.push(objetoConflicto);
            }
        }
    }
    const usuarioConflictoOrdenado = usuarioConflicto.sort((a, b) => {
        if (a.nombre_alumno < b.nombre_alumno) { return -1; }
        if (a.nombre_alumno > b.nombre_alumno) { return 1; }
        return 0;
    });
    res.render('Horarios/verConflictosProfesores', { conflictos: usuarioConflictoOrdenado, dias: ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"] });

}

function mensajeAgregarHorario(req, res, mensaje, materia, body) {
    req.flash('mensaje', mensaje);
    req.flash('body', body);
    res.redirect('/home/agregarHorario/' + materia);
}
function mensajeModificarHorario(req, res, mensaje, materia, horario, body) {
    req.flash('mensaje', mensaje);
    req.flash('body', body);
    res.redirect('/home/modificarHorario/' + materia + "/" + horario);
}