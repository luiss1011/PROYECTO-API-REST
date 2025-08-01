const express = require('express');
const router = express.Router();
const tareasController = require('../controllers/tareasController');
const auth = require('../middlewares/auth');

router.get('/', 
    auth.verificarToken,
    tareasController.buscarTodo
);
router.post('/', 
    auth.verificarToken,
    tareasController.agregarTarea
);
router.get('/:key/:value', 
    auth.verificarToken,
    tareasController.buscarTarea, 
    tareasController.mostrarTarea
);
router.delete('/:key/:value',
    auth.verificarToken,
    tareasController.buscarTarea, 
    tareasController.eliminarTarea
);
router.put('/:key/:value',
    auth.verificarToken,
    tareasController.buscarTarea, 
    tareasController.actualizarTarea
);

module.exports = router;
