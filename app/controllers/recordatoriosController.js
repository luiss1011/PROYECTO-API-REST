const recordatoriosModel = require('../models/recordatoriosModel');

function buscarTodo(req, res) {
    const orden = req.query.orden;
    const completado = req.query.completado;
    const titulo = req.query.titulo;
    const correo = req.params.correo || req.usuario.correo;

    const consulta = { correoUsuario: correo };

    if (completado !== undefined) {
        consulta.completado = completado === 'true';
    }

    if (titulo) {
        // Busca titulo con regex para coincidencia parcial e insensible a mayúsculas
        consulta.titulo = { $regex: titulo, $options: 'i' };
    }

    let sortOptions = {};
    if (orden === 'fecha-desc') {
        sortOptions.fechaHora = -1;
    } else if (orden === 'fecha-asc') {
        sortOptions.fechaHora = 1;
    } else if (orden === 'titulo-asc') {
        sortOptions.titulo = 1;
    } else if (orden === 'titulo-desc') {
        sortOptions.titulo = -1;
    } else {
        // Por defecto ordenar por fecha de creación descendente
        sortOptions.fechaCreacion = -1;
    }

    recordatoriosModel.find(consulta)
        .collation({ locale: 'en', strength: 2 })
        .sort(sortOptions)
        .then(recordatorios => {
            if (recordatorios.length) {
                return res.status(200).send({ recordatorios });
            }
            return res.status(200).send({ recordatorios: [], mensaje: "No hay recordatorios para mostrar" });
        })
        .catch(e => {
            return res.status(404).send({
                mensaje: `Error al consultar la información: ${e.message}`
            });
        });
}

