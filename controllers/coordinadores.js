const { sequelize, Sequelize } = require('../models');
const bcrypt = require("bcrypt");
const moment = require("moment");
const validation = require("../utils/validationMethods");
const usuarios = require('../models').usuarios;
const roles = require('../models').roles;
const materias = require('../models').materias;
const dictadoMateria = require('../models').dictadoMateria;
const cursadoMateria = require('../models').cursadoMateria;
const asistencia = require('../models').asistencia;
const horarios = require('../models').horario;
const { QueryTypes } = require('sequelize');


//USUARIOS

exports.nuevoUsuario = async function (req, res) {
    let body = req.body;
    let usuario = await usuarios.findOne({ where: { email_usuario: body.email } });
    if (!usuario) {
        if (!validation.isOnlyText(body.nombre)) {
            return mensajeRegistroUsuario(req, res, { mensaje: "El campo nombre es incorrecto.", esError: true }, body);
        }
        if (!validation.isOnlyText(body.apellido)) {
            return mensajeRegistroUsuario(req, res, { mensaje: "El campo apellido es incorrecto.", esError: true }, body);
        }
        if (!validation.isNumber(body.id_rol)) {
            return mensajeRegistroUsuario(req, res, { mensaje: "El rol es incorrecto.", esError: true }, body);
        }
        if (!validation.isEmail(body.email)) {
            return mensajeRegistroUsuario(req, res, { mensaje: "El campo email es incorrecto.", esError: true }, body);
        }
        if (!body.password1) {
            return mensajeRegistroUsuario(req, res, { mensaje: "El campo contraseña es incorrecto.", esError: true }, body);
        }
        if (!body.password2) {
            return mensajeRegistroUsuario(req, res, { mensaje: "El campo confirme contraseña no puede ser vacio.", esError: true }, body);
        }
        else {
            try {
                if (body.password1 == body.password2) {
                    const salt = await bcrypt.genSalt(10);
                    let passwordFinal = await bcrypt.hash(body.password1, salt);
                    await sequelize.query('CALL CREARUSUARIO(:nombre,:apellido,:email,:password,:id_rol)',
                        {
                            replacements: {
                                nombre: body.nombre.trim(),
                                apellido: body.apellido.trim(),
                                email: body.email.trim(),
                                password: passwordFinal,
                                id_rol: body.id_rol,
                            }
                        });
                    mensajeRegistroUsuario(req, res, { mensaje: "El usuario fue creado exitosamente.", esError: false }, null);
                }
                else {
                    mensajeRegistroUsuario(req, res, { mensaje: "Los campos password no coinciden.", esError: true }, body);
                }
            }
            catch (error) {
                res.status(400).send(error.message);
            }
        }
    }
    else {
        mensajeRegistroUsuario(req, res, { mensaje: "Ya existe un usuario con ese email", esError: true }, body);
    }
}
exports.nuevoUsuarioVista = async function (req, res) {
    let msj = req.flash("mensaje");
    let bodyData = req.flash("body");
    let rolesData = await roles.findAll();
    res.render('Usuarios/nuevoUsuario', { mensaje: msj, roles: rolesData, body: bodyData[0] });
}
exports.borrarUsuario = async function (req, res) {
    let idBorrar = req.params.id;
    if (validation.isNumber(idBorrar)) {
        let usuarioData = await usuarios.findOne({ where: { ver_usuario: 1, id_usuario: idBorrar.trim() } });
        if (usuarioData == null) {
            res.redirect('/home/verUsuarios');
            return;
        }
        else {
            try {
                await sequelize.query('CALL BORRARUSUARIO(:IDUSUARIO)',
                    {
                        replacements: {
                            IDUSUARIO: idBorrar.trim(),
                        }
                    });
                res.redirect('/home/verUsuarios');
            }

            catch (error) {
                res.status(400).send(error.message);
            }
        }
    }
    else {
        res.redirect('/home/verUsuarios');
    }
}
exports.verUsuarios = async function (req, res) {
    let usuariosData = await usuarios.findAll({
        where: { ver_usuario: 1 },
        include: { model: roles }
    });
    res.render('Usuarios/verUsuarios', { usuarios: usuariosData });
}
exports.editarUsuarioVista = async function (req, res) {
    let idModificar = req.params.id;
    let msj = req.flash("mensaje");
    let bodyData = req.flash("body");
    if (validation.isNumber(idModificar)) {
        let usuarioData = await usuarios.findOne({ where: { ver_usuario: 1, id_usuario: idModificar } });
        if (usuarioData != null) {
            let rolesData = await roles.findAll();
            console.log(bodyData[0]);
            res.render('Usuarios/editarUsuario', { mensaje: msj, roles: rolesData, usuario: usuarioData, body: bodyData[0] });
        }
        else {
            res.redirect("/home/verUsuarios");
        }
    }
    else {
        res.redirect("/home/verUsuarios");
    }
}
exports.editarUsuario = async function (req, res) {
    let body = req.body;
    let idModificar = req.params.id;
    if (validation.isNumber(idModificar)) {
        if (!validation.isOnlyText(body.nombre)) {
            return mensajeEditaUsuario(req, res, { mensaje: "El campo nombre es incorrecto.", esError: true }, idModificar, body);
        }
        if (!validation.isOnlyText(body.apellido)) {
            return mensajeEditaUsuario(req, res, { mensaje: "El campo apellido es incorrecto.", esError: true }, idModificar, body);
        }
        if (!validation.isNumber(body.id_rol)) {
            return mensajeEditaUsuario(req, res, { mensaje: "El rol es incorrecto.", esError: true }, idModificar, body);
        }
        if (!validation.isEmail(body.email)) {
            return mensajeEditaUsuario(req, res, { mensaje: "El campo email es incorrecto.", esError: true }, idModificar, body);
        }
        else {
            try {
                await sequelize.query('CALL EDITARUSUARIO(:idusuario,:nombre,:apellido,:email,:id_rol)',
                    {
                        replacements: {
                            idusuario: idModificar,
                            nombre: body.nombre.trim(),
                            apellido: body.apellido.trim(),
                            email: body.email.trim(),
                            id_rol: body.id_rol,
                        }
                    });
                mensajeEditaUsuario(req, res, { mensaje: "El usuario fue editado exitosamente.", esError: false }, idModificar, null);

            }
            catch (error) {
                res.status(400).send(error.message);
            }
        }
    }
    else {
        res.redirect("/home/verUsuarios");
    }

}
exports.cambiarPasswordVista = async function (req, res) {
    let idModificar = req.params.id;
    let msj = req.flash("mensaje");
    if (validation.isNumber(idModificar)) {
        let usuarioData = await usuarios.findOne({ where: { ver_usuario: 1, id_usuario: idModificar } });
        if (usuarioData != null) {
            res.render('Usuarios/cambiarPassword', { mensaje: msj, usuario: usuarioData }); // mensaje: msj,}
        }
        else {
            res.redirect("/home/verUsuarios");
        }
    }
}
exports.cambiarPassword = async function (req, res) {
    let body = req.body;
    let idModificar = req.params.id;
    if (validation.isNumber(idModificar)) {
        if (!body.password1) {
            return mensajeEditarPassword(req, res, { mensaje: "El campo contraseña es incorrecto.", esError: true }, idModificar);
        }
        if (!body.password2) {
            return mensajeEditarPassword(req, res, { mensaje: "El campo confirme contraseña no puede ser vacio.", esError: true }, idModificar);
        }
        else {
            try {
                if (body.password1 == body.password2) {
                    const salt = await bcrypt.genSalt(10);
                    let passwordActual = await bcrypt.hash(body.password1, salt);
                    await sequelize.query('CALL EDITARPASSWORD(:IDUSUARIO,:PASSWORDNUEVA)',
                        {
                            replacements: {
                                IDUSUARIO: idModificar,
                                PASSWORDNUEVA: passwordActual,
                            }
                        });
                    mensajeEditarPassword(req, res, { mensaje: "Se cambio la contraseña con exito", esError: false }, idModificar);
                }
                else {
                    mensajeEditarPassword(req, res, { mensaje: "Los campos password no coinciden.", esError: true }, idModificar);
                }
            }
            catch (error) {
                res.status(400).send(error.message);
            }
        }
    }
    else {
        //mensajeEditarPassword(req, res, { mensaje: "Ya existe un usuario con ese email", esError: true });
        res.redirect("/home/verUsuarios");
    }
}

