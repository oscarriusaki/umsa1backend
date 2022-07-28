const { Schema, model } = require('mongoose')

const SchemaReportar = Schema({
    
    usuario:{
        type:Schema.Types.ObjectId,
        ref:'User'
    },
    publicacion:{
        type:Schema.Types.ObjectId,
        ref:'Publicacion'
    },
    comentario:{
        type: Schema.Types.ObjectId,
        ref:'Comentario'
    },
    estado: {
        type:Boolean,
        default: true,
        required:true
    },
    fecha:{
        type:String,
        required:true
    }

})



module.exports = model('Reportar',SchemaReportar)