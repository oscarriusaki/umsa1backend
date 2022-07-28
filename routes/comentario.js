const { Router } = require('express');
const { check } = require('express-validator');
const { crearComentario, actualizarComentario, eliminarComentario, mostrarComentarios, mostrarComentario } = require('../controller/comentario');
const { validarIdPublicacion } = require('../helpers/validar-campo-publicacion');
const { validarIdcomentario } = require('../helpers/validar-id-comentario');
const { validarJWT } = require('../middlewares/validarJWT');
const { validarRoles } = require('../middlewares/validarRoles');
const { validar } = require('../middlewares/verifica');

const router = Router();

router.get('/',mostrarComentarios)

router.get('/:id',[
    validarJWT,
    check('id','El id no es valido').isMongoId(),
    check('id').custom(validarIdcomentario),
    validar
],mostrarComentario);

router.post('/',[
    validarJWT,
    check('publicacion','El id no es valido').isMongoId(),
    check('publicacion').custom(validarIdPublicacion),
    validar
],crearComentario);

router.put('/:id',[
    validarJWT,
    check('id','el id no es valido').isMongoId(),
    check('id').custom(validarIdcomentario),
    validar
],actualizarComentario);

router.delete('/:id',[
    validarJWT,
    validarRoles('ADMIN_ROL','USER_ROL'),
    check('id','El id no es valido').isMongoId(),
    check('id').custom(validarIdcomentario),
    validar
],eliminarComentario)

module.exports = router
