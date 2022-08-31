const { Usuario } = require('../models');

const existeCorreo = async (correo = '') =>{
    
    const existe = await Usuario.findOne({ correo });
    if(existe){
        return new Error(`El correo ${correo} ya esta registrado`);
    }
}
const existeId = async ( id ) =>{

    const error = await Usuario.findById(id)
    if(!error){
        return new Error('El id no existe en la base de datos');
    }
}

module.exports = {
    existeCorreo,
    existeId
}