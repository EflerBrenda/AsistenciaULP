var express = require('express');
const autenticacion = require("../middlewares/autenticacion");
const coordinadoresController = require('../controllers/coordinadores');
var router = express.Router();

//Coordinadores
//Solapa Usuario
router.get('/nuevoUsuario', autenticacion.autenticacionCoordinador, coordinadoresController.nuevoUsuarioVista);
router.post('/nuevoUsuario', autenticacion.autenticacionCoordinador, coordinadoresController.nuevoUsuario);
router.delete('/borrarUsuario/:id', autenticacion.autenticacionCoordinador, coordinadoresController.borrarUsuario);
router.get('/verUsuarios', autenticacion.autenticacionCoordinador, coordinadoresController.verUsuarios);
router.get('/editarUsuario/:id', autenticacion.autenticacionCoordinador, coordinadoresController.editarUsuarioVista);
router.put('/editarUsuario/:id', autenticacion.autenticacionCoordinador, coordinadoresController.editarUsuario);
router.get('/asignarProfesor/:id', autenticacion.autenticacionCoordinador, coordinadoresController.asignarProfesorVista);
router.post('/asignarProfesor/:idProfesor/:idMateria', autenticacion.autenticacionCoordinador, coordinadoresController.asignarProfesor);
router.delete('/eliminarMateriaAsignada/:id', autenticacion.autenticacionCoordinador, coordinadoresController.eliminarMateriaAsignada);

//Solapa materias
router.get('/nuevaMateria', autenticacion.autenticacionCoordinador, coordinadoresController.nuevaMateriaVista);
router.post('/nuevaMateria', autenticacion.autenticacionCoordinador, coordinadoresController.nuevaMateria);
router.delete('/borrarMateria/:id', autenticacion.autenticacionCoordinador, coordinadoresController.borrarMateria);
router.get('/verMaterias', autenticacion.autenticacionCoordinador, coordinadoresController.verMaterias);
router.get('/editarMateria/:id', autenticacion.autenticacionCoordinador, coordinadoresController.editarMateriaVista);
router.put('/editarMateria/:id', autenticacion.autenticacionCoordinador, coordinadoresController.editarMateria);
router.get('/profesoresAsignados/:id', autenticacion.autenticacionCoordinador, coordinadoresController.profesoresAsignadosVista);

//Horarios
router.get('/verHorarios/:idMateria', autenticacion.autenticacionCoordinador, coordinadoresController.verHorariosVista);

//Conflictos
router.get('/verConflictos', autenticacion.autenticacionCoordinador, coordinadoresController.verConflictosVista);

//Solapa asistencia
router.get('/vistaGeneralAsistencia', autenticacion.autenticacionCoordinador, coordinadoresController.vistaGeneralAsistencia);
//Cambiar contraseñas
router.get('/cambiarPassword/:id', autenticacion.autenticacionCoordinador, coordinadoresController.cambiarPasswordVista);
router.put('/cambiarPassword/:id', autenticacion.autenticacionCoordinador, coordinadoresController.cambiarPassword);

module.exports = router;