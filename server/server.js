require('./config/config')
const express = require('express');
const app = express();
// Using Node.js `require()`
const mongoose = require('mongoose');


//Este paquete (bodyParser) serializa en un objeto json la información 
//enviada en un POST:
const bodyParser = require('body-parser');


//Son midelware's, se ejecutarán c/vez que pase por aquí en c/petición
//parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.use(require('./routes/usuario'));

mongoose.connect(process.env.URLDB, (err, res) => {
    if (err) throw err;

    console.log('BD On-line');
});

app.listen(process.env.PORT, () => {
    console.log(`Escuchando puerto ${process.env.PORT}`);
});