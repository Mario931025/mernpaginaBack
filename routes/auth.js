const expreess = require("express");
const AuthController = require("../controllers/auth")

const api = expreess.Router();

api.post("/refresh-access-token",AuthController.refreshToken)

module.exports = api; 

