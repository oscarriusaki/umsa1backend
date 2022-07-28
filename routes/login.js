const { Router } = require('express');
const { check } = require('express-validator');
const { login } = require('../controller/login');
const { existeCorreo } = require('../helpers/validar-campos');
const { validar } = require('../middlewares/verifica');

const router = Router();


router.post('/',[
    check('correo','El email no es valido').isEmail(),
    check('password','El password es obligatorio y debe tener almenos 9 caracteres').isLength({min:9}),
    validar
],login);

module.exports = router