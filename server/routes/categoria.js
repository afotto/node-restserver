const express = require('express');
const _ = require('underscore');

let { verificacionToken, verificaAdmin_Role } = require('../middlewares/autenticacion');

let app = express();

let Categoria = require('../models/categoria');

//============================
//Listado de categorias
//============================
app.get('/categoria', verificacionToken, function(req, res) {

    Categoria.find({ estado: true }, 'nombre , descripcion , estado')
        .populate()
        .exec((err, categoriasDB) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });

            }

            //console.log(categoriasDB);

            res.json({
                ok: true,
                categoriasDB
            });

        });

});


//============================
//Devuelvo una categoria
//============================
app.get('/categoria/:id', verificacionToken, (req, res) => {

    let id = req.params.id;

    Categoria.findById(id)
        .exec((err, categoriasDB) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });

            }

            if (!categoriasDB) {
                return res.status(400).json({
                    ok: false,
                    message: 'No hay categoría con ese ID'
                });
            }

            res.json({
                ok: true,
                categorias: categoriasDB
            });
        });

});

//============================
//Creo y devuelvo una nueva categoría
//============================
app.post('/categoria', verificacionToken, function(req, res) {

    let body = req.body;
    // console.log(body);

    let categoria = new Categoria({
        nombre: body.nombre,
        descripcion: body.descripcion
    });

    // console.log(categoria);
    categoria.save((err, categoriaDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });
    });
});

//============================
//Actualizo la categoría
//============================
app.put('/categoria/:id', verificacionToken, (req, res) => {

    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'descripcion', 'estado']);
    // console.log(id);

    Categoria.findByIdAndUpdate(id, body, (err, categoriaDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });
    });
});

//============================
//Borro la categoría
//============================
app.delete('/categoria/:id', [verificacionToken, verificaAdmin_Role], (req, res) => {

    let id = req.params.id;

    let cambiaEstado = {
        estado: false
    };

    Categoria.findByIdAndUpdate(id, cambiaEstado, (err, categoriaBorrada) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoria: categoriaBorrada
        });
    })

});

module.exports = app;