//MATERIAS

exports.nuevaMateriaVista = function (req, res) {
    let msj = req.flash("mensaje");
    let bodyData = req.flash("body");
    let fechaActual = new moment().format('YYYY-MM-DD');
    res.render('Materias/nuevaMateria', { mensaje: msj, fecha: fechaActual, body: bodyData[0] });
}
exports.nuevaMateria = async function (req, res) {
    let body = req.body;
    let materia = await materias.findOne({ where: { nombre_materia: body.nombre } });
    if (!materia) {
        if (!body.nombre) {
            return mensajeNuevaMateria(req, res, { mensaje: "El campo nombre no puede ser vacio", esError: true }, body);
        }
        if (!body.fecha_inicio) {
            return mensajeNuevaMateria(req, res, { mensaje: "El campo fecha inicio no puede ser vacio", esError: true }, body);
        }
        if (!body.fecha_fin) {
            return mensajeNuevaMateria(req, res, { mensaje: "El campo fecha fin no puede ser vacio.", esError: true }, body);
        }
        else {
            try {

                await sequelize.query('CALL CREARMATERIA(:NOMBREMATERIA,:INICIOCURSADA,:FINCURSADA)',
                    {
                        replacements: {
                            NOMBREMATERIA: body.nombre,
                            INICIOCURSADA: body.fecha_inicio,
                            FINCURSADA: body.fecha_fin,
                        }
                    });
                mensajeNuevaMateria(req, res, { mensaje: "Materia creada exitosamente.", esError: false }, null);
            }
            catch (error) {
                res.status(400).send(error.message);
            }
        }
    }
    else {
        mensajeNuevaMateria(req, res, { mensaje: "Ya existe una materia con ese nombre", esError: true }, body);
    }
}
exports.borrarMateria = async function (req, res) {
    let idBorrar = req.params.id;
    if (validation.isNumber(idBorrar)) {
        let materiaData = await materias.findOne({ where: { ver_materia: 1, id_materia: idBorrar.trim() } });
        if (materiaData == null) {
            res.redirect('/home/verMaterias');
            return;
        }
        else {
            try {
                await sequelize.query('CALL BORRARMATERIA(:IDMATERIA)',
                    {
                        replacements: {
                            IDMATERIA: idBorrar.trim(),
                        }
                    });
                res.redirect('/home/verMaterias');
            }

            catch (error) {
                res.status(400).send(error.message);
            }
        }
    }
    else {
        res.redirect('/home/verMaterias');
    }
}
exports.verMaterias = async function (req, res) {
    let materiasData = await materias.findAll({
        where: { ver_materia: 1 }
    });
    res.render('Materias/verMaterias', { materias: materiasData });
}
exports.editarMateriaVista = async function (req, res) {
    let idModificar = req.params.id;
    let msj = req.flash("mensaje");
    let bodyData = req.flash("body");
    if (validation.isNumber(idModificar)) {
        let materiaData = await materias.findOne({ where: { ver_materia: 1, id_materia: idModificar } });
        if (materiaData != null) {
            res.render('Materias/editarMateria', { mensaje: msj, materia: materiaData, body: bodyData[0] });
        }
        else {
            res.redirect("/home/verMaterias");
        }
    }
    else {
        res.redirect("/home/verMaterias");
    }
}
exports.editarMateria = async function (req, res) {
    let body = req.body;
    let idModificar = req.params.id;
    if (validation.isNumber(idModificar)) {
        if (!body.nombre) {
            return mensajeEditaMateria(req, res, { mensaje: "El campo nombre no puede ser vacio", esError: true }, idModificar, body);
        }
        if (!body.fecha_inicio) {
            return mensajeEditaMateria(req, res, { mensaje: "El campo fecha inicio no puede ser vacio", esError: true }, idModificar, body);
        }
        if (!body.fecha_fin) {
            return mensajeEditaMateria(req, res, { mensaje: "El campo fecha fin no puede ser vacio.", esError: true }, idModificar, body);
        }
        else {
            try {
                await sequelize.query('CALL EDITARMATERIA(:IDMATERIA,:NOMBREMATERIA,:INICIOCURSADA,:FINCURSADA)',
                    {
                        replacements: {
                            IDMATERIA: idModificar,
                            NOMBREMATERIA: body.nombre,
                            INICIOCURSADA: body.fecha_inicio,
                            FINCURSADA: body.fecha_fin,
                        }
                    });
                mensajeEditaMateria(req, res, { mensaje: "Materia fue editada exitosamente.", esError: false }, idModificar, null);

            }
            catch (error) {
                res.status(400).send(error.message);
            }
        }
    }
    else {
        res.redirect("/home/verMaterias");
    }

}
exports.asignarProfesorVista = async function (req, res) {
    let idProfesor = req.params.id;
    let materiasData = await sequelize.query(`SELECT m.id_materia, nombre_materia FROM materias m 
    LEFT JOIN (SELECT * FROM dictadomateria WHERE id_usuario=?) dm ON(m.id_materia=dm.id_materia) 
    WHERE ver_materia=1 AND dm.id_materia IS NULL`, { replacements: [idProfesor], type: QueryTypes.SELECT });
    let profesorData = await usuarios.findOne({
        where: { ver_usuario: 1, id_rol: 2, id_usuario: idProfesor }
    });
    let MateriaProfesorData = await dictadoMateria.findAll({
        group: 'id_materia',
        where: { id_usuario: idProfesor },
        include: { model: materias }
    });
    res.render('Usuarios/AsignarMaterias', { materiasSinAsignar: materiasData, materiasAsignadas: MateriaProfesorData, profesor: profesorData });
}
exports.asignarProfesor = async function (req, res) {
    let idProfesor = req.params.idProfesor;
    let idMateria = req.params.idMateria;
    if (validation.isNumber(idProfesor) && validation.isNumber(idMateria)) {
        let MateriaProfesorData = await dictadoMateria.findAll({
            where: { id_usuario: idProfesor, id_materia: idMateria },
        });
        if (MateriaProfesorData.length === 0) {
            await sequelize.query('CALL CREARDICTADOMATERIA(:IDMATERIA,:IDUSUARIO)',
                {
                    replacements: {
                        IDMATERIA: idMateria,
                        IDUSUARIO: idProfesor,
                    }
                });
        }
        res.redirect("/home/asignarProfesor/" + idProfesor);
    }
    else {
        res.redirect("/home/verUsuarios");
    }
}
exports.eliminarMateriaAsignada = async function (req, res) {
    let idDictadoMateria = req.params.id;
    if (validation.isNumber(idDictadoMateria)) {
        let profesor = await dictadoMateria.findOne({ where: { id_dictadoMateria: idDictadoMateria } });
        await sequelize.query('CALL BORRARDICTADOMATERIA(:IDDICTADOMATERIA)',
            {
                replacements: {
                    IDDICTADOMATERIA: idDictadoMateria,
                }
            });
        res.redirect("/home/asignarProfesor/" + profesor.id_usuario);
    }
    else {
        res.redirect("/home/verUsuarios");
    }
}
exports.profesoresAsignadosVista = async function (req, res) {
    let idMateria = req.params.id;
    let materiaData = await materias.findOne({ where: { id_materia: idMateria, ver_materia: 1 } });
    let materiaProfesorData = await dictadoMateria.findAll({
        group: 'id_usuario',
        where: { id_materia: idMateria },
        include: { model: usuarios }
    });
    res.render('Materias/verProfesores', { materia: materiaData, profesoresAsignados: materiaProfesorData });
}
//HORARIOS

