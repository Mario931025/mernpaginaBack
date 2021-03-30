const express = require("express");
const bodyParser = require("body-parser");
const cors = require('cors');

const app = express();
const {API_VERSION} = require("./config")


//cors
app.use(cors())


//carga rutas
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const menuRoutes = require('./routes/menu');
const newsletterRoutes = require('./routes/newsletter')
const courseRoutes = require("./routes/course")



app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())

//configuracion headers http
// Configure Header HTTP
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method"
    );
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
    res.header("Allow", "GET, POST, OPTIONS, PUT, DELETE");
    next();
  });
  

//rutas basicas
app.use(`/api/${API_VERSION}`, authRoutes)
app.use(`/api/${API_VERSION}`,userRoutes);
app.use(`/api/${API_VERSION}`,menuRoutes);
app.use(`/api/${API_VERSION}`,newsletterRoutes);
app.use(`/api/${API_VERSION}`,courseRoutes);


module.exports = app; 