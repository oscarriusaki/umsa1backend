const express = require("express");
const cors = require("cors");
const { conectar }= require("../database/config");

class Serve {
    constructor() {
        this.app = express();
        this.port = process.env.PORT
        this.path = {
            user:'/api/user',
            login:'/api/login',
            publicacion:'/api/publicacion',
            comentario: '/api/comentario',
            buscar: '/api/buscar',
            // reportar: '/api/reportar'
        };
        this.database()
        this.midlewares();
        this.routes();
    }
    async database(){
        await conectar();
    }
    midlewares() {
        this.app.use(cors());
        this.app.use(express.json());
        this.app.use(express.static('public'))
    }
    routes() {
        this.app.use(this.path.user, require('../routes/user'));
        this.app.use(this.path.login, require('../routes/login'));
        this.app.use(this.path.publicacion, require('../routes/publicacion'));
        this.app.use(this.path.comentario, require('../routes/comentario'))
        this.app.use(this.path.buscar, require('../routes/buscar'))
        // this.app.use(this.path.reportar, require('../routes/reportar'))
    }
    listen() {
        this.app.listen(this.port, () => {
            console.log("Servidor escuchando en el puerto: ", this.port);
        })
    }
}
module.exports = Serve;