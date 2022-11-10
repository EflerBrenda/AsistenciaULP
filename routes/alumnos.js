var express = require('express');
const autenticacion = require("../middlewares/autenticacion");
const alumnosController = require('../controllers/alumnos');
var router = express.Router();

//Registro a materia
router.get('/nuevoRegistroMateria', autenticacion.autenticacionAlumno, alumnosController.nuevoRegistroMateriaVista);
router.post('/nuevoRegistroMateria', autenticacion.autenticacionAlumno, alumnosController.nuevoRegistroMateria);
router.delete('/borrarRegistroMateria/:id', autenticacion.autenticacionAlumno, alumnosController.borrarRegistroMateria);
router.get('/verMateriasRegistradas', autenticacion.autenticacionAlumno, alumnosController.verMateriasRegistradas);

//Asistencia
router.get('/nuevaAsistencia', autenticacion.autenticacionAlumno, alumnosController.nuevaAsistenciaVista);
router.post('/nuevaAsistencia', autenticacion.autenticacionAlumno, alumnosController.nuevaAsistencia);

module.exports = router;