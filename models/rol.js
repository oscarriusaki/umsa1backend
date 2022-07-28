const { model, Schema } = require("mongoose")

const SchemaRol = Schema({
    rol:{
        type:String,
        required:[true,'El rol es requerido'],

    }
})

module.exports = model('Rol',SchemaRol)