const dictadoMateria = require('../models').dictadoMateria;

function autenticacionLogin(req, res, next) {
    if (req.session.id_usuario) {
        next();
    } else {
        res.redirect("/login");
    }
}
function autenticacionProfesor(req, res, next) {
    if (req.session.id_rol === 2) {
        next();
    } else {
        res.redirect("/home");
    }
}
function autenticacionCoordinador(req, res, next) {

    if (req.session.id_rol === 1) {
        next();
    } else {
        res.redirect("/home");
    }
}
function autenticacionAlumno(req, res, next) {
    if (req.session.id_rol === 3) {
        next();
    } else {
        res.redirect("/home");
    }
}
/*async function gestionMateriaProfesor(req, res, next) {

    let materiasData = await dictadoMateria.findAll({ where: { id_usuario: req.session.id_usuario, ver_dictadomateria: 1 } });
    if (materiasData != null) {
        next();
    }
    else {
        res.redirect("/verMateriasAsignadas");
    };

}*/

module.exports = { autenticacionLogin, autenticacionProfesor, autenticacionCoordinador, autenticacionAlumno };