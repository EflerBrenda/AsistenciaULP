const usuarios = require('../models').usuarios;
const bcrypt = require("bcrypt");

exports.vistaLogin = function (req, res) {
    let msj = req.flash('mensaje');
    res.render('Login/login', { mensaje: msj })
}

exports.login = async function (req, res) {
    const body = req.body;
    try {
        if (!body.email || !body.password) {
            errorLogin(req, res);
            return;
        }
        const usuario = await usuarios.findOne({ where: { email_usuario: body.email } });
        if (usuario) {

            const passwordValida = await bcrypt.compare(body.password, usuario.password_usuario);
            if (passwordValida) {
                req.session.id_usuario = usuario.id_usuario;
                req.session.nombre_usuario = usuario.nombre_usuario;
                req.session.apellido_usuario = usuario.apellido_usuario;
                req.session.email_usuario = usuario.email_usuario;
                req.session.id_rol = usuario.id_rol;
                res.redirect('/home');
            }
            else {
                errorLogin(req, res);
            }
        }
        else {
            errorLogin(req, res);
        }
    }
    catch (error) {
        res.status(400).send(error.message)
    }
}

function errorLogin(req, res) {
    req.flash('mensaje', "Usuario no existe o contraseña no es valida.");
    res.redirect('/');
}
/*function mensajeRegistro(req, res, mensaje) {
    req.flash('mensaje', mensaje);
    res.redirect('/auth/crearUsuario');
}*/

exports.logout = function (req, res) {
    req.session.destroy();
    res.redirect('/login');
}