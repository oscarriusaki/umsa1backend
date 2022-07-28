const { Router } = require("express");
const { check } = require("express-validator");
const { getUser, postUser, putUser, deleteUser, patchUser, getUsers } = require("../controller/user");
const { existeRol, existeCorreo, existeId } = require("../helpers/validar-campos");
const { validarJWT } = require("../middlewares/validarJWT");
const { validarRoles } = require("../middlewares/validarRoles");
const { validar } = require("../middlewares/verifica");
const { verificaEmail } = require("../middlewares/verificaEmail");
const router = Router();

router.get('/', getUsers);
router.get('/:id',[
    check('id','El id no es valido').isMongoId(),
    check('id').custom(existeId),
    validar
], getUser);
router.post('/',[
    verificaEmail,
    check('nombre','El nombre es requerido').not().isEmpty(),
    check('correo','El Email no es valido').isEmail(),
    check('password','El password es obligatorio y mas de 8 caracteres').isLength({min:9}),
    check('rol').custom(existeRol),
    check('correo').custom(existeCorreo),
    validar 
], postUser);
router.put('/:id',[
    check('id','No es un id valido').isMongoId(),
    check('id').custom(existeId),
    check('rol').custom(existeRol),
    validar
], putUser);
router.delete('/:id',[
    validarJWT,
    validarRoles('ADMIN_ROL','SER_ROL'),
    check('id','No es un id valido').isMongoId(),
    check('id').custom(existeId),
    validar
], deleteUser);
router.patch('/',  patchUser);

module.exports = router
