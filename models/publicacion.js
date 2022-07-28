const { Schema, model } = require('mongoose');

const SchemaPublicaicon= Schema({
    descripcion:{
        type:String,
        required:true,
        default:'',
    },
    contenido:{
        type:String,
        required:true,
        default:'',
    },
    tipoEnfermedad:{
        type:String,
        required:true,
        default:'',
    },
    usuario:{
        type:Schema.Types.ObjectId,
        ref:'User',
        required:[true, 'El usuario es obligatorio'],
    },
    fecha:{
        type:Date,
        require:[true, 'La fecha es requerida'],
    },
    CantidadLikes:{
       type:Number,
       default:0,            
    },
    CantidadComentarios:{
       type:Number,
       default:0,        
    },
    CantidadCompartidos:{
       type:Number,
       default:0, 
    },
    estado:{
        type:Boolean,
        default:true,
        required:true,
    },
    UsuarioLike:{
        type:Schema.Types.ObjectId,
        ref:'User',
        
    },
    like:{
        type:Boolean,
        default:false,
        required:true,
    },
    compartir:{
        type:Boolean,
        default:false,
        required:true,
    },
    CantidadReportar:{
        type: Number,
        default: 0
    },
    reportar:{
        type: Boolean,
        default: false
    }
    
},{
    // 
    versionKey:false,
    // Este sirve para ver cuando se ha creado el modelo y cuando se ha actualizado
    timestamps:true,
    
})

SchemaPublicaicon.methods.toJSON = function(){
    const { __v, _id,...data } = this.toObject();
    data.uid = _id;
    return data;
}

module.exports = model('Publicacion',SchemaPublicaicon);
