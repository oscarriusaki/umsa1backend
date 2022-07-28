const res = require("express/lib/response");
const { Comentario } = require('../models');

const validarIdcomentario = async (id='') => {
    const codigo = await Comentario.findById(id);
    if(!codigo){
        return res.json({
            msg:'El id no esta registrado en la base de datos'
        })
    }
}

module.exports = {
    validarIdcomentario
}