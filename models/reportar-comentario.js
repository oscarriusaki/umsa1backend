const { Schema, model } = require('mongoose')

const SchemaReportarComentario = Schema({
    
    usuario:{
        type:Schema.Types.ObjectId,
        ref:'User'
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



module.exports = model('ReportarComentario',SchemaReportarComentario)