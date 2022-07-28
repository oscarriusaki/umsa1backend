const { response } = require("express");
const { validationResult } = require("express-validator");

const validar = ( req , res=response, next) => {
    const error = validationResult(req);
    if(!error.isEmpty()){
        return res.status(400).json(error);
    }
    next();
}

module.exports = {
    validar
}
