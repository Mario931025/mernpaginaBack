const Menu = require("../models/menu");

function addMenu(req,res){
   
    const {title, url, order, active} = req.body;

    const menu = new Menu();

    menu.title = title;
    menu.url = url;
    menu.order = order;
    menu.active = active;

    menu.save((err,createMenu) =>{
        if(err){
            res.status(500).send({message: "Error en el servidor"})
        }else{
            if(!createMenu){
                res.status(404).send({message: "Error al crear menu"})
            }else{
                res.status(200).send({message: "Menu creado correctamente"})
            }
        }
    })

}

function getMenu(req,res){
   
    Menu.find()
        .sort({order : "asc"}) // ordena el cmapo de order de forma asc
        .exec((err,menuSored) =>{  //ejecuta esa query a mongo
            if(err) {
                res.status(500).send({message: "Error del servidor"})
            }else{
                if(!menuSored){
                    res.status(404).send({message: "No se ha encontrado el elemento en la BD"})
                }else{
                    res.status(200).send({ menu: menuSored})
                }
            }
        })
}

function updateMenu(req, res){
    let menuData = req.body;
    const params = req.params;

    Menu.findByIdAndUpdate(params.id,menuData,(err,menuUpdate)=>{
        if(err){
            res.status(500).send({message:"Error del servidor"})
        }else{
            if(!menuUpdate){
                res.status(404).send({message: "No se ha encontrado ningun menu."})
            }else{
                res.status(200).send({message: "Menu actualizado correctamente."})
            }
        }
    })
}

function activateMenu(req, res){
    const {id} = req.params;
    const {active} = req.body;

    Menu.findByIdAndUpdate(id,{active},(err,menuStored)=>{
        if(err){
            res.status(500).send({message:"Error del servidor"})
        }else{
            if(!menuStored){
                res.status(404).send({message: "No se ha encontrado ningun menu."})
            }else{
                if(active === true){
                    res.status(200).send({message: "Menu activado correctamente."})
                }else{
                    res.status(200).send({message: "Menu desactivado correctamente."})
                }
              
            }
        }
    })
}



function deleteMenu(req,res){
    const {id} = req.params;

    Menu.findByIdAndRemove(id,(err,menuDelete)=>{

        if(err){
            res.status(500).send({message : "Error del servidor"})
        }else{
            if(!menuDelete){
                res.status(404).send({message : "Menu no encontrado"})
            }
            else{
            res.status(200).send({message: "El menu ha sido eliminado correctamente"})
             }
        }
         })
}






module.exports = {
    addMenu,
    getMenu,
    updateMenu,
    activateMenu,
    deleteMenu
}