const { response } = require("express");
const { Comentario, Publicacion, Like } = require("../models");
const { ObjectId } = require('mongoose').Types;

const mostrarComentarios = async( req, res=response) =>{
    const [ comentario , count] = await Promise.all([
        Comentario.find({
            $or:[{estado: true}]
        })
        .populate('usuario')
        .populate('publicacion')
        .sort({_id:-1}),
        Comentario.countDocuments({
            $or:[{estado: true}]
        })
    ])
    if(!comentario){
        return res.json({
            msg: 'No exsite ningun comentario'
        })
    }

    res.json({
        count,
        comentario
    })
}

const mostrarComentario = async ( req, res=response) => {
    const { id } = req.params;
    const comentario = await Comentario.findById(id)
                        .populate('usuario')
                        .populate('publicacion');

    if(!comentario.estado){
        return res.json({
            msg: 'No existe el comentario'
        })
    }
     
    res.json({
        comentario
    }) 

}

const crearComentario = async(req,res=response) =>{
    const { estado, _id, ...data } = req.body;

    data.contenido = data.contenido.toUpperCase();
    data.usuario = req.usuario._id;
    data.fecha = new Date();

    const comentario = await new Comentario(data);
    await comentario.save();

    const publicacion = await Publicacion.findById(data.publicacion);

    if(!publicacion.estado){
        return res.json({
            msg: 'La publicacion no existe para adicionar comentario'
        })
    }

    publicacion.CantidadComentarios = publicacion.CantidadComentarios + 1;
    const publicacionModificada = await Publicacion.findByIdAndUpdate(data.publicacion, publicacion);

    res.json({
        comentario,
        publicacionModificada
    })
}

const actualizarComentario = async (req,res=response) => {
    
    const { id } = req.params;
    const { _id, usuario, ... data } = req.body;

    const encontrar = await Comentario.findById(id);
    if(!encontrar.estado){
        return res.json({
            msg:'El comentario no existe'
        })
    }

    console.log(data);

    encontrar.contenido = data.contenido.toUpperCase()
    encontrar.usuario = req.usuario._id;

    const comentario = await Comentario.findByIdAndUpdate(id,encontrar )
    console.log(comentario);
    res.json({
        comentario
    })

}

const eliminarComentario = async( req, res=response) => {
    
    const { id } = req.params;
    const comen = await Comentario.findById(id);

    if(!comen){
        return res.json({
            msg: 'El comentario no existe'
        })
    }
    if(!comen.estado){
        return res.json({
            msg: 'El comentario tiene estado false'
        })
    }

    const likee=await Like.find({
        $or:[{estado:true}],
        $and:[{comentario:ObjectId(id)}]
    })
    for (const iterator of likee) {
        await Like.findByIdAndUpdate(iterator._id,{estado:false},{new:true});
    }
    const g = await Like.find({
        $or:[{comentario:ObjectId(id)}]
    })

    const publicacion = await Publicacion.findById(comen.publicacion);
    publicacion.CantidadComentarios = publicacion.CantidadComentarios -1;
    const publicacionModificada = await Publicacion.findByIdAndUpdate(comen.publicacion,publicacion)
  
    const comentario = await Comentario.findByIdAndUpdate(id, {estado:false}, {new:true})

    res.json({
        publicacionModificada,
        comentario
    })

} 

module.exports = {
    crearComentario,
    mostrarComentario,
    mostrarComentarios,
    actualizarComentario,
    eliminarComentario,
}