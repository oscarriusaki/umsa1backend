const { response } = require("express");
const res = require("express/lib/response");
const { Publicacion,Like, Compartir, Comentario, Reportar, ReportarComentario, Usuario } = require("../models");
const { ObjectId } = require('mongoose').Types;
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken')

const permitidos = [
    "likePublicacion",
    "likeComentario",
    "compartir",
    "mostrarTodasLasPublicaciones",
    "mostrarPublicacionesDelUsuarioX",
    "buscarLikeUsuariox",
    "buscarCompartirUsusriox",
    "buscarConParametroX",
    "buscarPorTipoEnfermedad",
    "buscarComentarioDePublicacionX",
    "reportarPublicacion",
    "reportarComentario",
    "usuarioActual",
    "buscarContarPorEnfermedad",
    "mostrarUnaPublicacionX",
    "usuarioActual1",
    "buscarLikeUsuariox1",
    "buscarCompartirUsusriox1",
    "mostrarPublicacionesDelUsuarioX1",
    "actualizarPassword",
    "validarToken",
];
const enfermedadesV={
    'ÁNTRAX':0,
    'ASMA':0,
    'AUTISMO':0,
    'ARTRITIS':0,
    'CÁNCER':0,
    'CLAMIDIA':0,
    'CULEBRILLA (HERPES ZÓSTER)':0,
    'DÉFICIT DE ATENCIÓN E HIPERACTIVIDAD':0,
    'DIABETES':0,
    'ÉBOLA':0,
    'EMBARAZO Y ETS':0,
    'ENFERMEDADES DE TRANSMISIÓN SEXUAL (ETS)':0,
    'ENFERMEDAD INFLAMATORIA PÉLVICA (EIP)':0,
    'ENFERMEDAD PULMONAR OBSTRUCTIVA CRÓNICA':0,
    'EPILEPSIA':0,
    'ESCARLATINA':0,
    'ESTREPTOCOCO DEL GRUPO B':0,
    'GONORRHEA':0,
    'HAEMOPHILUS INFLUENZAE TIPO B (HIB)':0,
    'HEMOFILIA':0,
    'HERPES GENITAL':0,
    'INFECCÍON GENITAL POR VPH':0,
    'INFLUENZA (GRIPE)':0,
    'LA SALUD MENTAL DE LOS NIÑOS (CHILDREN’S MENTAL HEALTH)':0,
    'LISTERIA (LISTERIOSIS)':0,
    'MENINGITIS':0,
    'NEUMONÍA':0,
    'PAPERAS':0,
    'POLIOMIELITIS':0,
    'RABIA':0,
    'REUMATISMO':0,
    'ROTAVIRUS':0,
    'SHIGELLA – SHIGELLOSIS':0,
    'SÍFILIS':0,
    'SILICOSIS':0,
    'SÍNDROME ALCOHÓLICO FETAL':0,
    'SÍNDROME DE FATIGA CRÓNICA (SFC)':0,
    'SÍNDROME DE TOURETTE':0,
    'TABAQUISMO':0,
    'TOSFERINA':0,
    'TRICOMONIASIS':0,
    'TUBERCULOSIS (TB)':0,
    'VAGINOSIS BACTERIANA':0,
    'VIH/SIDA':0,
    'ZIKA':0,
    '#OTRO':0,
  };

const likePublicacion = async ( id, req, res=response) => {
    
    const id_usuarioLogueado = req.usuario._id;
    const publicacion = await Publicacion.findById(id);

    if(!publicacion){
        return res.json({
            msg: 'La publicacion no existe'
        })
    }
    if(!publicacion.estado){
        return res.json({
            msg: 'La publicacion no existe'
        })
    }
    const [ buscarLike , count]= await Promise.all([
        Like.find({
            $or:[{usuarioPublicacion:ObjectId(id_usuarioLogueado)}],
            $and:[{publicacion:ObjectId(publicacion._id)}]
        })
        .sort({_id:-1}),
        Like.countDocuments({
            $or:[{usuarioPublicacion:ObjectId(id_usuarioLogueado)}],
            $and:[{publicacion:ObjectId(publicacion._id)}]
        })
    ])
  
    if(count>=1){

        // ESTO SOO SIRVE PARA QUE EL PROGRAMA MANTENGA EL DATO Y NO LO ELIMINE DE FORMA PERMANENTE
        // PERO NO ESTA BIEN EL CODIGO , PERO LA LOGICA ES ESTA
        if(buscarLike[0].estado){
            buscarLike[0].estado=false;
            const iid=buscarLike[0]._id+'';
            const likeModificado2 = await Like.findByIdAndUpdate(iid,buscarLike[0],{new:true});  

            publicacion.CantidadLikes = publicacion.CantidadLikes - 1;
            const publicacionModificada2 = await Publicacion.findByIdAndUpdate(id,publicacion,{new:true});

            return res.json({
                publicacionModificada2,
                likeModificado2
            })  
        }
        if(!buscarLike[0].estado){
            buscarLike[0].estado=true;
            const iid=buscarLike[0]._id+'';
            const likeModificado2 = await Like.findByIdAndUpdate(iid,buscarLike[0],{new:true});    

            publicacion.CantidadLikes = publicacion.CantidadLikes + 1;
            const publicacionModificada2 = await Publicacion.findByIdAndUpdate(id,publicacion,{new:true});

            return res.json({
                publicacionModificada2,
                likeModificado2
            })  
        }
    }

    const idUsuarioPublicacion = publicacion.usuario;

    const data={
        usuarioPublicacion:id_usuarioLogueado,
        publicacion:publicacion._id,
        idDePublicacionUsuario:idUsuarioPublicacion
    }
    const like = await new Like(data);
    await like.save();

    publicacion.CantidadLikes = publicacion.CantidadLikes + 1;
    const publicacionModificada = await Publicacion.findByIdAndUpdate(id, publicacion, {new:true});

    res.json({
        publicacionModificada,
        like
    })


}

