Es necesario crear el archivo configuracion.js, se debe poner en la carpeta config con la siguiente sintaxis:

module.exports = {
    PORT: process.env.PORT || 3000, 
    DB: process.env.DB || 'mongodb://localhost:27017/api-rest',
    SECRET_KEY: process.env.SECRET_KEY || 'agregar_clave',
};
