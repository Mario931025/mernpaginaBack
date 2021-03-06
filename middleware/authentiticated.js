const jwt = require("jwt-simple");
const moment = require("moment")


const SECRET_KEY = "kaiw1545"

exports.ensureAuth = (req,res,next)=>{
    if(!req.headers.authorization){
        return res
        .status(403)
        .send({message: "La petición no tiene cabecera de Autentificación"})
    }

    //limpia el token
    const token = req.headers.authorization.replace(/['"]+/g, "");

    try{
        var payload = jwt.decode(token,SECRET_KEY)

        if(payload.exp <= moment.unix()){

            return res.status(404).send({message:"El token ha expirado"})

        }
    } catch(ex){

        return res.status(404).send({message:"Token invalido"})
    }

    req.user = payload;  //si todo ok devuelve el token
    next(); //para que ejecute la siguiente funcion de rutas
}