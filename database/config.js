const mongoose = require('mongoose');

const conectar = async() =>{
    try{
        await mongoose.connect(process.env.MONGODB_CNN);
        console.log('conectado');
    }catch(err){
        console.log(err);
        return new Error('No se pudo conectar a la base de datos')
    }
}

module.exports = {
    conectar
}