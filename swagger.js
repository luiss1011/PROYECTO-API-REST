const swaggerAutogen = require('swagger-autogen');

const outputFile = './swagger.json';
const endpointsFiles = ['./app/app.js'];

const doc = {
    info: {
        title: 'API de de tareas',
        description: 'Esta API permite crear, leer, actualizar y eliminar tareas',
    },
    host: 'localhost:3000',
    schema: ['http']
}

swaggerAutogen()(outputFile, endpointsFiles, doc)