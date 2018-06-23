const express = require('express');

const { verificacionToken } = require('../middlewares/autenticacion');

let app = express();
let Producto = require('../models/producto');


app.get('/productos', verificacionToken, (req, res) => {


    //Trae todos los productos
    //populate usuario y categoría
    //paginado
    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);

    Producto.find({ disponible: true }, ' nombre precioUni ')
        .populate('usuario', ' nombre email ')
        .populate('categoria', ' nombre ')
        .skip(desde)
        .limit(limite)
        .exec((err, productoDB) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            if (!productoDB) {
                return res.status(500).json({
                    ok: true,
                    message: 'No hay productos'
                })
            }

            res.json({
                ok: true,
                producto: productoDB
            });
        });

});


app.get('/productos/buscar/:termino', verificacionToken, (req, res) => {

    let termino = req.params.termino;

    let regex = new RegExp(termino, 'i');

    Producto.find({ nombre: regex })
        .populate('categoria', 'nombre')
        .exec((err, productoDB) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            if (!productoDB) {
                return res.status(500).json({
                    ok: true,
                    message: 'No hay productos'
                })
            }

            res.json({
                ok: true,
                producto: productoDB
            });
        });


});

app.get('/productos/:id', (req, res) => {

    //populate usuario y categoría
    //paginado
    let id = req.params.id;

    Producto.findById(id, ' nombre precioUni ')
        .populate('usuario', ' nombre email ')
        .populate('categoria', ' nombre ')
        .exec((err, productoDB) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            if (!productoDB) {
                return res.status(500).json({
                    ok: false,
                    message: 'No existe el producto'
                });
            }

            res.json({
                ok: true,
                producto: productoDB
            });
        });

});


app.post('/productos', verificacionToken, (req, res) => {
    //grabar usuario, categoria, 
    let body = req.body;

    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: true,
        categoria: body.categoriaID,
        usuario: req.usuario._id

    });

    producto.save((err, productoDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            producto: productoDB
        });
    });

});

app.put('/productos/:id', (req, res) => {
    //actualizar usuario, categoria, 
    let id = req.params.id;
    let body = req.body;


    Producto.findById(id, (err, productoDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                message: 'No existe el producto'
            });
        }

        productoDB.nombre = body.nombre;
        productoDB.disponible = body.disponible;
        productoDB.categoria = body.categoria;
        productoDB.descripcion = body.descripcion;
        productoDB.precioUni = body.precioUni;

        productoDB.save((err, productoGuardado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                producto: productoGuardado
            })

        });
    });


});


app.delete('/productos/:id', (req, res) => {
    //borrar producto. disponible = false 
    let id = req.params.id;

    let cambiaEstado = {
        disponible: false
    };

    Producto.findByIdAndUpdate(id, cambiaEstado, (err, productoBorrado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            producto: productoBorrado,
            message: 'Producto borrado'
        });

    });

});


module.exports = app;