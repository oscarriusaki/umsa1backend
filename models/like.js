const { Schema, model } = require('mongoose');

const LikeSchema = Schema({
    usuarioPublicacion: {
        type:Schema.Types.ObjectId,
        ref:'User'
    },
    usuarioComentario: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    publicacion: {
        type: Schema.Types.ObjectId,
        ref: 'Publicacion'
    },
    comentario: {
        type: Schema.Types.ObjectId,
        ref: 'Comentario'
    },
    idDePublicacionUsuario:{
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    idDeComentarioUsuario: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    estado:{
        type: Boolean,
        required: true,
        default: true
    }
    
})

LikeSchema.methods.toJSON = function () {
    const { __v, _id, ...data } = this.toObject();
    data.uid = _id;
    return data;
}

module.exports = model('Like',LikeSchema)




