const { response } = require('express');
const res = require('express/lib/response');
const { Rol }= require('../models')

const validarRoles = (... rols) =>{
    return ( req, res=response ,next ) =>{
        if(!req.usuario){
            return res.status(400).json({
                msg:'El usuario no existe en la base de datos'
            })
        }

        if(!rols.includes(req.usuario.rol)){
            return res.status(400).json({
                msg: `Se requiere uno de destos roles ${rols}`
            })
        }
        next();
    }
}
module.exports = {
    validarRoles
}