const likeComentario = async (id, req, res=response) => {
    
    const id_usuarioLogueado = req.usuario._id;
    const comentario = await Comentario.findById(id);

    if(!comentario){
        return res.json({
            msg:'El comentario no existe'
        })
    }
    if(!comentario.estado){
        return res.json({
            msg:'El comentario no existe'
        })
    }
    const [ comentarioLike, count ] = await Promise.all([
        Like.find({
            $or:[{usuarioComentario:ObjectId(id_usuarioLogueado)}],
            $and:[{comentario:ObjectId(comentario._id)}]
        })
        .sort({_id:-1}),
        Like.countDocuments({
            $or:[{usuarioComentario:ObjectId(id_usuarioLogueado)}],
            $and:[{comentario:ObjectId(comentario._id)}]
        })
    ]) 
    if(count >= 1){
        if(comentarioLike[0].estado){
            
            comentarioLike[0].estado = false;
            const idAux=comentarioLike[0]._id+'';
            const likeModificado3 = await Like.findByIdAndUpdate(idAux,comentarioLike[0],{new:true});

            comentario.cantidadLikes = comentario.cantidadLikes - 1;
            const comentarioModificado4 = await Comentario.findByIdAndUpdate(id, comentario, {new:true})

            return res.json({
                comentarioModificado4,
                likeModificado3
            })

        }
        if(!comentarioLike[0].estado){
            comentarioLike[0].estado = true;

            const idAux=comentarioLike[0]._id+'';
            const likeModificado3 = await Like.findByIdAndUpdate(idAux,comentarioLike[0],{new:true})

            comentario.cantidadLikes = comentario.cantidadLikes + 1;
            const comentarioModificado4 = await Comentario.findByIdAndUpdate(id, comentario, {new:true})

            return res.json({
                comentarioModificado4,
                likeModificado3
            })

        }
    }

    const idUsuarioComentario = comentario.usuario;

    const data= {
        usuarioComentario: id_usuarioLogueado,
        comentario: comentario._id,
        idDeComentarioUsuario: idUsuarioComentario,
    }

    const like = await new Like(data);
    await like.save()

    comentario.cantidadLikes = comentario.cantidadLikes + 1;
    const coemntarioModificado = await Comentario.findByIdAndUpdate(id, comentario, {new:true});

    res.json({
        
        coemntarioModificado,
        comentario
    })

}

const compartir = async (id, req, res=response) => {
    
    const id_usuarioLogueado = req.usuario._id;
    const publicacion = await Publicacion.findById(id);

    if(!publicacion){
        return res.json({
            msg:'La publicacion no existe en la base de datos'
        })
    }
    
    const [compartirUsuario, count] = await Promise.all([
        Compartir.find({
           $or:[{usuario:ObjectId(id_usuarioLogueado)}],                
           $and:[{publicacion:ObjectId(publicacion._id)}]            
        }),
        Compartir.countDocuments({
           $or:[{usuario:ObjectId(id_usuarioLogueado)}],                
           $and:[{publicacion:ObjectId(publicacion._id)}]            
        })
    ])
    console.log(compartirUsuario);
    // buscarConParametroX
    if(count >= 1){
        if(compartirUsuario[0].estado){
            
            compartirUsuario[0].estado=false;
            const compartirModificado = await Compartir.findByIdAndUpdate(compartirUsuario[0]._id,compartirUsuario[0],{new:true});

            publicacion.CantidadCompartidos = publicacion.CantidadCompartidos - 1;
            const publicacionModificada5 = await Publicacion.findByIdAndUpdate(id,publicacion,{new:true});

            return res.json({
                publicacionModificada5,
                compartirModificado
            })

        }
        if(!compartirUsuario[0].estado){

            compartirUsuario[0].estado=true;
            const compartirModificado = await Compartir.findByIdAndUpdate(compartirUsuario[0]._id,compartirUsuario[0],{new:true});

            publicacion.CantidadCompartidos = publicacion.CantidadCompartidos +1;
            const publicacionModificada5 = await Publicacion.findByIdAndUpdate(id,publicacion,{new:true});

            return res.json({
                compartirModificado,
                publicacionModificada5
            })
        }
    }

    const idDePublicacionUsuario = publicacion.usuario ;

    const data = {
        usuario:id_usuarioLogueado,
        publicacion:publicacion._id,
        idDePublicacionUsuario:idDePublicacionUsuario,
    }
    const compartir = await new Compartir(data);
    await compartir.save();

    publicacion.CantidadCompartidos = publicacion.CantidadCompartidos + 1;
    const publicacionModificada = await Publicacion.findByIdAndUpdate(id,publicacion, {new:true});

    res.json({
        publicacionModificada,
        compartir
    })
}
const mostrarTodasLasPublicaciones = async (idd,req,res=response) => {//........................................
    const id = req.usuario._id;
    let limite = idd*20;
    let salto = limite-20; 
 
    const [ publicacion, count ,countTotal] = await Promise.all([
        Publicacion.find({
            $or:[{estado: true}],
        })
        .populate('usuario')
        .sort({_id:-1})
        .skip (Number(salto))
        .limit(Number(20)),
        Publicacion.countDocuments({
            $or:[{estado: true}]
        })
        .skip (Number(salto))
        .limit(Number(20)),
        Publicacion.countDocuments({
            $or:[{estado: true}]
        })
    ])

    const likes = await Like.find({
        $or:[{ usuarioPublicacion: ObjectId(id)}],
        $and:[{estado:true}]
    })
    const compartir = await Compartir.find({
        $or:[{usuario:ObjectId(id)}],
        $and:[{estado: true}]
    })
    const reportados = await Reportar.find({
        $or:[{usuario:ObjectId(id)}],
        $and:[{estado: true}]
    })
    const objAux =[]
    for(const iterator of publicacion){
        const auxObj = await new Publicacion(iterator);
        for (const iterator2 of likes) {
            if((iterator2.publicacion+'') === (iterator._id +'')){
                auxObj.like=true;
                console.log('iteratir2',iterator2);
            }
        }
        for (const iterator3 of compartir) {
            if((iterator3.publicacion+'') === (iterator._id+'')){
                auxObj.compartir = true;
            }
        }
        for (const iterator3 of reportados) {
            if((iterator3.publicacion+'') === (iterator._id+'')){
                auxObj.reportar = true;
            }
        }
        objAux.push(auxObj);
    }
    if(count === 0 ){
        return res.json({
            msg:'No existe publicaiones'
        })
    }
    res.json({
        countTotal,
        count,
        objAux,
    })
}

