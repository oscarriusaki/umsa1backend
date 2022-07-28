const { response } = require("express");
const { Publicacion } = require("../models");

const validarIdPublicacion = async(id='') =>{
    const publicacion = await Publicacion.findById(id)
    if(!publicacion){
        return new Error(`El id ${id} no existe en la base de datos`)
    }
}


module.exports = {
    validarIdPublicacion
}