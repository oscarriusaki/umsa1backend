const { validar } = require("../middlewares/verifica");

const { Router } =require('express');
const { buscar } = require("../controller/buscar");
const { validarJWT } = require("../middlewares/validarJWT");
const { check } = require("express-validator");

const router = Router();

router.get('/:parametro/:id',[
    validarJWT,
],buscar);

module.exports = router;