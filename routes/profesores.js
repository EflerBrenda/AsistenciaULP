var express = require('express');
const autenticacion = require("../middlewares/autenticacion");
const profesoresController = require('../controllers/profesores');
var router = express.Router();

//Valida alumno en la materia
router.get('/validarAlumnos/:idMateria', autenticacion.autenticacionProfesor, profesoresController.validarAlumnosVista);
router.post('/validaAlumnoMateria/:idCursado', autenticacion.autenticacionProfesor, profesoresController.validaAlumnoMateria);
router.delete('/rechazoAlumnoMateria/:idCursado', autenticacion.autenticacionProfesor, profesoresController.rechazoAlumnoMateria);

//Gestion horarios materia 
router.get('/gestionHorario/:idMateria', autenticacion.autenticacionProfesor, profesoresController.gestionHorarioVista);
router.get('/agregarHorario/:idMateria', autenticacion.autenticacionProfesor, profesoresController.agregarHorarioVista);
router.post('/agregarHorario/:idMateria', autenticacion.autenticacionProfesor, profesoresController.agregarHorario);
router.delete('/borrarHorario/:idMateria/:idHorario', autenticacion.autenticacionProfesor, profesoresController.borrarHorario);
router.get('/modificarHorario/:idMateria/:idHorario', autenticacion.autenticacionProfesor, profesoresController.modificarHorarioVista);
router.put('/modificarHorario/:idMateria/:idHorario', autenticacion.autenticacionProfesor, profesoresController.modificarHorario);
router.get('/verMateriasAsignadas', autenticacion.autenticacionProfesor, profesoresController.verMateriasAsignadas);

//Asistencia
router.get('/consultarAsistencia/:idMateria', autenticacion.autenticacionProfesor, profesoresController.consultarAsistenciaVista);
router.get('/verConflictosProfesores', autenticacion.autenticacionProfesor, profesoresController.verConflictosVista);

module.exports = router;