const Usuario = require('./user');
const Rol = require('./rol');
const Publicacion = require('./publicacion');
const Comentario = require('./comentario');
const Like = require('./like');
const Compartir= require('./compartir'); 
const Reportar = require('./reportar')
const ReportarComentario = require('./reportar-comentario')

module.exports = {
    Usuario,
    Rol,
    Publicacion,
    Comentario,
    Like,
    Compartir ,
    Reportar,
    ReportarComentario
}