const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();

const Usuario = require('../models/usuario');
const Producto = require('../models/producto');
const fs = require('fs');
const path = require('path');

// default options
app.use(fileUpload());



app.put('/uploads/:tipo/:id', function(req, res) {

    let tipo = req.params.tipo;
    let id = req.params.id;

    if (!req.files) {
        return res.status(400)
            .json({
                ok: false,
                err: {
                    message: 'No hay archivo'
                }
            });
    }

    //Validar tipo
    //console.log(tipo);
    let tiposValidos = ['productos', 'usuarios'];
    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Las tipos permitidas son: ' + tiposValidos.join(', ')
            }
        });
    }

    let archivo = req.files.archivo;

    //extensiones permitidas
    let extensionesValidas = ['png', 'jpg', 'gif'];
    let nombreArchivo = archivo.name.split('.');
    let extension = nombreArchivo[1];

    if (extensionesValidas.indexOf(extension) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Las extensiones permitidas son: ' + extensionesValidas.join(', ')
            }
        });
    }

    //Cambiar nombre al archivo
    let nombreArchivoNew = `${ id }-${new Date().getMilliseconds()}.${ extension }`;

    archivo.mv(`uploads/${ tipo }/${ nombreArchivoNew }`, function(err) {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        //Aqui ya está en el filesystem
        if (tipo === 'usuarios') {
            imagenUsuario(id, res, nombreArchivoNew);
        } else {
            imagenProducto(id, res, nombreArchivoNew);
        }

    });
});

function imagenProducto(id, res, nombreArchivoNew) {

    Producto.findById(id, (err, productoDB) => {
        if (err) {

            borraArchivo(nombreArchivoNew, 'productos');

            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {
            borraArchivo(nombreArchivoNew, 'productos');

            return res.status(400).json({
                ok: false,
                message: 'No existe el producto'
            });
        }

        borraArchivo(productoDB.img, 'productos');

        productoDB.img = nombreArchivoNew;

        productoDB.save((err, prodGuardado) => {
            res.json({
                ok: true,
                prod: prodGuardado
            });
        });
    });

}

function imagenUsuario(id, res, nombreArchivoNew) {
    Usuario.findById(id, (err, usuarioBD) => {
        if (err) {

            borraArchivo(nombreArchivoNew, 'usuarios');

            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!usuarioBD) {
            borraArchivo(nombreArchivoNew, 'usuarios');

            return res.status(400).json({
                ok: false,
                message: 'No existe el usuario'
            });
        }

        borraArchivo(usuarioBD.img, 'usuarios');

        usuarioBD.img = nombreArchivoNew;

        usuarioBD.save((err, usuarioGuardado) => {
            res.json({
                ok: true,
                usuario: usuarioGuardado
            });
        });


    });

}

function borraArchivo(nombreImg, tipo) {

    let pathImagen = path.resolve(__dirname, `../../uploads/${ tipo }/${ nombreImg }`);
    if (fs.existsSync(pathImagen)) {
        fs.unlinkSync(pathImagen);
    }
}

module.exports = app;