exports.verHorariosVista = async function (req, res) {
    let idMateria = req.params.idMateria;
    let horariosData = await horarios.findAll({
        where: { id_materia: idMateria, ver_horario: 1 }
    });
    let materia = await materias.findOne({
        where: { id_materia: idMateria }
    });
    let dias = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"];
    res.render('Horarios/verHorarios', { horarios: horariosData, materia: materia, dias: dias });
}
//VISTA GENERAL

exports.vistaGeneralAsistencia = async function (req, res) {
    let materiasData = await materias.findAll({ where: { ver_materia: 1 } });
    let horariosData = await horarios.findAll({ where: { ver_horario: 1 } });
    let alumnosCursandoData = await cursadoMateria.findAll({
        where: { habilitar_cursada: 1 },
        include: { model: usuarios, where: { ver_usuario: 1 } },
    });
    let objetoAsistencia = [];

    let fechaActual = moment();
    for (let i = 0; i < materiasData.length; i++) {
        let fechasCursada = [];
        let fechaInicio = moment(materiasData[i].fecha_inicio_cursada);
        let fechaFin = moment(materiasData[i].fecha_fin_cursada);
        if (fechaActual.isBefore(fechaFin, 'day')) {
            fechaFin = fechaActual;
        }
        let diferencia = fechaFin.diff(fechaInicio, 'days');
        let horariosMateria = horariosData.filter(h => h.id_materia == materiasData[i].id_materia);
        let alumnosCursando = alumnosCursandoData.filter(a => a.id_materia == materiasData[i].id_materia).length;
        let cantDias = 0;
        for (let e = 0; e <= diferencia; e++) {
            for (let h = 0; h < horariosMateria.length; h++) {
                if (horariosMateria[h].dia_cursado == fechaInicio.isoWeekday()) {
                    fechasCursada.push(fechaInicio.format('DD-MM-YY'));
                    cantDias++;
                    break;
                }
            }

            fechaInicio = fechaInicio.add(1, 'day');
        }
        let objeto = { id: materiasData[i].id_materia, nombre: materiasData[i].nombre_materia, asistenciaTotal: (alumnosCursando * cantDias), fechas: [] };
        objeto.fechas = fechasCursada;
        objetoAsistencia.push(objeto);
    }
    console.log(objetoAsistencia);
    let materiaAsistencia = [];
    for (let i = 0; i < objetoAsistencia.length; i++) {
        let asistenciasMateria = await asistencia.count({ where: { id_materia: objetoAsistencia[i].id } });
        if (asistenciasMateria == 0) {
            asistenciasMateria = 0;
        }
        else {
            asistenciasMateria = (asistenciasMateria * 100) / objetoAsistencia[i].asistenciaTotal;

        }
        let objeto = { nombre: objetoAsistencia[i].nombre, asistencia: Math.round(asistenciasMateria) };
        materiaAsistencia.push(objeto);
    }
    res.render('Asistencia/semaforoAsistencia', { materiasAsistencia: materiaAsistencia })
}

