const { check } = require('express-validator');
const { Router } = require('express');
const { registraPublicaciones, actualizarPublicacion, eliminarPublicacion, mostrarPublicaciones, mostrarPublicacione } = require('../controller/publicacion');
const { validarIdPublicacion } = require('../helpers/validar-campo-publicacion');
const { validarJWT } = require('../middlewares/validarJWT');
const { validar } = require('../middlewares/verifica');
const { validarRoles } = require('../middlewares/validarRoles');

const router = Router();

router.get('/',mostrarPublicaciones);

router.get('/:id',[
    check('id','El ud no es valido').isMongoId(),
    check('id').custom(validarIdPublicacion),
    validar
], mostrarPublicacione)

router.post('/',[
    validarJWT,
    check('descripcion', 'Se requiere la descripcion').not().isEmpty(),
    check('contenido', 'Se requiere el contenido').not().isEmpty(),
    check('tipoEnfermedad', 'Se requiere el tipo de enfermedad').not().isEmpty(),
    validar
],registraPublicaciones);

router.put('/:id',[
    validarJWT,
    check('id','el id no es valido').isMongoId(),
    check('id').custom(validarIdPublicacion),
    // check('descripcion', 'Se requiere la descripcion').not().isEmpty(),
    // check('contenido', 'Se requiere el contenido').not().isEmpty(),
    // check('tipoEnfermedad', 'Se requiere el tipo de enfermedad').not().isEmpty(),
    validar
],actualizarPublicacion);

router.delete('/:id',[
    validarJWT,
    validarRoles('ADMIN_ROL','USER_ROL'),
    check('id','El id no es valido').isMongoId(),
    check('id').custom(validarIdPublicacion),
    validar
],eliminarPublicacion);

module.exports = router
