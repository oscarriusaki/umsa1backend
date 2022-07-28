const { Schema, model } = require('mongoose');

const SchemaComnetario = Schema({
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        // required: [true, 'El usuarioes requerido']
    },
    contenido:{
        type:String,
        required:[true, 'El comentario es obligatorio'],
        default:''
    },
    cantidadComentarios: {
        type:Number,
        default: 0
    },
    cantidadLikes: {
        type: Number,
        default: 0
    },
    compartidos: {
        type: Number,
        default: 0
    },
    cantidadReportar:{
        type: Number,
        default: 0
    },
    reportar:{
        type: Boolean,
        default: false
    },
    estado:{
        type: Boolean,
        required:true,
        default:true
    },
    fecha:{
        type:Date,
        required: [true,'La fecha es requerida']
    },
    publicacion: {
        type: Schema.Types.ObjectId,
        ref:'Publicacion'
    },
    like:{
        type: Boolean,
        default:false,
        required:true
    },

})

SchemaComnetario.methods.toJSON = function (){
    const { __v,_id, ...dato } = this.toObject();
    dato.uid = _id
    return dato; 
}

module.exports = model('Comentario',SchemaComnetario);
