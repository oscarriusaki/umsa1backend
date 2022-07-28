const { response } = require("express");
const { append } = require("express/lib/response");
const { Publicacion, Like } = require("../models");
const compartir = require("../models/compartir");
const like = require("../models/like");
const { ObjectId } = require('mongoose').Types;

const mostrarPublicacione = async(req,res=response) => {
    
    const { id } = req.params;
    const usuario = await Publicacion.findById(id)
                    .populate('usuario');
    if(!usuario.estado){
        return res.json({
            msg: `No se encontro el usuario con el id: ${id}`
        })
    }

    res.json({
        usuario
    })

}

const mostrarPublicaciones = async (req, res= response) => {
    const [publicaciones,count] = await Promise.all([
        Publicacion.find({
            $or:[{estado:true}]
        })
        .populate('usuario')
        .sort({_id:-1}),
        Publicacion.countDocuments({
            $or:[{estado:true}]
        })
    ])
        
    if(count === 0){
        return res.json({
            msg:'No existe publicaciones :('
        })
    }

    res.json({
        count,
        publicaciones
    })
}

const registraPublicaciones = async( req, res = response) =>{
    const {contenido, descripcion, tipoEnfermedad } =  req.body;

    const data = {
        contenido: contenido.toUpperCase(),
        descripcion:descripcion.toUpperCase(),
        tipoEnfermedad:tipoEnfermedad.toUpperCase(),
        fecha: new Date(),
        usuario: req.usuario._id
    }
    const publicacion = await new Publicacion(data);
    await publicacion.save();
    res.status(200).json({
        publicacion
    })
}
const actualizarPublicacion = async ( req, res = response) =>{
    
    const { id } = req.params;

    const publicacionAux=await Publicacion.findById(id)
    if(!publicacionAux.estado){
        return res.json({
            msg:'No existe la publicacion'
        })
    }

    const { estado, usuario, ... resto } = req.body;

    resto.descripcion = resto.descripcion.toUpperCase();
    resto.contenido = resto.contenido.toUpperCase();
    resto.usuario = req.usuario._id;
    

    const publicacion = await Publicacion.findByIdAndUpdate(id, resto, {new: true})

    res.status(200).json({
        publicacion
    })
}

const eliminarPublicacion = async( req, res=response) =>{
    const { id } = req.params;

    const publicacionAux=await Publicacion.findById(id)
    if(!publicacionAux.estado){
        return res.json({
            msg:'No existe la publicacion'
        })
    }

    const publicacion = await Publicacion.findByIdAndUpdate(id,{estado:false}, {new : true});
    
    /* Eliminando de compartido y de like PNDIENTE*/
    const p1=await Like.find({
        $or:[{estado:true}],
        $and:[{publicacion:ObjectId(publicacion._id)}],
    })
    const p2=await Like.findByIdAndUpdate(p1._id,{estado:false},{new:true})
    
    const p11=await compartir.find({
        $or:[{estado:true}],
        $and:[{publicacion:ObjectId(publicacion._id)}],
    })
    const p111=await compartir.findByIdAndUpdate(p11._id,{estado:false},{new:true})
    
    console.log(p2,p111);
/*     const p22=await compartir.findByIdAndUpdate(p11._id,{estado:false},{new:true})
    const p233 = await like.find({
        $or:[{estado:true}],
        $and:[{publicacion:ObjectId(publicacion._id)}]
    })
    const a555 = await like.findByIdAndUpdate(p233._id,{estado:flse},{new:true}) 
 */
    res.json({
        publicacion
    })

}

module.exports = {
    registraPublicaciones,
    actualizarPublicacion,
    eliminarPublicacion,
    mostrarPublicaciones,
    mostrarPublicacione
}