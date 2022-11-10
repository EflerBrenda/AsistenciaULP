var express = require('express');
const alumnosRouter = require('./alumnos');
const profesoresRouter = require('./profesores');
const coordinadoresRouter = require('./coordinadores');
var router = express.Router();

router.get('/', function (req, res) {
  if (req.session.id_rol === 1) { res.render("Coordinadores/coordinadores.pug"); }
  else if (req.session.id_rol === 2) { res.render("Profesores/profesores.pug"); }
  else if (req.session.id_rol === 3) { res.render("Alumnos/alumnos.pug"); }
});

router.use(coordinadoresRouter);
router.use(alumnosRouter);
router.use(profesoresRouter);

module.exports = router;