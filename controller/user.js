const bcryptjs = require("bcryptjs");
const { request, response } = require("express");
const { generarJWT } = require("../helpers/generarJWT");
const { Usuario } = require("../models");

const getUser = async (req , res =response) => {
    const { id } = req.params
    const usuario = await Usuario.findById(id);

    if(!usuario.estado){
        return res.json({
            msg:'El ususario no existe'
        })
    }
    res.json({
        usuario
    })

}

const getUsers = async (req=request,res=response) => {
    const [usuario,count] = await Promise.all([
        Usuario.find({
            $or:[{estado:true}]
        })
        .sort({_id:-1}),
        Usuario.countDocuments({
            $or:[{estado:true}]
        })
    ])
    if(count===0){
        return res.json({
            msg:'No existe publicaicones en la base de datos'
        })
    }
    res.json({
        count,
        usuario
    })
}

const postUser = async (req,res) => {
    const { estado, __v,...resto } = req.body;
    const usuario = await Usuario(resto);

    try{
        const salt = bcryptjs.genSaltSync();
        usuario.password = bcryptjs.hashSync( resto.password, salt);
        usuario.fecha= new Date();

        const token = await generarJWT(usuario.id);

        await usuario.save();
    
        res.json({
            usuario,
            token
        })
        
    }catch(err){
        return res.json({
            msg:'Hable con el administrador'
        })
    }
}

const putUser = async (req,res) => {

    const { id } = req.params
    const { email, ... resto } = req.body;

    const usuario2 = await Usuario.findById(id);

    if(!usuario2.estado){
        return res.json({
            msg:'El usuario no existe'
        })
    }
    if(resto.password){
        const salt = bcryptjs.genSaltSync();
        resto.password = bcryptjs.hashSync(resto.password, salt);
    }
    const usuario = await Usuario.findByIdAndUpdate(id, resto);
    res.json({
        usuario
    })
}
const deleteUser = async (req,res) => {

    const { id } = req.params

    const existe = await Usuario.findById(id);

    if(!existe.estado){
        return res.json({
            msg: 'El usurio no existe'
        })
    }

    const usuario = await Usuario.findByIdAndUpdate(id,{estado:false})

    res.json({
        usuario
    })
}
const patchUser = (req,res) => {
    res.json({
        ok: true,
        msg: 'api patch - controller'
    })
}

module.exports = {
    getUser,
    getUsers,
    putUser,
    postUser,
    deleteUser,
    patchUser
}