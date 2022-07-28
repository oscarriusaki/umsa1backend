const { response } = require("express")
const { Usuario } = require("../models")

const verificaEmail = async ( req , res = response, next) =>{

    const { correo }= req.body;
    const err = await Usuario.findOne( {correo} );

    if(err){
        return res.status(400).json({
            msg:`Error el correo ${correo} ya esta existe`
        })
    }
    next();
}


module.exports = {
    verificaEmail
}