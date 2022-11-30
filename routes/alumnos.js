var express = require('express');
const autenticacion = require("../middlewares/autenticacion");
const alumnosController = require('../controllers/alumnos');
var router = express.Router();

//Registro a materia
router.get('/verMateriasDisponibles', autenticacion.autenticacionAlumno, alumnosController.verMateriasDisponibles);
router.post('/nuevoRegistroMateria/:idMateria', autenticacion.autenticacionAlumno, alumnosController.nuevoRegistroMateria);
router.get('/verMateriasRegistradas', autenticacion.autenticacionAlumno, alumnosController.verMateriasRegistradas);
router.get('/verMateria/:idMateria', autenticacion.autenticacionAlumno, alumnosController.verMateriaVista);

//Asistencia
router.get('/nuevaAsistencia', autenticacion.autenticacionAlumno, alumnosController.nuevaAsistenciaVista);
router.post('/nuevaAsistencia', autenticacion.autenticacionAlumno, alumnosController.nuevaAsistencia);

module.exports = router;