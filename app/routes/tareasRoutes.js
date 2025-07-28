const express = require('express');
const router = express.Router();
const tareasController = require('../controllers/tareasController');
const auth = require('../middlewares/auth');

router.use(auth.verificarToken);
router.get('/', tareasController.buscarTodo);
router.post('/', tareasController.agregarTarea);
router.get('/:key/:value', tareasController.buscarTarea, tareasController.mostrarTarea);
router.delete('/:key/:value', tareasController.buscarTarea, tareasController.eliminarTarea);
router.put('/:key/:value', tareasController.buscarTarea, tareasController.actualizarTarea);

module.exports = router;
