const express = require('express');
const app = express();
const usuarioRoutes = require('./routes/usuarioRoutes')
const tareasRoutes = require('./routes/tareasRoutes');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerDocumentation = require('../swagger.json')
const recordatoriosRoutes = require('./routes/recordatoriosRoutes');

// ... otras configuraciones del servidor ...

// Rutas de la API


app.use(cors());

app.use(express.urlencoded({extended:false}))

app.use(express.json())

app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerDocumentation))

app.use('/api/usuarios', usuarioRoutes);
app.use('/api/tareas', tareasRoutes);
app.use('/api/recordatorios', recordatoriosRoutes);

module.exports = app