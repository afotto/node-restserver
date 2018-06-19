const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')

const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);

const Usuario = require('../models/usuario');
const app = express();

app.post('/login', (req, res) => {

    let body = req.body;

    Usuario.findOne({ email: body.email }, (err, usuarioDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        };

        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario o constraseña incorrectos'
                }
            });
        }

        if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario o constraseña incorrectos'
                }
            });

        }

        let token = jwt.sign({
            usuario: usuarioDB,
        }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });

        res.json({
            ok: true,
            usuario: usuarioDB,
            token
        });


    });

    // res.json({
    //     ok: true
    // });
});

//Configuraciones de google
async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();

    // console.log(payload.name);
    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.image,
        google: true
    }

}

app.post('/google', async(req, res) => {

    let token = req.body.idtoken;

    let userGoogle = await verify(token)
        .catch(e => {
            return res.status(403).json({
                ok: false,
                err: e
            });
        });

    // res.json({
    //     userGoogle
    // });

    Usuario.findOne({ email: userGoogle.email }, (err, usuarioDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        };

        // res.json({
        //     usuarioDB
        // });

        // //Existe el USR en la BD, no debería poder autenticarse con Google
        if (usuarioDB) {
            //Si no se autentico por google, que use sus claves normales
            if (usuarioDB.google === false) {
                if (err) {
                    return res.status(400).json({
                        ok: false,
                        err: {
                            message: 'Debe utilizar su autenticación normal'
                        }
                    });
                };
            } else {
                //Se ha autenticado previamente con google => le renuevo el token
                let token = jwt.sign({
                    usuario: usuarioDB,
                }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });

                return res.json({
                    ok: true,
                    usuario: usuarioDB,
                    token
                });
            }
        } else {
            //No existe en la BD, se autentico con google => lo creo
            let usuario = new Usuario();

            usuario.nombre = userGoogle.nombre;
            usuario.email = userGoogle.email;
            usuario.img = userGoogle.img;
            usuario.google = true;
            usuario.password = ':)'; //Cualquier cosa, para que pase la validación

            usuario.save((err, usuarioDB) => {

                if (err) {
                    return res.status(500).json({
                        ok: false,
                        err
                    });
                };


                let token = jwt.sign({
                    usuario: usuarioDB,
                }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });

                return res.json({
                    ok: true,
                    usuario: usuarioDB,
                    token
                });
            });
        }
    });
});

module.exports = app;