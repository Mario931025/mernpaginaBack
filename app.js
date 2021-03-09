const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const {API_VERSION} = require("./config")


//carga rutas
const userRoutes = require('./routes/user')



app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())

//rutas basicas
app.use(`/api/${API_VERSION}`,userRoutes);


module.exports = app; 