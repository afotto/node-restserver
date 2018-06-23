const mongoose = require('mongoose');

let Schema = mongoose.Schema;


let categoriaSchema = new Schema({

    nombre: {
        type: String,
        unique: true,
        required: [true, 'El nombre es necesario']
    },
    descripcion: {
        type: String,
        required: [true, 'Es requerida la descripción']
    },
    estado: {
        type: Boolean,
        default: true
    }

});

module.exports = mongoose.model('Categoria', categoriaSchema);