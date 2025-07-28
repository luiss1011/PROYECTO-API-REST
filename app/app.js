const express = require('express');
const app = express();
const usuarioRoutes = require('./routes/usuarioRoutes')
const tareasRoutes = require('./routes/tareasRoutes');

app.use(express.urlencoded({extended:false}))

app.use(express.json())

app.use('/api/usuarios', usuarioRoutes);
app.use('/api/tareas', tareasRoutes);

module.exports = app