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
    urlBD = 'mongodb://cafe-user:afo123@ds035290.mlab.com:35290/cafe'
}

process.env.URLDB = urlBD;