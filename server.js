require('dotenv').config();
const CONFIG = require('./app/config/configuracion');
const app = require('./app/app');
const conexion = require('./app/config/conexion');

// Conexión a MongoDB
conexion.connect();

// Iniciar servidor en el puerto asignado por Render o 3000 localmente
app.listen(CONFIG.PORT, () => {
    console.log(`✅ Aplicación corriendo en puerto ${CONFIG.PORT}`);
});