const mostrarUnaPublicacionX = async (id,req,res=response) => {
    const id_usuario = req.usuario._id;
    const [ publicacion ] = await Promise.all([
        Publicacion.findById(id)
        .populate('usuario')
    ])
    const likes = await Like.find({
        $or:[{ usuarioPublicacion: ObjectId(id_usuario)}],
        $and:[{estado:true}]
    })
    const compartir = await Compartir.find({
        $or:[{usuario:ObjectId(id_usuario)}],
        $and:[{estado: true}]
    })
    const reportados = await Reportar.find({
        $or:[{usuario:ObjectId(id_usuario)}],
        $and:[{estado: true}]
    })
        const auxObj = await new Publicacion(publicacion);
        console.log('AUXoBJ: ',auxObj);
        for (const iterator2 of likes) {
            if((iterator2.publicacion+'') === (auxObj._id +'')){
                auxObj.like=true;
            }
        }
        for (const iterator3 of compartir) {
            if((iterator3.publicacion+'') === (auxObj._id+'')){
                auxObj.compartir = true;
            }
        }
        for (const iterator3 of reportados) {
            if((iterator3.publicacion+'') === (auxObj._id+'')){
                auxObj.reportar = true;
                console.log('iteratir3',iterator3);
            }
        }
    res.json({
        auxObj
    })
}
const mostrarPublicacionesDelUsuarioX = async (req,res=response) => {

    const id = req.usuario._id;
    const [publicaciones,count] = await Promise.all([
        Publicacion.find({
            $or:[{estado: true}],
            $and:[{usuario: ObjectId(id)}]
        })
        .populate('usuario')
        .sort({_id:-1}),
        Publicacion.countDocuments({
            $or:[{estado: true}],
            $and:[{usuario: ObjectId(id)}]
        })
    ])
    const [ likes, count2 ] = await Promise.all([
        Like.find({
            $or:[{usuarioPublicacion:ObjectId(id)}],
            $and:[{estado:true}]
        })
    ])
    const [ compartir, count3] = await Promise.all([
        Compartir.find({
            $or:[{usuario:ObjectId(id)}],
            $and:[{estado:true}]
        })
    ])
    const [ reportados, count4] = await Promise.all([
        Reportar.find({
            $or:[{usuario:ObjectId(id)}],
            $and:[{estado:true}]
        })
    ])
    const objAux2=[]
    for(const iterator of publicaciones ){

        const objId=await new Publicacion(iterator);
        for(const iterator2 of likes){

            if((iterator2.publicacion + '') === (iterator._id+'')){
                objId.like = true;
            }
        }
        for(const iterator3 of compartir){

            if((iterator3.publicacion + '') === (iterator._id+'')){
                objId.compartir = true;
            }
        }
        for (const iterator3 of reportados) {
            if((iterator3.publicacion+'') === (iterator._id+'')){
                objId.reportar = true;
            }
        }

        objAux2.push(objId)
    }

    if(count === 0 ){
        const count=0;
        return res.json({
            count,
            msg: 'No existe publicaciones'
        })
    }
    res.json({
        count,
        objAux2
    })

}
const buscarLikeUsuariox = async(req,res=response) =>{
    
    const idUsuarioLogueado = req.usuario._id;

    const [todasPublicaciones, count] = await Promise.all([
        Publicacion.find({
            $or: [{estado:true}],
        })
        .populate('usuario')
        .sort({_id:-1})
        ,
        Publicacion.countDocuments({
            $or: [{estado:true}],
        })
        ,
    ])
    const [likes,count22] = await Promise.all([
        Like.find({
            $or:[{estado:true}],
            $and:[{usuarioPublicacion:ObjectId(idUsuarioLogueado)}]
        })
        .sort({_id:-1}),
        Like.countDocuments({
            $or:[{estado:true}],
            $and:[{usuarioPublicacion:ObjectId(idUsuarioLogueado)}]
        })
    ])

    const [compartidosAux, count3] = await Promise.all([
        Compartir.find({
            $or: [{estado:true}],
            $and:[{usuario:ObjectId(idUsuarioLogueado)}]
        }),
        Compartir.countDocuments({
            $or: [{estado:true}],
            $and:[{usuario:ObjectId(idUsuarioLogueado)}]
        }),
    ])
    const [reportados, count4] = await Promise.all([
        Reportar.find({
            $or: [{estado:true}],
            $and:[{usuario:ObjectId(idUsuarioLogueado)}]
        }),
        Reportar.countDocuments({
            $or: [{estado:true}],
            $and:[{usuario:ObjectId(idUsuarioLogueado)}]
        }),
    ])

    const axumostrar = [];
    let count2 = 0;
    for (const iterator of todasPublicaciones) {
        const auxlike = await new Publicacion(iterator);

        for (const iterator3 of compartidosAux) {
            if((auxlike._id+'') === (iterator3.publicacion+'') ){
                auxlike.compartir=true
            }
        }
        for (const iterator3 of reportados) {
            if((iterator3.publicacion+'') === (auxlike._id+'')){
                auxlike.reportar = true;
            }
        }
        for (const iterator2 of likes) {
            if((auxlike._id+'')===(iterator2.publicacion+'')){
                auxlike.like=true;
                axumostrar.push(auxlike);
                count2++;
            }
        }
    }

    res.json({
        count2,
        axumostrar
    })

} 
const buscarCompartirUsusriox = async(req,res=response) =>{

    const id = req.usuario._id;
    
    const [publicacionesAux, count] = await Promise.all([
        Publicacion.find({
            $or:[{estado:true}]
        })
        .populate('usuario')
        .sort({_id:-1}),
        Publicacion.countDocuments({
            $or:[{estado:true}]
        }),
    ])

    const [ compartidos, count22] = await Promise.all([
        Compartir.find({
            $or:[{estado:true}],
            $and:[{usuario:ObjectId(id)}],
        })
        .sort({_id:-1})
        ,Compartir.countDocuments({
            $or:[{estado:true}],
            $and:[{usuario:ObjectId(id)}],
        })
    ])   

    const [ likes,count3 ] = await Promise.all([
        Like.find({
            $or:[{usuarioPublicacion:ObjectId(id)}],
            $and:[{estado:true}]
        })
        ,Like.countDocuments({
            $or:[{usuarioPublicacion:ObjectId(id)}],
            $and:[{estado:true}]
        })
    ])

    const [ reportados,count4 ] = await Promise.all([
        Reportar.find({
            $or:[{usuarioPublicacion:ObjectId(id)}],
            $and:[{estado:true}]
        })
        ,Reportar.countDocuments({
            $or:[{usuarioPublicacion:ObjectId(id)}],
            $and:[{estado:true}]
        })
    ])
    const contenido = [];
    let count2=0;
    for (const iterator of publicacionesAux) {
        const auxPublicacion = await new Publicacion(iterator);
        
        for (const iterator2 of likes) {
            if((auxPublicacion._id+'')===(iterator2.publicacion+'')){
                auxPublicacion.like=true;
            }
        }
        for (const iterator3 of reportados) {
            if((iterator3.publicacion+'') === (auxPublicacion._id+'')){
                auxPublicacion.reportar = true;
            }
        }
        for (const iterator3 of compartidos) {
            if((auxPublicacion._id+'')===(iterator3.publicacion+'')){
                auxPublicacion.compartir = true;
                contenido.push(auxPublicacion);
                count2++;
            }
        }
    }
    res.json({
        count2, 
        contenido
    })
}
const buscarConParametroX = async(busqueda='',req,res=response) =>{ 
    const id = req.usuario._id;

    const [ publicacion, count] = await Promise.all([
        Publicacion.find({
            $or:[{estado: true}],
        })
        .populate('usuario')
        .sort({_id:-1}),
        Publicacion.countDocuments({
            $or:[{estado: true}]
        }),
    ])
    const likes = await Like.find({
        $or:[{ usuarioPublicacion: ObjectId(id)}],
        $and:[{estado:true}]
    })
    const compartir = await Compartir.find({
        $or:[{usuario:ObjectId(id)}],
        $and:[{estado: true}]
    })
    const reportados = await Reportar.find({
        $or:[{usuario:ObjectId(id)}],
        $and:[{estado: true}]
    })
    const objAux =[]
    for(const iterator of publicacion){
        const auxObj = await new Publicacion(iterator);
        console.log('AUXoBJ: ',auxObj);
        for (const iterator2 of likes) {
            if((iterator2.publicacion+'') === (iterator._id +'')){
                auxObj.like=true;
                console.log('iteratir2',iterator2);
            }
        }
        for (const iterator3 of compartir) {
            if((iterator3.publicacion+'') === (iterator._id+'')){
                auxObj.compartir = true;
                console.log('iteratir3',iterator3);
            }
        }
        for (const iterator3 of reportados) {
            if((iterator3.publicacion+'') === (iterator._id+'')){
                auxObj.reportar = true;
            }
        }
        objAux.push(auxObj);
    }
    if(count === 0 ){
        res.json({
            msg:'No existe publicaiones'
        })
    }
    const objAux3 = [];
    let contadorAuxiliar=0;
    for (const iterator of objAux) {
        const parametroAuxiliar = await new Publicacion(iterator)
        const dato = (iterator.descripcion.toUpperCase()).normalize('NFD').replace(/[\u0300-\u036f]/g,"");
        if(dato.includes(busqueda.toUpperCase())){
            objAux3.push(parametroAuxiliar);
            contadorAuxiliar++;
        }
    }

    res.json({
        contadorAuxiliar,
        objAux3
    })
}
const buscarPorTipoEnfermedad = async (busqueda='', req,res=response) =>{
    const id = req.usuario._id;

    const [ publicacion, count] = await Promise.all([
        Publicacion.find({
            $or:[{estado: true}],
        })
        .populate('usuario')
        .sort({_id:-1}),
        Publicacion.countDocuments({
            $or:[{estado: true}]
        })
    ])
    const likes = await Like.find({
        $or:[{ usuarioPublicacion: ObjectId(id)}],
        $and:[{estado:true}]
    })
    const compartir = await Compartir.find({
        $or:[{usuario:ObjectId(id)}],
        $and:[{estado: true}]
    })
    const reportados = await Reportar.find({
        $or:[{usuario:ObjectId(id)}],
        $and:[{estado: true}]
    })
    const objAux =[]
    for(const iterator of publicacion){
        const auxObj = await new Publicacion(iterator);
        console.log('AUXoBJ: ',auxObj);
        for (const iterator2 of likes) {
            if((iterator2.publicacion+'') === (iterator._id +'')){
                auxObj.like=true;
                console.log('iteratir2',iterator2);
            }
        }
        for (const iterator3 of compartir) {
            if((iterator3.publicacion+'') === (iterator._id+'')){
                auxObj.compartir = true;
                console.log('iteratir3',iterator3);
            }
        }
        for (const iterator3 of reportados) {
            if((iterator3.publicacion+'') === (iterator._id+'')){
                auxObj.reportar = true;
            }
        }
        objAux.push(auxObj);
    }
    if(count === 0 ){
        res.json({
            msg:'No existe publicaiones'
        })
    }
    const objAux3 = []
    let contadorAuxiliar=0;
    for (const iterator of objAux) {
        const parametroAuxiliar = await new Publicacion(iterator)
        const dato = iterator.tipoEnfermedad.toUpperCase();
        if(dato.includes(busqueda.toUpperCase())){
            objAux3.push(parametroAuxiliar);
            contadorAuxiliar++;
        }
    }
    res.json({
        contadorAuxiliar,
        objAux3
    })
}
const buscarComentarioDePublicacionX = async (id,req,res=response) =>{ // aqui///

    const idLogueado=req.usuario._id
    const publicacion = await Publicacion.findById(id);
    if(!publicacion.estado){
        return res.json({
            msg: 'La publicaicon no existe y no se puede buscar los comentarios'
        })
    }
    const [comentarios,count] = await Promise.all([
        Comentario.find({
            $or: [{estado: true}],
            $and:[{publicacion:ObjectId(id)}]
        })
        .populate('publicacion')
        .populate('usuario')
        .sort({_id:-1})
        ,Comentario.countDocuments({
            $or: [{estado: true}],
            $and:[{publicacion:ObjectId(id)}]
        }),
    ])
    const  [like, count2] = await Promise.all([
        Like.find({
            $or:[{usuarioComentario:ObjectId(idLogueado)}],
            $and:[{estado: true}]
        })
        .populate('usuarioComentario')
        // .populate('comentario')
        ,Like.countDocuments({
            $or:[{usuarioComentario:ObjectId(idLogueado)}],
            $and:[{estado: true}]
        })
    ])
    const [ reportados, count5 ] = await Promise.all([
        ReportarComentario.find({
                $or:[{usuario:ObjectId(idLogueado)}],
                $and:[{estado:true}]
            })
    ])
    const arr = [];
    let contadorAuxiliar = 0;
    
    for (const iterator of comentarios) {
        const comentarioAxuliar = await new Comentario(iterator);
        for (const iterator2 of like) {
            if((comentarioAxuliar._id+'')=== (iterator2.comentario+'')){
                comentarioAxuliar.like=true;
                contadorAuxiliar++;
            }
        }
        for (const iterator4 of reportados) {
            if((comentarioAxuliar._id+'')=== (iterator4.comentario+'')){
                comentarioAxuliar.reportar = true;
            }
        }
        arr.push(comentarioAxuliar);

    }
    res.json({
        contadorAuxiliar,
        arr,
        idLogueado
    })

}
const reportarPublicacion = async (id,req,res=response) =>{

    const id_usuarioLogueado = req.usuario._id;
    const publicacion = await Publicacion.findById(id);

    if(!publicacion){
        return res.json({
            msg: 'La publicacion no existe'
        })
    }
    if(!publicacion.estado){
        return res.json({
            msg: 'La publicacion no existe'
        })
    }
    const [ buscarLike , count]= await Promise.all([
        Reportar.find({
            $or:[{usuario:ObjectId(id_usuarioLogueado)}],
            $and:[{publicacion:ObjectId(publicacion._id)}]
        })
        .sort({_id:-1}),
        Reportar.countDocuments({
            $or:[{usuario:ObjectId(id_usuarioLogueado)}],
            $and:[{publicacion:ObjectId(publicacion._id)}]
        })
    ])
  
    if(count>=1){

        // ESTO SOO SIRVE PARA QUE EL PROGRAMA MANTENGA EL DATO Y NO LO ELIMINE DE FORMA PERMANENTE
        // PERO NO ESTA BIEN EL CODIGO , PERO LA LOGICA ES ESTA
        if(buscarLike[0].estado){
            buscarLike[0].estado=false;
            const iid=buscarLike[0]._id+'';
            const likeModificado2 = await Reportar.findByIdAndUpdate(iid,buscarLike[0],{new:true});  

            publicacion.CantidadReportar = publicacion.CantidadReportar - 1;
            if(publicacion.CantidadReportar >= 51){   
                await Publicacion.findByIdAndUpdate(id,{estado:false},{new:true})
                return res.json({
                    msg:'Eliminado'
                })
            }
            const publicacionModificada2 = await Publicacion.findByIdAndUpdate(id,publicacion,{new:true});


            return res.json({
                publicacionModificada2,
                likeModificado2
            })  
        }
        if(!buscarLike[0].estado){
            buscarLike[0].estado=true;
            const iid=buscarLike[0]._id+'';
            const likeModificado2 = await Reportar.findByIdAndUpdate(iid,buscarLike[0],{new:true});    

            publicacion.CantidadReportar = publicacion.CantidadReportar + 1;
            if(publicacion.CantidadReportar >=51){   
                await Publicacion.findByIdAndUpdate(id,{estado:false},{new:true})
                return res.json({
                    msg:'Eliminado'
                })
            }
            const publicacionModificada2 = await Publicacion.findByIdAndUpdate(id,publicacion,{new:true});

            return res.json({
                publicacionModificada2,
                likeModificado2
            })  
        }
    }

    const idUsuarioPublicacion = publicacion.usuario;

    const data={
        usuario: id_usuarioLogueado,
        publicacion:id,
        fecha:new Date(),
    }
    const repo = await new Reportar(data);
    await repo.save();

    publicacion.CantidadReportar = publicacion.CantidadReportar + 1;
    if(publicacion.CantidadReportar >= 51){   
        await Publicacion.findByIdAndUpdate(id,{estado:false},{new:true});
        return res.json({
            msg:'Eliminado'
        })
    }
    const publicacionModificada = await Publicacion.findByIdAndUpdate(id, publicacion, {new:true});

    res.json({
        publicacionModificada,
        repo
    })


    /* 
    const idUsuarioLogueado =  req.usuario._id;
    const publicacion = await Publicacion.findById(id);

    if(!publicacion){
        return res.json({
            msg:'La publicacion no existe para reportarlo'
        })
    }

    const [report, count] = await Promise.all([
        Reportar.find({
            $or:[{usuario:ObjectId(idUsuarioLogueado)}],
            $and:[{publicacion:ObjectId(id)}],
            and:[{estado:true}]
        })
        .sort({_id:-1}),,
        Reportar.countDocuments({
            $or:[{usuario:ObjectId(idUsuarioLogueado)}],
            $and:[{publicacion:ObjectId(id)}],
            and:[{estado:true}]
        })
    ])
    if(count >=1){ 
        if(report[0].estado){
            report[0].estado=false;
            const reporteModificado = await Reportar.findByIdAndUpdate((report[0]._id+''),report[0],{new:true});
            
            publicacion.CantidadReportar =publicacion.CantidadReportar -1;
            const publicacionX = await Publicacion.findByIdAndUpdate(id, publicacion, {new:true});

            if(publicacionX.CantidadReportar >= 51){
                const publicacionY = await Publicacion.findByIdAndUpdate(id, {estado:false}, {new:true})
                return res.json({
                    msg:'La publicacion Ha sido eliminada por ser reportado muchas veces',
                    publicacionY,
                    reporteModificado
                })
            }

            return res.json({
                msg:'Reporte quitado',
                reporteModificado,
                publicacionX
            })
        }else{
            report[0].estado=true;
            const reporteModificado = await Reportar.findByIdAndUpdate((report[0]._id+''),report[0],{new:true});

            publicacion.CantidadReportar = publicacion.CantidadReportar + 1;
            const publicacionModificadax = await Publicacion.findByIdAndUpdate(id, publicacion, {new:true});
            
            if(publicacionModificadax.CantidadReportar >= 51){
                const publicaiconZ = await Publicacion.findByIdAndUpdate(id, {estado:false},{new: true});
                return res.json({
                    msg:'La publicacion ha sido eliminada por ser reportada varias veces',
                    reporteModificado,
                    publicaiconZ
                })
            }

            return res.json({
                msg:'Publicacion Reportada',
                reporteModificado,
                publicacionModificadax
            })

        }
    }

    publicacion.CantidadReportar = publicacion.CantidadReportar  +1;
    const publicacionModificada = await Publicacion.findByIdAndUpdate(id, publicacion, {new:true});

    const data = {
        usuario: idUsuarioLogueado,
        publicacion:id,
        fecha:new Date(),
    }

    const reportarNuevo = await new Reportar(data);
    await reportarNuevo.save();

    if(publicacionModificada.reportar >= 51){
        await Publicacion.findByIdAndUpdate(id, {estado: false}, {new:true});
        return res.json({
            msg:'La publicacion Se elimino por tener muchos reportes'
        })
    }

    res.json({
        msg:'Publicacion Reportada',
        publicacionModificada,
    }) */

}
const reportarComentario = async (id,req,res=response) =>{

    const usuarioLogueadoId= req.usuario._id;
    const comentario = await Comentario.findById(id);

    if(!comentario){
        return res.json({
            msg:'No exsite el comentario para eliminarlo'
        })
    }
    if(!comentario.estado){
        return res.json({
            msg:'Tiene estado false'
        })
    }

    const [report, count] = await Promise.all([
        ReportarComentario.find({
            $or: [{usuario:ObjectId(usuarioLogueadoId)}],
            $and:[{comentario:ObjectId(comentario._id)}],
            // $and:[{estado:true}]
        }),
        ReportarComentario.countDocuments({
            $or: [{usuario:ObjectId(usuarioLogueadoId)}],
            $and:[{comentario:ObjectId(comentario._id)}],
            // $and:[{estado:true}]
        })
    ])
    console.log(count);
    if(count>=1){
        if(report[0].estado){
            report[0].estado=false;

            const reporteModificado = await ReportarComentario.findByIdAndUpdate((report[0]._id+''),report[0],{new:true});

            comentario.cantidadReportar = comentario.cantidadReportar -1;
            const comentarioModificado = await Comentario.findByIdAndUpdate(id, comentario, {new:true});

            if(comentarioModificado.cantidadReportar >= 51){
                const comentarioy=await Comentario.findByIdAndUpdate(id, {estado:false},{new:true})
                // aqui poner en falso todos los likes del comentario
                return res.json({
                    msg:'Se elimino el comentario por tener muchos reportes',
                    comentarioy,
                    reporteModificado
                })
            }
            const pu = await Comentario.findByIdAndUpdate(id,comentario,{new:true});
            return res.json({
                pu,
                msg:'Reporte quitado',
                comentarioModificado,
                reporteModificado
            })

        }else{
            report[0].estado=true;

            const reporteModificado = await ReportarComentario.findByIdAndUpdate((report[0]._id+''), report[0],{new:true});

            comentario.cantidadReportar = comentario.cantidadReportar +1;
            const comentarioModificado5 = await Comentario.findByIdAndUpdate(id, comentario, {new:true});

            if(comentarioModificado5.cantidadReportar >= 51){
                const comentarioModificado6 = await Comentario.findByIdAndUpdate(id, {estado:false},{new:true});

                return res.json({
                    msg:'Comentario eliminado por tener varios reportes',
                    comentarioModificado6,
                    reporteModificado
                })
            }
            const pu = await Comentario.findByIdAndUpdate(id, comentario,{new:true});
            return res.json({
                pu,
                msg:'Comentario Reportado2',
                comentarioModificado5,
                reporteModificado
            })

        }
    }

    const data = {
        usuario:usuarioLogueadoId,
        comentario:id,
        fecha:new Date()
    }
    const reporteNuevo = await new ReportarComentario(data)
    await reporteNuevo.save();

    comentario.cantidadReportar = comentario.cantidadReportar + 1;
    
    if(comentario.cantidadReportar >= 51){
        await Comentario.findByIdAndUpdate(id, {estado:false}, {new:true})
        return res.json({
            msg:'Eliminado con exito',
            comentario
        })
    }
    const comentarioModificada = await Comentario.findByIdAndUpdate(id, comentario,{new:true})
    res.json({
        msg: 'Comentario reportado',
        comentarioModificada,
        reporteNuevo
    })
}
const usuarioActual = async (id,req, res=response) =>{

    const usuario1  = req.usuario;
    res.json({
        usuario1
    })
}
const usuarioActual1 = async (id,req, res=response) =>{
    
    const usuarioExiste = await Usuario.findById(id);

    if(!usuarioExiste){
        return res.json({
            msg:'El usuario no esta registrado en la base de datos'
        })
    }
    if(!usuarioExiste.estado){
        return res.json({
            msg: 'El usuario esta eliminado'
        })
    }
    res.json({
        usuarioExiste
    })
}
const buscarLikeUsuariox1 = async(id,req,res=response) =>{
    
    const idUsuarioLogueado =  id;
    const usuarioActual = req.usuario._id;
    const [todasPublicaciones, count] = await Promise.all([
        Publicacion.find({
            $or: [{estado:true}],
        })
        .populate('usuario')
        .sort({_id:-1})
        ,Publicacion.countDocuments({
            $or: [{estado:true}],
        })
    ])

    const [likes,count22] = await Promise.all([
        Like.find({
            $or:[{estado:true}],
            $and:[{usuarioPublicacion:ObjectId(idUsuarioLogueado)}]
        })
        .sort({_id:-1}),
        Like.countDocuments({
            $or:[{estado:true}],
            $and:[{usuarioPublicacion:ObjectId(idUsuarioLogueado)}]
        })
    ])

    const [compartidosAux, count3] = await Promise.all([
        Compartir.find({
            $or: [{estado:true}],
            $and:[{usuario:ObjectId(idUsuarioLogueado)}]
        }),
        Compartir.countDocuments({
            $or: [{estado:true}],
            $and:[{usuario:ObjectId(idUsuarioLogueado)}]
        }),
    ])
    const [reportados, count4] = await Promise.all([
        Reportar.find({
            $or: [{estado:true}],
            $and:[{usuario:ObjectId(usuarioActual )}]
        }),
        Reportar.countDocuments({
            $or: [{estado:true}],
            $and:[{usuario:ObjectId(usuarioActual )}]
        }),
    ])

/*  */
const [likes11,] = await Promise.all([
    Like.find({
        $or:[{estado:true}],
        $and:[{usuarioPublicacion:ObjectId(usuarioActual)}]
    })
    .sort({_id:-1})
])

const [compartidosAux11] = await Promise.all([
    Compartir.find({
        $or: [{estado:true}],
        $and:[{usuario:ObjectId(usuarioActual)}]
    })
])
/*  */

    const axumostrar = [];
    let count2 = 0;
    for (const iterator of todasPublicaciones) {
        const auxlike = await new Publicacion(iterator);

        for (const iterator3 of compartidosAux11) {
            if((auxlike._id+'') === (iterator3.publicacion+'') ){
                auxlike.compartir=true
            }
        }
        for (const iterator3 of reportados) {
            if((iterator3.publicacion+'') === (auxlike._id+'')){
                auxlike.reportar = true;
            }
        }
        for (const iterator2 of likes11) {
            if((auxlike._id+'')===(iterator2.publicacion+'')){
                auxlike.like=true;
            }
        }
        for (const iterator2 of likes) {
            if((auxlike._id+'')===(iterator2.publicacion+'')){
                // auxlike.like=true;
                axumostrar.push(auxlike);
                count2++;
            }
        }
    }

    res.json({
        count2,
        axumostrar
    })

}
const buscarCompartirUsusriox1 = async(idd,req,res=response) =>{

    const id = idd;
    const usuarioActual  = req.usuario._id;

    const [publicacionesAux, count] = await Promise.all([
        Publicacion.find({
            $or:[{estado:true}]
        })
        .populate('usuario')
        .sort({_id:-1})
        ,Publicacion.countDocuments({
            $or:[{estado:true}]
        })
    ])

    const [ compartidos, count22] = await Promise.all([
        Compartir.find({
            $or:[{estado:true}],
            $and:[{usuario:ObjectId(id)}],
        })
        .sort({_id:-1})
        ,Compartir.countDocuments({
            $or:[{estado:true}],
            $and:[{usuario:ObjectId(id)}],
        })
    ])   

    const [ likes,count3 ] = await Promise.all([
        Like.find({
            $or:[{usuarioPublicacion:ObjectId(id)}],
            $and:[{estado:true}]
        })
        ,Like.countDocuments({
            $or:[{usuarioPublicacion:ObjectId(id)}],
            $and:[{estado:true}]
        })
    ])
/*  */
const [ compartidos11] = await Promise.all([
    Compartir.find({
        $or:[{estado:true}],
        $and:[{usuario:ObjectId(usuarioActual)}],
    })
    .sort({_id:-1})
])   
const [ likes11 ] = await Promise.all([
    Like.find({
        $or:[{usuarioPublicacion:ObjectId(usuarioActual)}],
        $and:[{estado:true}]
    }) 
])
/*  */
    const [ reportados,count4 ] = await Promise.all([
        Reportar.find({
            $or:[{usuarioPublicacion:ObjectId(usuarioActual)}],
            $and:[{estado:true}]
        })
        ,Reportar.countDocuments({
            $or:[{usuarioPublicacion:ObjectId(usuarioActual)}],
            $and:[{estado:true}]
        })
    ])
    const contenido = [];
    let count2=0;
    for (const iterator of publicacionesAux) {
        const auxPublicacion = await new Publicacion(iterator);
        
        for (const iterator2 of likes11) {
            if((auxPublicacion._id+'')===(iterator2.publicacion+'')){
                auxPublicacion.like=true;
            }
        }
        for (const iterator3 of reportados) {
            if((iterator3.publicacion+'') === (auxPublicacion._id+'')){
                auxPublicacion.reportar = true;
            }
        }
        for (const iterator3 of compartidos11) {
            if((auxPublicacion._id+'')===(iterator3.publicacion+'')){
                auxPublicacion.compartir = true;
            }
        }
        for (const iterator3 of compartidos) {
            if((auxPublicacion._id+'')===(iterator3.publicacion+'')){
                // auxPublicacion.compartir = true;
                contenido.push(auxPublicacion);
                count2++;
            }
        }
    }

    res.json({
        count2, 
        contenido
    }) 
}
const mostrarPublicacionesDelUsuarioX1 = async (idd,req,res=response) => {
    const id =  idd;
    const idUsuarioActual=req.usuario._id

    const [publicaciones,count] = await Promise.all([
        Publicacion.find({
            $or:[{estado: true}],
            $and:[{usuario: ObjectId(id)}]
        })
        .populate('usuario')
        .sort({_id:-1}),
        Publicacion.countDocuments({
            $or:[{estado: true}],
            $and:[{usuario: ObjectId(id)}]
        })
    ])
    const [ likes, count2 ] = await Promise.all([
        Like.find({
            $or:[{usuarioPublicacion:ObjectId(idUsuarioActual)}],
            $and:[{estado:true}]
        })
    ])
    const [ compartir, count3] = await Promise.all([
        Compartir.find({
            $or:[{usuario:ObjectId(idUsuarioActual)}],
            $and:[{estado:true}]
        })
    ])
    const [ reportados, count4] = await Promise.all([
        Reportar.find({
            $or:[{usuario:ObjectId(idUsuarioActual)}],
            $and:[{estado:true}]
        })
    ])
    const objAux2=[]
    for(const iterator of publicaciones ){

        const objId=await new Publicacion(iterator);
        for(const iterator2 of likes){

            if((iterator2.publicacion + '') === (iterator._id+'')){
                objId.like = true;
            }
        }
        for(const iterator3 of compartir){

            if((iterator3.publicacion + '') === (iterator._id+'')){
                objId.compartir = true;
            }
        }
        for (const iterator3 of reportados) {
            if((iterator3.publicacion+'') === (iterator._id+'')){
                objId.reportar = true;
            }
        }

        objAux2.push(objId)
    }

    if(count === 0 ){
        const count=0;
        return res.json({
            count,
            msg: 'No existe publicaciones'
        })
    }
    res.json({
        count,
        objAux2
    })

}
const buscarContarPorEnfermedad = async (c,req,res) =>{
    // db.orders.aggregate([
        // { $match: { status: "A" } },
        // { $group: { _id: "$cust_id", total: { $sum: "$amount" } } },
        // { $sort: { total: -1 } }
    //   ]) 
    const data = await Publicacion.aggregate([
        { $match:{estado:true} },
        { $group: { _id: "$tipoEnfermedad", total:{$sum:1} } },
        { $sort: { total:-1} }
    ])
    res.json({
        data
    })
}
const actualizarPassword = async (id, req, res=response) => {
    // modificar con put
    const usuario = req.usuario;
    const { password } = req.body;
    try{    
        validarPassword = bcryptjs.compareSync(id, usuario.password);
        if(validarPassword){
            const salt = bcryptjs.genSaltSync();
            const pass = bcryptjs.hashSync(password, salt);
            const update = await Usuario.findByIdAndUpdate(usuario._id, {password:pass}, {new:true});
            return res.json({
                update
            })
        }else{
            return res.json({
                msg: 'Antigua contraseña incorrecto'
            })
        }
    }catch(err){
        console.log(err);
        res.json({
            msg:'error al modificar el password'
        })
    }
}
const validarToken = async ( req,res = response) => {
    const token = req.header('x-token');
    if(!token){
        return res.status(400).json({
            msg:'El token no se ha enviado'
        })
    }
// ESTO TAMBIEN VERIFICA QUE EL JWT EXPIRA
        jwt.verify(token, process.env.SECRETORPRIVATEKEY,(err,decode) =>{
            if(err){
                console.log(err)
                console.log('SI ESTA ')
                return res.json({
                    msg:'expiro'
                })
            }
            console.log('todo ok');
            return res.json({
                msg:'todo ok'
            })
        });
    /* try{
        
        const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
        const usuario = await Usuario.findById(uid);
        if(!usuario){
            return res.status(400).json({
                msg:'El usuario no existe en la base de datos'
            })
        }
        if(!usuario.estado){
            return res.status(400).json({
                msg:'El usuario del token esta con estado false'
            })
        }

       req.usuario = usuario;
       next();

    }catch (err) {
        // AQUI VERIFICA QUE EXPIRA EL TOKEN Y OTROS ERRORES
        console.log(err);
        return res.json({
            msg:'expiro'
        })
    } */

}
const buscar = async( req, res= response) =>{
    
    const { id,parametro } = req.params;
    const token = req.header('x-token');
    if(!token){
        return res.json({
            msg:'El token no se ha enviado'
        })
    }
    if(!permitidos.includes(parametro)){
        return res.json({
            msg: `Se requiere uno de estos parametros ${permitidos} `
        })
    }

    switch(parametro){
        case 'likePublicacion':
            likePublicacion(id,req,res);
        break;
        case 'likeComentario':
            likeComentario(id,req,res);
        break;
        case 'compartir':
            compartir(id,req,res);
        break;
        case 'mostrarTodasLasPublicaciones':
            mostrarTodasLasPublicaciones(id,req,res);//.....
        break;
        case 'mostrarPublicacionesDelUsuarioX':
            mostrarPublicacionesDelUsuarioX(req,res);//......../
        break;
        case 'buscarLikeUsuariox':
            buscarLikeUsuariox(req,res);//.........../
        break;
        case 'buscarCompartirUsusriox':
            buscarCompartirUsusriox(req,res);//......../
        break;
        case 'buscarConParametroX':
            buscarConParametroX(id,req,res);//......./
        break;
        case 'buscarPorTipoEnfermedad':
            buscarPorTipoEnfermedad(id,req,res);//.........
        break;
        case 'buscarComentarioDePublicacionX':
            buscarComentarioDePublicacionX(id,req,res);
        break;
        case 'reportarPublicacion':
            reportarPublicacion(id,req,res);
        break;
        case 'reportarComentario':
            reportarComentario(id,req,res);
        break;
        case 'usuarioActual':
            usuarioActual(id,req,res);
        break;
        case 'buscarContarPorEnfermedad':
            buscarContarPorEnfermedad(id,req,res);
        break;
        case 'mostrarUnaPublicacionX':
            mostrarUnaPublicacionX(id,req,res);
        break;
        case 'usuarioActual1':
            usuarioActual1(id,req,res);
        break;
        case 'buscarLikeUsuariox1':
            buscarLikeUsuariox1(id,req,res);
        break;
        case 'buscarCompartirUsusriox1':
            buscarCompartirUsusriox1(id,req,res);
        break;
        case 'mostrarPublicacionesDelUsuarioX1':
            mostrarPublicacionesDelUsuarioX1(id,req,res);
        break;
        case 'actualizarPassword':
            actualizarPassword(id,req,res);
        break;
        case 'validarToken':
            validarToken(req,res);
        break;

        default:
    }
}
module.exports = {
    buscar
}   