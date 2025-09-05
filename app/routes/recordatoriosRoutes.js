const express = require('express');
const router = express.Router();
const recordatoriosController = require('../controllers/recordatoriosController');
const { verificarToken } = require('../middlewares/auth');

// Aplicar middleware de autenticación a todas las rutas
router.use(verificarToken);

// Rutas principales
router.get('/', recordatoriosController.buscarTodo);
router.post('/', recordatoriosController.agregarRecordatorio);

// Rutas con parámetros
router.get('/:correo', recordatoriosController.obtenerRecordatoriosPorCorreo);
router.put('/:titulo/completar', recordatoriosController.marcarComoCompletado);
router.put('/:titulo/desmarcar', recordatoriosController.desmarcarRecordatorioCompletado);
router.delete('/:titulo', recordatoriosController.eliminarRecordatorioPorTitulo);

// Rutas para búsquedas específicas
router.get('/buscar/:key/:value', recordatoriosController.buscarRecordatorio, recordatoriosController.mostrarRecordatorio);
router.put('/:key/:value', recordatoriosController.buscarRecordatorio, recordatoriosController.actualizarRecordatorio);
router.delete('/:key/:value', recordatoriosController.buscarRecordatorio, recordatoriosController.eliminarRecordatorio);

// Rutas adicionales
router.get('/completados', recordatoriosController.mostrarCompletados);

module.exports = router;
