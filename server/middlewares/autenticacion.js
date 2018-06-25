const jwt = require('jsonwebtoken');
//============================
//Verificar Token
//============================
let verificacionToken = (req, res, next) => {

    let token = req.get('token');

    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token inválido'
                }
            });
        }

        req.usuario = decoded.usuario;
        next();
    });



};

//============================
//Verifica Admin Role
//============================
let verificaAdmin_Role = (req, res, next) => {

    let usuario = req.usuario;

    if (usuario.role != 'ADMIN_ROLE') {
        return res.json({
            ok: false,
            err: {
                message: 'El usuario no es administrador'
            }
        });
    }

    next();
};

//============================
//Verifica Token img
//============================
let verificaTokenImg = (req, res, next) => {

    let token = req.query.token;

    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token inválido'
                }
            });
        }

        req.usuario = decoded.usuario;
        next();
    });
}


module.exports = {
    verificacionToken,
    verificaAdmin_Role,
    verificaTokenImg
}