var express = require('express');
const autenticacion = require("../middlewares/autenticacion");
const profesoresController = require('../controllers/profesores');
var router = express.Router();

//Valida alumno en la materia
router.get('/validarAlumnos/:id', autenticacion.autenticacionProfesor, profesoresController.validarAlumnosVista);
router.post('/validaAlumnoMateria/:id', autenticacion.autenticacionProfesor, profesoresController.validaAlumnoMateria);
router.delete('/rechazoAlumnoMateria/:idAlumno/:idMateria', autenticacion.autenticacionProfesor, profesoresController.rechazoAlumnoMateria);

//Gestion horarios materia 
router.get('/gestionHorario/:id', autenticacion.autenticacionProfesor, profesoresController.gestionHorarioVista);
router.post('/agregarHorario', autenticacion.autenticacionProfesor, profesoresController.agregarHorario);
router.delete('/borrarHorario/:id', autenticacion.autenticacionProfesor, profesoresController.borrarHorario);
router.get('/modificarHorario', autenticacion.autenticacionProfesor, profesoresController.modificarHorarioVista);
router.put('/modificarHorario', autenticacion.autenticacionProfesor, profesoresController.modificarHorario);
router.get('/verMateriasAsignadas', autenticacion.autenticacionProfesor, profesoresController.verMateriasAsignadas);

//Asistencia
router.get('/consultarAsistencia/:id', autenticacion.autenticacionProfesor, profesoresController.consultarAsistenciaVista);
router.get('/exportarAsistencia/:id', autenticacion.autenticacionProfesor, profesoresController.exportarAsistenciaVista);

//Exportar asistencia
router.post('/exportarAsistencia/:id', autenticacion.autenticacionProfesor, profesoresController.exportarAsistencia);


module.exports = router;