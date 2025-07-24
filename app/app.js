const express = require('express');
const app = express();
const usuarioRoutes = require('./routes/usuarioRoutes')

app.use(express.urlencoded({extended:false}))

app.use(express.json())

app.use('/api/usuarios', usuarioRoutes);

module.exports = app