const { Rol, Usuario } = require('../models');

const existeRol = async( rol ) =>{
    const existe = await Rol.findOne({ rol });
    if(!existe){
        return new Error('El rol no esta registrado en la base de datos')
    }
}


const existeCorreo = async (correo = '') =>{
    
    const existe = await Usuario.findOne({ correo });
    if(existe){
        return new Error(`El correo ${correo} ya esta registrado`);
    }

}

const existeId = async ( id ) =>{

    const error = await Usuario.findById(id)

    if(!error){
        return new Error('El id no existe en la de datos registrado');
    }

}

module.exports = {
    existeRol,
    existeCorreo,
    existeId
}