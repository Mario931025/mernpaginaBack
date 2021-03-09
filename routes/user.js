const express = require("express");
const UserController = require("../controllers/user");


//para poner las rutas
const api = express.Router();


//de tipo post, nombre de la url y el metodo que usa. 
api.post("/sign-up", UserController.signUp);

module.exports = api;