exports.verConflictosVista = async function (req, res) {
    let horariosData = await sequelize.query(`SELECT * 
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
        for (let e = 0; e < horariosData.length; e++) {
            if (horariosData[i].id_horario != horariosData[e].id_horario) {
                if (horariosData[i].dia_cursado == horariosData[e].dia_cursado) {

                    let horaDesdeI = moment(horariosData[i].hora_desde, 'h:mm');
                    let horaHastaI = moment(horariosData[i].hora_hasta, 'h:mm');
                    let horaDesdeE = moment(horariosData[e].hora_desde, 'h:mm');
                    let horaHastaE = moment(horariosData[e].hora_hasta, 'h:mm');

                    if (horaDesdeI.isBetween(horaDesdeE, horaHastaE, undefined, "[]") || horaHastaI.isBetween(horaDesdeE, horaHastaE, undefined, "[]") || horaHastaE.isBetween(horaDesdeI, horaHastaI, undefined, "[]") || horaDesdeE.isBetween(horaDesdeI, horaHastaI, undefined, "[]")) {

                        objeto = { id_materia: horariosData[i].id_materia, nombre_materia: horariosData[i].nombre_materia, horario: horariosData[i].hora_desde + '-' + horariosData[i].hora_hasta, dia: horariosData[i].dia_cursado, id_conflicto: horariosData[e].id_materia, nombre_conflicto: horariosData[e].nombre_materia, horario_conflicto: horariosData[e].hora_desde + '-' + horariosData[e].hora_hasta };
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
    res.render('Horarios/verConflictos', { conflictos: usuarioConflictoOrdenado, dias: ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"] });
}

//METODOS
function mensajeRegistroUsuario(req, res, mensaje, body) {
    req.flash('mensaje', mensaje);
    req.flash('body', body);
    res.redirect('/home/nuevoUsuario');
}
function mensajeEditaUsuario(req, res, mensaje, idModificar, body) {
    req.flash('mensaje', mensaje);
    req.flash('body', body);
    res.redirect('/home/editarUsuario/' + idModificar);
}
function mensajeNuevaMateria(req, res, mensaje, body) {
    req.flash('mensaje', mensaje);
    req.flash('body', body);
    res.redirect('/home/nuevaMateria');
}
function mensajeEditaMateria(req, res, mensaje, idModificar, body) {
    req.flash('mensaje', mensaje);
    req.flash('body', body);
    res.redirect('/home/editarMateria/' + idModificar);
}
function mensajeEditarPassword(req, res, mensaje, idModificar) {
    req.flash('mensaje', mensaje);
    res.redirect('/home/cambiarPassword/' + idModificar);
}