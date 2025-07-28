const tareasModel = require('../models/tareasModel');

function buscarTodo(req, res) {
    tareasModel.find({})
    .then(tareas => {
        if (tareas.length) {
            return res.status(200).send({tareas}) 
        }
        return res.status(204).send({menaje: "No hay nada que mostrar"})
    })
    .catch(e => {return res.status(404).send({mensaje: `Eror al consultar la información ${e}`})})
}

function agregarTarea(req, res) {

    const nuevaTarea = {
        ...req.body,
        alumnoId: req.usuario.id // <-- Agrega el ID del alumno desde el token
    };
    
    new tareasModel(nuevaTarea).save()
    .then(info => {
        return res.status(200).send({
            mensaje: "La información se guardo de forma correcta",
            info
        })
    })
    .catch(e => {return res.status(404).send({
        mensaje:`error al guardar ${e}`
    })})
}

function buscarTarea(req, res, next) {
    if (!req.body) req.body = {}

    var consulta = {}
    consulta[req.params.key] = req.params.value
    
    tareasModel.find(consulta)
    .then(tareas => {
        if (!tareas.length) return next();
        req.body.tareas = tareas
        return next()
    })
    .catch(e => {
        req.body.e = e
        return next()
    })
}

function eliminarTarea(req, res) {
    var tareas = {}
    tareas = req.body.tareas

    tareasModel.deleteOne(tareas[0])
    .then(info =>{
        return res.status(200).send({mensaje: "La información se elimino de forma correcta", info})
    })

    .catch(e => {
        return res.status(404).send({mensaje: "error al eliminar información", e})
    })

}

function actualizarTarea(req, res) {
    tareas = req.body.tareas
    
    if (!tareas || !tareas.length) {
        return res.status(200).send({
            mensaje: "No se encontró la tarea modificada"
        })
    }

    tareasModel.updateOne(tareas[0], req.body)
    .then(info => {
        return res.status(200).send({
            mensaje: "La información se actualizó correctamente",
            info
        })
    })
    .catch(e => {
        return res.status(404).send({
            mensaje: "Error al actualizar la información", e
        })
    })
}

function mostrarTarea(req, res) {
    if(req.body.e){return res.status(404).send({mensaje: `error al buscar la información`})}
    if(!req.body.tareas){return res.status(204).send({mensaje: `No hay nada que mostrar`})}
    let tareas = req.body.tareas
    return res.status(200).send({tareas})
}

module.exports = {
    actualizarTarea,
    eliminarTarea,
    buscarTodo,
    agregarTarea,
    buscarTarea,
    mostrarTarea
};
