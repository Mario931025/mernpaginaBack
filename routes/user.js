const express = require("express");
const UserController = require("../controllers/user");
const md_auth = require("../middleware/authentiticated")

//para poner las rutas
const api = express.Router();


//de tipo post, nombre de la url y el metodo que usa. 
api.post("/sign-up", UserController.signUp);
api.post("/sign-in", UserController.signIn);
api.get("/users",[md_auth.ensureAuth], UserController.getUsers);
api.get("/users-active",[md_auth.ensureAuth], UserController.getUsersActive);


module.exports = api;


