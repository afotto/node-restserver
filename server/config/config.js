process.env.PORT = process.env.PORT || 3000;


/*
ambiente
*/
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

/*
BD
*/
let urlBD

if (process.env.NODE_ENV === 'dev') {
    urlBD = 'mongodb://localhost:27017/cafe';
} else {
    // urlBD = 'mongodb://cafe-user:afo123@ds035290.mlab.com:35290/cafe'
    urlBD = process.env.MONGO_URI;
}

process.env.URLDB = urlBD;

/*
Vencimiento del token
*/
process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;


/*
SEED de autenticación
*/
process.env.SEED = process.env.SEED || 'secreto';