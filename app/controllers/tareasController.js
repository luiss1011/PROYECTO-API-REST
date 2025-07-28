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

async function crearTarea(req, res) {
    try {
        const nuevaTarea = new tareasModel({
            ...req.body,
            alumnoId: req.usuario.id // <-- obtenido del token
        });
        await nuevaTarea.save();
        res.status(201).json(nuevaTarea);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

async function actualizarTarea(req, res) {
    const { id } = req.params;
    try {
        const tarea = await tareasModel.findOneAndUpdate(
            { _id: id, alumnoId: req.usuario.id }, // seguridad
            req.body,
            { new: true }
        );
        if (!tarea) return res.status(404).send({ mensaje: 'Tarea no encontrada' });
        res.json(tarea);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}


async function eliminarTarea(req, res) {
    const { id } = req.params;
    try {
        const tarea = await tareasModel.findOneAndDelete({ _id: id, alumnoId: req.usuario.id });
        if (!tarea) return res.status(404).send({ mensaje: 'Tarea no encontrada' });
        res.json({ mensaje: 'Tarea eliminada' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}


module.exports = {
    crearTarea,
    actualizarTarea,
    eliminarTarea,

    buscarTodo
};
