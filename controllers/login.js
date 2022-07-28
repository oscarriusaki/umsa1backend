const { response } = require("express");
const { Usuario } = require("../models");
const bcryptjs = require('bcryptjs');
const { generarJWT } = require("../helpers/generarJWT");

const login = async( req, res=response) =>{
    const { correo , password} = req.body;
    
    try{
        const usuario = await Usuario.findOne({correo}) 
        if(!usuario){
            return res.status(400).json({
                msg:'Error de correo'
            })
        }
        if(!usuario.estado){
            return res.status(400).json({
                msg:'El usuario no existe'
            })
        }
    
        const verificarPassword = bcryptjs.compareSync(password, usuario.password)
        if(!verificarPassword){
            return res.status(400).json({
                msg:'Error de password'
            })
        }
        const token = await generarJWT(usuario.id);
     
        res.status(200).json({
             usuario,
             token
        })
    }catch(err){
        res.satus(400).json({
            msg:'Error hable con el administrador'
        })
    }
}

module.exports = {
    login
}