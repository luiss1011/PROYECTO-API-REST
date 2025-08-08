const tareasModel = require('../models/tareasModel');

function buscarTodo(req, res) {
    const orden = req.query.orden;
    const consulta = { correoUsuario: req.usuario.correo };
    let sortOptions = {};

    if (orden === 'fecha-desc') {
        sortOptions.fechaEntrega = -1;
    } else if (orden === 'fecha-asc') {
        sortOptions.fechaEntrega = 1;
    } else if (orden === 'nombre-asc') {
        sortOptions.nombreTarea = 1;
    } else if (orden === 'nombre-desc') {
        sortOptions.nombreTarea = -1;
    }

    tareasModel.find(consulta)
        .collation({ locale: 'en', strength: 2 }) // 👈 esto hace el orden insensible a mayúsculas
        .sort(sortOptions)
        .then(tareas => {
            if (tareas.length) {
                return res.status(200).send({ tareas });
            }
            return res.status(204).send({ mensaje: "No hay nada que mostrar" });
        })
        .catch(e => {
            return res.status(404).send({
                mensaje: `Error al consultar la información: ${e.message}`
            });
        });
}

function agregarTarea(req, res) {

    const nuevaTarea = {
        ...req.body,
        alumnoId: req.usuario.id,
        correoUsuario: req.usuario.correo
    };

    tareasModel.findOne({ 
        nombreTarea: nuevaTarea.nombreTarea, 
        correoUsuario: nuevaTarea.correoUsuario 
    })
    .then(tareaExistente => {
        if (tareaExistente) {
            return res.status(400).send({
                mensaje: "Ya tienes una tarea con ese nombre. Elige otro nombre diferente."
            });
        }

        return new tareasModel(nuevaTarea).save()
            .then(info => {
                return res.status(200).send({
                    mensaje: "La información se guardó de forma correcta",
                    info
                });
            });
    })
    .catch(e => {
        return res.status(500).send({
            mensaje: `Error al guardar: ${e.message}`
        });
    });
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

    if (!tareas || !tareas.length) {
        return res.status(200).send({
            mensaje: "No se encontró la tarea a eliminar"
        })
    }

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

function marcarComoCompletada(req, res) {
  const { nombreTarea } = req.params;
  const correo = req.usuario.correo;

  tareasModel.findOne({ nombreTarea, correoUsuario: correo })
    .then(tarea => {
      if (!tarea) {
        return res.status(404).json({ mensaje: "Tarea no encontrada" });
      }

      tarea.completada = true;
      return tarea.save();
    })
    .then(tareaActualizada => {
      res.json({ mensaje: "Tarea marcada como completada", tarea: tareaActualizada });
    })
    .catch(error => {
      res.status(500).json({ mensaje: "Error al completar tarea", error });
    });
}

function mostrarCompletadas(req, res) {
    const correo = req.usuario.correo;

  tareasModel.find({ correoUsuario: correo, completada: true })
    .then(tareas => {
      res.json({ tareas });
    })
    .catch(error => {
      res.status(500).json({ mensaje: "Error al obtener historial", error });
    });
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
    mostrarTarea,
    marcarComoCompletada,
    mostrarCompletadas
};