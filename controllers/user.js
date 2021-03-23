const fs = require('fs'); //obtiene el avatar permite trabajar con el sistema de archivos en su computadora.
const path = require('path') //obtiene la url

const bycript = require("bcrypt-nodejs");
const jwt = require('../services/jwt')
const User = require("../models/user");
const { exists } = require('../models/user');
const user = require('../models/user');
const { use } = require('../routes/user');


function signUp(req,res){
    
    const user = new User();

    const {name,lastname,email,password,repeatPassword} = req.body;

    user.name = name;
    user.lastname = lastname;
    user.email = email.toLowerCase();
    user.role = "admin";
    user.active = false;


    if(!password || !repeatPassword ){
        res.status(404).send({message: "Las contraseñas son obligatorias."})

    }else{
        if(password !== repeatPassword){
            res.status(404).send({message: "Las contraseñas no son iguales."})
        }else{

            bycript.hash(password,null,null,function(err,hash){
                if(err){
                    res.status(500).send({message: "Erro al encriptar la contraseña"})
                }else{
                  //   res.status(200).send({message: hash})  para ver la contraseña encriptada
                    user.password = hash;
                    
                    user.save((err,userStored)=>{

                        if(err){
                            res.status(500).send({message: "el usuario ya existe"})
                        }else{
                            if(!userStored){
                                res.status(404).send({message: "erro al crear el usuario"})
                            }else{
                                res.status(200).send({user: userStored})
                            }
                        }


                    })
                }



            })
          //  res.status(200).send({message: "Usuario creado."})
        }
    }


}


function signIn(req,res){

   const params = req.body; // es el objeto con los datos  user: "x", email;"x"
  const email = params.email.toLowerCase(); 
  const password = params.password;

User.findOne({email},(err,userStored)=>{
    if(err){
        res.status(500).send({message:"Error en el servidor"})
    }else{
        if(!userStored){
            res.status(404).send({message:"Usuario no encontrado"})
        }else{
            bycript.compare(password,userStored.password,(err,check)=>{
                if(err){
                    res.status(500).send({message:"Error en el servidor"})
                }else if(!check){

                    res.status(404).send({message:"La contraseña es incorrecta"})
                } else{
                    if(!userStored.active){
                        res.status(200).send({code:200,message:"El usuario no se ha activado"})
                    }else{
                        res.status(200).send({
                            accessToken: jwt.createAccessToken(userStored),
                            refreshToken: jwt.createRefreshToken(userStored)
                        })
                    }
                }
            })
        }
    }
})

}


function getUsers(req,res){
 
    User.find().then(users=>{
        if(!users){
            res.status(404).send({message:"No se ha encontrado ningun usuario"})
        }else{
            res.status(200).send({users})
        }
    })
}


function getUsersActive(req,res){

    const query = req.query;

 
    User.find({active : query.active}).then(users=>{
        if(!users){
            res.status(404).send({message:"No se ha encontrado ningun usuario"})
        }else{
            res.status(200).send({users})
        }
    })
}


function uploadAvatar(req, res) {
    const params = req.params;
   
    User.findById({ _id: params.id }, (err, userData) => {
      if (err) {
        res.status(500).send({ message: "Server Error." });
      } else {
        if (!userData) {
          res.status(404).send({ message: "User not found." });
        } else {
          let user = userData;
   
          if (req.files) {
            let filePath = req.files.avatar.path;
            let fileName = filePath.replace(/^.*[\\\/]/, "");
            //  let fileSplit = filePath.split("/");
            // let fileName = fileSplit[2];
            let extSplit = fileName.split(".");
            let fileExt = extSplit[1];
   
            if (fileExt !== "png" && fileExt !== "jpg") {
              res.status(400).send({
                message:
                  "Image extension not valid. (Extensions Allowed: .png and .jpg)"
              });
            } else {
              user.avatar = fileName;
              User.findByIdAndUpdate(
                { _id: params.id },
                user,
                (err, userResult) => {
                  if (err) {
                    res.status(500).send({ message: "Server Error." });
                  } else {
                    if (!userResult) {
                      res.status(404).send({ message: "User not found." });
                    } else {
                      res.status(200).send({ avatarName: fileName });
                    }
                  }
                }
              );
            }
          }
        }
      }
    });
  }
   

function getAvatar(req,res) {

    

    const avatarName = req.params.avatarName;
    const filePath = "./uploads/avatar/" + avatarName;

    fs.exists(filePath,exists =>{
        if(!exists){
            res.status(404).send({message : "El avatar que buscas no existe"})
        }else{
            res.sendFile(path.resolve(filePath))
        }
    })
    
}


async function updateUser(req,res){

    //body todo el contenido del user de BD
    let userData = req.body;
    userData.email = req.body.email.toLowerCase();
    const params = req.params


    if(userData.password) {
     await   bycript.hash(userData.password,null,null,(err,hash)=>{
            if(err){
                res.status(500).send({message : "Error al encriptar la contraseña"})
            }else{
                userData.password= hash;
            }
          
        })

      
    }


    //userData todo loq ue queremos que actualize

    User.findByIdAndUpdate({_id: params.id}, userData,(err,userUpdate)=>{
        if(err){
            res.status(500).send({message : "Error en el servido"});

        }else{
            if(!userUpdate){
                res.status(404).send({message: "no se ha encontrado ningun usuario"})
            }else{
                res.status(200).send({message : "Usuario actualizado"})
            }
        }
    })
   
}


function activateUser (req,res){
    const {id} = req.params;
    const {active} = req.body;

    User.findByIdAndUpdate(id,{active},(err,userStored)=>{
        if(err){
            res.status(500).send({message : "Error del servidor"})
        }else{
            if(!userStored){
                res.status(404).send({message : "No se ha encontrado ningun usuario"}) 
            }else{
                if(active === true){
                    res.status(200).send({message : "ACTIVADO"}) 
                }else{
                    res.status(200).send({message : "DESACTIVADO"}) 
                }
            }
        }
    })
}


function deleteUser(req,res){
    
    const {id} = req.params;
    
    User.findByIdAndRemove(id,(err,userDelete)=>{
        if(err){
            res.status(500).send({message: "Error en el servidor"})
        }else{
            if(!userDelete){
                res.status(404).send({message: "Usuario no encontrado"})
            }else{
                res.status(200)
                .send({message: "Usuario borrado de la Base de Datos"})
            }
        }
    })
    
}

function  signUpAdmin(req,res){

    const user = new User();

    const {name,lastname, email,role,password} = req.body;

    user.name = name;
    user.lastname = lastname;
    user.email = email.toLowerCase();
    user.role = role;
    user.active = true;

    if(!password){
        res.status(500).send({message : "La contraseña es obligatoria"})
    }else{
        bycript.hash(password,null,null,(err,hash)=>{
            if(err){
                res.status(500).send({message: "Error al encriptar la contraseña"})
            }else{
                user.password = hash;

                user.save((err,userStored)=>{
                    if(err){
                        res.status(500).send({message : "El usuario ya existe"})
                    }else{
                        if(!userStored){
                            res.status(500).send({message : "Error al crear al usuario"})
                        }else{
                            res.status(200).send({message: "Usuario nuevo creado"})
                        }
                    }
                })
            }
        })
    }

}






module.exports ={
    signUp,
    signIn,
    getUsers,
    getUsersActive,
    uploadAvatar,
    getAvatar,
    updateUser,
    activateUser,
    deleteUser,
    signUpAdmin
}