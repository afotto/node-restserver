require('./config/config')
const express = require('express');
const app = express();
//Este paquete (bodyParser) serializa en un objeto json la información 
//enviada en un POST:
const bodyParser = require('body-parser');


//Son midelware's, se ejecutarán c/vez que pase por aquí en c/petición
//parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.get('/', function(req, res) {
    res.json('Hello World')
});


app.post('/usuario', function(req, res) {

    //Este es el body que arma el bodyParser
    let body = req.body;

    if (body.nombre === undefined) {
        return res.status(400).json({
            ok: false,
            mensaje: 'El nombre es necesario'
        });
    } else {
        res.json({
            body: body
        });
    }

});


app.listen(process.env.PORT, () => {
    console.log(`Escuchando puerto ${process.env.PORT}`);
});