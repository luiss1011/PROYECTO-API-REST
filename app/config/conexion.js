const config = require('./configuracion')
const mongoose = require('mongoose')

module.exports = {
    connection: null,
    connect: ()=>{
        if(this.connection) return this.connection
        return mongoose.connect(config.DB)
        .then(conn => {
            this.connection = conn
            console.log('La conexión se realizo con exito')
        })
        .catch(e => (console.log(`Error en la conexion ${e}`)))
    }
}