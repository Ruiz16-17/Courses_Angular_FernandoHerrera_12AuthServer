//Necessary installations
//npm i bcryptjs cors dotenv express express-validator jsonwebtoken mongoose

//bcryptjs for encrypting data (passwords...)
//cors for other other request domain

const express = require('express');
const cors = require('cors');
const { dbConnection } = require('./db/config.js');
const path = require('path');
require('dotenv').config();

//create a server

const app = express();

//BD
dbConnection();

//Public directory
app.use( express.static('public') );

//CORS 
app.use( cors() );

//Read and parse the request (body)
app.use( express.json() );

//Start the server

//Routes

app.use('/api/auth', require('./routes/auth.js'));

//Manejar todas las demas rutas
app.get( '*', (req, res) => {
    res.sendFile( path.resolve( __dirname, 'public/index.html' ) );
});

//La otra forma es usar el hash en Angular

app.listen(process.env.PORT, () => {
    console.log(`Server started at port ${ process.env.PORT }`)
});

//Para revisar los logs de heroku (1000 se refiere a las líneas que va a mostrar)
//heroku logs -n 1000 --tail
//ruiz1617-angular-auth