const { Schema, model } = require('mongoose')
const SchemaCompartir = Schema({
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    publicacion: {
        type: Schema.Types.ObjectId,
        ref: 'Publicacion'
    },
    idDePublicacionUsuario: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    estado:{
        type:Boolean,
        required: true,
        default: true
    }
})

SchemaCompartir.methods.toJSON = function () {
    const { __v, _id, ...dato } = this.toObject();
    dato.uid = _id;
    return dato;
}

// module.exports = model('Compartir',SchemaCompartir);
module.exports = model('Compartido',SchemaCompartir);
