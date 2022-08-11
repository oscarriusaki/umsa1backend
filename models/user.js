const { model, Schema } = require('mongoose');

const UsuarioSchema = Schema({
    nombre:{
        type:String,
        required:[true,'El nombre es requerido']
    },
    apellidoPaterno:{
        type:String,
        /* required: [true,'El apellido paterno es requerido'] */
    },
    apellidoMaterno:{
        type: String,
        /* required: [true,'El apellido materno es requerido'] */
    },
    estado:{
        type: Boolean,
        required:true,
        default:true
    },
    correo:{
        type:String ,
        required:[true,'El email es requerido'],
        unique:true
    },
    password:{
        type: String,
        required:[true,'El password es requerido']
    },
    rol:{
        type: String,
        required: true,
        emu:['USER_ROL']
    },
    fecha:{
        type: Date,
        required:[true,'La fecha es requerida']
    },
    motivo:{
        type:String,
        required:[true,'El motivo es requerido'],
        default:''
    }

})

UsuarioSchema.methods.toJSON= function(){
    const { __v, password, _id,...resto } = this.toObject();
    resto.uid = _id;
    return resto;
}

module.exports = model('User', UsuarioSchema)