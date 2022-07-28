const { response } = require('express');
const jwt = require('jsonwebtoken');  
const { Usuario } = require('../models')

const validarJWT = async ( req,res = response, next) => {
    const token = req.header('x-token');
    if(!token){
        return res.status(400).json({
            msg:'El token no se ha enviado'
        })
    }
// ESTO TAMBIEN VERIFICA QUE EL JWT EXPIRA
// jwt.verify(token, process.env.SECRETORPRIVATEKEY,(err,decode) =>{
//             if(err){
//                 console.log(err)
//                 console.log('SI ESTA ')
//             }
//         });
    try{
        
        const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
        const usuario = await Usuario.findById(uid);
        if(!usuario){
            return res.status(400).json({
                msg:'El usuario no existe en la base de datos'
            })
        }
        if(!usuario.estado){
            return res.status(400).json({
                msg:'El usuario del token esta con estado false'
            })
        }

       req.usuario = usuario;
       next();

    }catch (err) {
        // AQUI VERIFICA QUE EXPIRA EL TOKEN Y OTROS ERRORES
        console.log(err);
        return res.json({
            msg:'expiro'
        })
    }

}

module.exports = {
    validarJWT
}
