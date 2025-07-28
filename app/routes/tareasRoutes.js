const express = require('express');
const router = express.Router();
const tareasController = require('../controllers/tareasController');
const auth = require('../middlewares/auth');

router.use(auth.verificarToken);

router.get('/', tareasController.buscarTodo);
router.post('/', tareasController.crearTarea);
router.put('/:id', tareasController.actualizarTarea);
router.delete('/:id', tareasController.eliminarTarea);


module.exports = router;