function agregarRecordatorio(req, res) {
    const nuevoRecordatorio = {
        ...req.body,
        correoUsuario: req.usuario.correo
    };

    recordatoriosModel.findOne({ 
        titulo: nuevoRecordatorio.titulo, 
        correoUsuario: nuevoRecordatorio.correoUsuario 
    })
    .then(recordatorioExistente => {
        if (recordatorioExistente) {
            return res.status(400).send({
                mensaje: "Ya tienes un recordatorio con ese título. Elige otro título diferente."
            });
        }

        return new recordatoriosModel(nuevoRecordatorio).save()
            .then(info => {
                return res.status(200).send({
                    mensaje: "El recordatorio se guardó de forma correcta",
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

function buscarRecordatorio(req, res, next) {
    if (!req.body) req.body = {}

    var consulta = {}
    consulta[req.params.key] = req.params.value
    
    recordatoriosModel.find(consulta)
    .then(recordatorios => {
        if (!recordatorios.length) return next();
        req.body.recordatorios = recordatorios
        return next()
    })
    .catch(e => {
        req.body.e = e
        return next()
    })
}

function eliminarRecordatorio(req, res) {
    var recordatorios = {}
    recordatorios = req.body.recordatorios

    if (!recordatorios || !recordatorios.length) {
        return res.status(200).send({
            mensaje: "No se encontró el recordatorio a eliminar"
        })
    }

    recordatoriosModel.deleteOne(recordatorios[0])
    .then(info =>{
        return res.status(200).send({mensaje: "El recordatorio se eliminó de forma correcta", info})
    })
    .catch(e => {
        return res.status(404).send({mensaje: "Error al eliminar recordatorio", e})
    })
}

function actualizarRecordatorio(req, res) {
    const recordatorios = req.body.recordatorios;

    if (!recordatorios || !recordatorios.length) {
        return res.status(200).send({
            mensaje: "No se encontró el recordatorio a modificar"
        });
    }

    const filtro = {
        titulo: recordatorios[0].titulo,
        correoUsuario: recordatorios[0].correoUsuario
    };

    recordatoriosModel.findOneAndUpdate(
        filtro,
        req.body,
        { new: true }
    )
    .then(recordatorioActualizado => {
        if (!recordatorioActualizado) {
            return res.status(404).send({ mensaje: "No se encontró el recordatorio para actualizar" });
        }
        return res.status(200).send({
            mensaje: "El recordatorio se actualizó correctamente",
            info: recordatorioActualizado
        });
    })
    .catch(e => {
        return res.status(404).send({
            mensaje: "Error al actualizar la información",
            e
        });
    });
}

function marcarComoCompletado(req, res) {
    const { titulo } = req.params;
    const correo = req.usuario.correo;

    recordatoriosModel.findOne({ titulo, correoUsuario: correo })
        .then(recordatorio => {
            if (!recordatorio) {
                return res.status(404).json({ mensaje: "Recordatorio no encontrado" });
            }

            recordatorio.completado = true;
            return recordatorio.save();
        })
        .then(recordatorioActualizado => {
            res.json({ mensaje: "Recordatorio marcado como completado", recordatorio: recordatorioActualizado });
        })
        .catch(error => {
            res.status(500).json({ mensaje: "Error al completar recordatorio", error });
        });
}

function mostrarCompletados(req, res) {
    const correo = req.usuario.correo;

    recordatoriosModel.find({ correoUsuario: correo, completado: true })
        .then(recordatorios => {
            res.json({ recordatorios });
        })
        .catch(error => {
            res.status(500).json({ mensaje: "Error al obtener recordatorios completados", error });
        });
}

function mostrarRecordatorio(req, res) {
    if(req.body.e){return res.status(404).send({mensaje: `error al buscar la información`})}
    if(!req.body.recordatorios) res.status(200).send({ recordatorios: [], mensaje: "No hay nada que mostrar" });
    let recordatorios = req.body.recordatorios
    return res.status(200).send({recordatorios})
}

function obtenerRecordatoriosPorCorreo(req, res) {
    const { correo } = req.params;
    
    recordatoriosModel.find({ correoUsuario: correo })
        .sort({ fechaHora: 1 })
        .then(recordatorios => {
            res.json(recordatorios);
        })
        .catch(error => {
            res.status(500).json({ mensaje: "Error al obtener recordatorios", error });
        });
}

function eliminarRecordatorioPorTitulo(req, res) {
    const { titulo } = req.params;
    const correo = req.usuario.correo;

    recordatoriosModel.findOneAndDelete({ titulo, correoUsuario: correo })
        .then(recordatorio => {
            if (!recordatorio) {
                return res.status(404).json({ mensaje: "Recordatorio no encontrado" });
            }
            res.json({ mensaje: "Recordatorio eliminado correctamente" });
        })
        .catch(error => {
            res.status(500).json({ mensaje: "Error al eliminar recordatorio", error });
        });
}

function desmarcarRecordatorioCompletado(req, res) {
  const { titulo } = req.params;
  const correo = req.usuario.correo;

  recordatoriosModel.findOne({ titulo, correoUsuario: correo })
    .then(recordatorio => {
      if (!recordatorio) {
        return res.status(404).json({ mensaje: "Recordatorio no encontrado" });
      }

      if (!recordatorio.completado) {
        return res.status(400).json({ mensaje: "El recordatorio ya está marcado como pendiente" });
      }

      recordatorio.completado = false;
      recordatorio.fechaCompletada = undefined; // Limpiar fecha de completado
      return recordatorio.save();
    })
    .then(recordatorioActualizado => {
      res.json({ mensaje: "Recordatorio desmarcado como completado", recordatorio: recordatorioActualizado });
    })
    .catch(error => {
      res.status(500).json({ mensaje: "Error al desmarcar recordatorio", error });
    });
}

module.exports = {
    actualizarRecordatorio,
    eliminarRecordatorio,
    buscarTodo,
    agregarRecordatorio,
    buscarRecordatorio,
    mostrarRecordatorio,
    marcarComoCompletado,
    mostrarCompletados,
    obtenerRecordatoriosPorCorreo,
    eliminarRecordatorioPorTitulo,
    desmarcarRecordatorioCompletado
};
